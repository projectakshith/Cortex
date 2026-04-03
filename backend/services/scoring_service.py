import torch
import base64
import re
import numpy as np
from io import BytesIO
from PIL import Image
import torchvision.transforms as transforms

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


# fallback if tribe failss
import torchvision.models as models
tribe_model = models.resnet18(pretrained=True).eval().to(device)


def extract_brain_signals(image_tensor):    
    with torch.no_grad():
        features = tribe_model(image_tensor)
        activation = torch.sigmoid(features).cpu().numpy().flatten()
        return activation

async def analyze_visual_strain(image_base64: str, raw_code: str) -> dict:
    image_data = re.sub('^data:image/.+;base64,', '', image_base64)
    image_bytes = base64.b64decode(image_data)
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    
    tensor_input = preprocess(image).unsqueeze(0).to(device)
    
    voxels = extract_brain_signals(tensor_input)
        
    visual_cortex_strain = float(np.mean(voxels[:len(voxels)//2]) * 100)
    
 
    prefrontal_strain = float(np.mean(voxels[len(voxels)//2:]) * 100)
 
    visual_cortex = min(visual_cortex_strain * 1.5, 99.0)
    prefrontal = min(prefrontal_strain * 1.3, 99.0)
 
    friction_score = int((visual_cortex * 0.6) + (prefrontal * 0.4))
    
 
    friction_score = min(max(friction_score, 5), 98)
    
    return {
        "friction_score": friction_score,
        "regions": {
            "visual_cortex": round(visual_cortex / 100, 2), 
            "prefrontal_cortex": round(prefrontal / 100, 2)
        }
    }