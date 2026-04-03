from pydantic import BaseModel
from typing import Optional

class UIAnalysisRequest(BaseModel):
    code: str
    image_base64: str

class UIAnalysisResponse(BaseModel):
    status: str
    friction_score: float
    message: str
    refactored_code: Optional[str] = None