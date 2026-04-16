from functools import lru_cache
import numpy as np

ROI_INDICES = {
    "prefrontal":  list(range(1000, 2000)),   
    "visual":      list(range(5000, 6500)),    
    "language":    list(range(3000, 4000)),    
    "default_mode": list(range(8000, 9500)),   
}

@lru_cache(maxsize=1)
def get_tribe_model():
    try:
        from tribev2 import TribeModel
        print("Loading TRIBE v2. This may take a while...")
        model = TribeModel.from_pretrained("facebook/tribev2", cache_folder="./cache/tribe")
        print("TRIBE v2 loaded successfully.")
        return model
    except Exception as e:
        print(f"WARNING: TRIBE v2 unavailable ({e}). Fallback models will be used.")
        return None

def score_content(
    video_path: str = None,
    audio_path: str = None,
    text: str = None,
) -> dict:
    
    model = get_tribe_model()
    if not model:
        raise RuntimeError("TRIBE v2 model is not available.")
        
    df = model.get_events_dataframe(
        video_path=video_path,
        audio_path=audio_path,
        text_path=text,    
    )
    preds, _ = model.predict(events=df)   

    mean_activation = np.abs(preds).mean(axis=0)   

    roi_scores = {
        roi: float(mean_activation[indices].mean())
        for roi, indices in ROI_INDICES.items()
    }
 
    raw = (roi_scores["prefrontal"] * 0.5 + roi_scores["language"] * 0.5)
    cognitive_load_score = float(min(raw / 0.015, 1.0))

    return {
        "roi_scores": roi_scores,
        "cognitive_load_score": cognitive_load_score,
        "low_load": cognitive_load_score < 0.4,
    }