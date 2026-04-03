import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.core.config import settings
from backend.models.schemas import (
    UIAnalysisRequest,
    UIAnalysisResponse,
    BrainScoreRequest,
    BrainScoreResult,
)
from backend.services.scoring_service import analyze_visual_strain, compute_brain_score
from backend.services.agent_service import refactor_ui_code
from backend.services.scoring_service import get_tribe_model   


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Cortex Brain Node starting — pre-loading models...")
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, get_tribe_model)   
    print("Model warm-up complete. Brain Node online.")
    yield
    print("Brain Node shutting down.")

app = FastAPI(
    title="Cortex Brain Node",
    description=(
        "In-Silico Cognitive Load Balancer. "
        "Scores UI components via Meta TRIBE v2 neural simulation "
        "and auto-remediates high-friction code with an AI agent."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "online",
        "demo_mode": settings.DEMO_MODE,
        "llm_available": settings.GEMINI_API_KEY != "",
    }

@app.post("/api/analyze", response_model=UIAnalysisResponse, tags=["Cortex"])
async def analyze_ui(request: UIAnalysisRequest):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="code field must not be empty.")
    if not request.image_base64.strip():
        raise HTTPException(status_code=400, detail="image_base64 field must not be empty.")

 
    try:
        score_data = await analyze_visual_strain(
            image_base64=request.image_base64,
            raw_code=request.code,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scoring pipeline failed: {e}")

    friction_score: float = score_data["friction_score"]
    is_critical = friction_score > 75

 
    refactored_code: str | None = None

    if is_critical:
        if settings.DEMO_MODE:
 
            refactored_code = _demo_refactor_placeholder(request.code)
            message = (
                f"CRITICAL OVERLOAD — Friction Score: {friction_score:.0f}/100. "
                "Demo mode active: returning placeholder refactor."
            )
        elif settings.GEMINI_API_KEY:
            try:
                refactored_code = await refactor_ui_code(
                    raw_code=request.code,
                    image_base64=request.image_base64,
                )
                message = (
                    f"CRITICAL OVERLOAD — Friction Score: {friction_score:.0f}/100. "
                    "Code auto-refactored for near-zero cognitive load."
                )
            except Exception as e:

                message = (
                    f"CRITICAL OVERLOAD — Friction Score: {friction_score:.0f}/100. "
                    f"Refactor agent failed: {e}"
                )
        else:
            message = (
                f"CRITICAL OVERLOAD — Friction Score: {friction_score:.0f}/100. "
                "No LLM configured — set GEMINI_API_KEY to enable auto-refactor."
            )
    else:
        message = f"NOMINAL — Friction Score: {friction_score:.0f}/100. No intervention required."

    return UIAnalysisResponse(
        status="critical" if is_critical else "nominal",
        friction_score=friction_score,
        message=message,
        refactored_code=refactored_code,
    )



@app.post("/api/brain-score", response_model=BrainScoreResult, tags=["Cortex"])
def brain_score(request: BrainScoreRequest):
    if not any([request.text, request.video_path, request.audio_path]):
        raise HTTPException(
            status_code=400,
            detail="Provide at least one of: text, video_path, audio_path.",
        )
    try:
        return compute_brain_score(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Brain scoring failed: {e}")


def _demo_refactor_placeholder(original_code: str) -> str:
    return (
        "// [DEMO MODE] Auto-refactored by Cortex Agent\n"
        "// Replace GEMINI_API_KEY and set DEMO_MODE=False for live refactoring.\n\n"
        + original_code
    )
