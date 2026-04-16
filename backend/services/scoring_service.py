import torch
import base64
import re
import asyncio
import numpy as np
from io import BytesIO
from PIL import Image
import torchvision.transforms as transforms
import torchvision.io
from backend.models.schemas import BrainScoreRequest, BrainScoreResult
from backend.core.tribe_client import get_tribe_model

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

TRIBE_TIMEOUT_SECONDS = 30  

_resnet_model = None

def get_resnet_model():
    global _resnet_model
    if _resnet_model is None:
        import torchvision.models as models
        _resnet_model = models.resnet18(pretrained=True).eval().to(device)
        print("ResNet18 fallback loaded.")
    return _resnet_model


def _score_with_tribe(image: Image.Image) -> dict:
    import tempfile, os
    model = get_tribe_model()

    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp:
        image_array = np.array(image.resize((224, 224)))
        frames = torch.from_numpy(image_array).unsqueeze(0).repeat(30, 1, 1, 1)
        torchvision.io.write_video(tmp.name, frames, fps=30)
        tmp_path = tmp.name

    try:
        df = model.get_events_dataframe(video_path=tmp_path)
        preds, _ = model.predict(events=df)            
        mean_activation = np.abs(preds).mean(axis=0)  

        ROI = {
            "visual_cortex":     (5000, 6500),
            "prefrontal_cortex": (1000, 2000),
        }
        roi_scores = {
            name: float(mean_activation[start:end].mean())
            for name, (start, end) in ROI.items()
        }

        visual  = min(roi_scores["visual_cortex"] / 0.015, 1.0)
        prefron = min(roi_scores["prefrontal_cortex"] / 0.015, 1.0)
        return {"visual_cortex": visual, "prefrontal_cortex": prefron, "source": "tribe"}
    finally:
        os.unlink(tmp_path)


def _score_with_resnet(image_tensor: torch.Tensor) -> dict:
    model = get_resnet_model()
    with torch.no_grad():
        features = model(image_tensor)
        activation = torch.sigmoid(features).cpu().numpy().flatten()

    visual  = min(float(np.mean(activation[:len(activation)//2]) * 1.5), 0.99)
    prefron = min(float(np.mean(activation[len(activation)//2:]) * 1.3), 0.99)
    return {"visual_cortex": visual, "prefrontal_cortex": prefron, "source": "resnet_fallback"}


async def analyze_visual_strain(image_base64: str, raw_code: str) -> dict:
    image_data = re.sub(r'^data:image/.+;base64,', '', image_base64)
    image_bytes = base64.b64decode(image_data)
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    tensor_input = preprocess(image).unsqueeze(0).to(device)

    scores = None
    tribe = get_tribe_model()

    if tribe is not None:
        try:
            scores = await asyncio.wait_for(
                asyncio.get_event_loop().run_in_executor(
                    None, _score_with_tribe, image
                ),
                timeout=TRIBE_TIMEOUT_SECONDS
            )
            print("TRIBE v2 scored successfully.")
        except asyncio.TimeoutError:
            print(f"TRIBE v2 timed out after {TRIBE_TIMEOUT_SECONDS}s — using ResNet fallback.")
        except Exception as e:
            print(f"TRIBE v2 error ({e}) — using ResNet fallback.")

    if scores is None:
        scores = await asyncio.get_event_loop().run_in_executor(None, _score_with_resnet, tensor_input)
        print(f"Fallback source: {scores['source']}")

    visual  = scores["visual_cortex"]
    prefron = scores["prefrontal_cortex"]
    friction_score = min(max(int((visual * 0.6 + prefron * 0.4) * 100), 5), 98)

    return {
        "friction_score": friction_score,
        "regions": {
            "visual_cortex":     round(visual,  2),
            "prefrontal_cortex": round(prefron, 2),
        },
        "scored_by": scores["source"],   
    }


def compute_brain_score(req: BrainScoreRequest) -> BrainScoreResult:
    from backend.core.tribe_client import score_content
    result = score_content(
        video_path=req.video_path,
        audio_path=req.audio_path,
        text=req.text,
    )
    return BrainScoreResult(**result)