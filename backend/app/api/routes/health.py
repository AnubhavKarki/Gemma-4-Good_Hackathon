from fastapi import APIRouter
import ollama
from app.config import get_settings
from app.schemas.responses import HealthCheckResponse

router = APIRouter()


@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    settings = get_settings()
    ollama_ok = False
    try:
        ollama.list()
        ollama_ok = True
    except Exception:
        pass

    return HealthCheckResponse(
        status="healthy" if ollama_ok else "degraded",
        ollama_connected=ollama_ok,
        model_loaded=settings.ollama_model,
    )
