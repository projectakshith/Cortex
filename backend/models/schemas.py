from pydantic import BaseModel
from typing import Optional, Dict

class UIAnalysisRequest(BaseModel):
    code: str
    image_base64: str

class UIAnalysisResponse(BaseModel):
    status: str
    friction_score: float
    message: str
    refactored_code: Optional[str] = None
    
class BrainScoreRequest(BaseModel):
    text: Optional[str] = None
    video_path: Optional[str] = None
    audio_path: Optional[str] = None

class BrainScoreResult(BaseModel):
    roi_scores: Dict[str, float]
    cognitive_load_score: float 
    low_load: bool