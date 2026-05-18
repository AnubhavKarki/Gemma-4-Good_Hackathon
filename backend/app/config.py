from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "gemma4:e4b"

    host: str = "0.0.0.0"
    port: int = 8000
    reload: bool = True

    allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    max_file_size_mb: int = 20
    upload_dir: str = "./uploads"

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    @property
    def max_file_size_bytes(self) -> int:
        return self.max_file_size_mb * 1024 * 1024

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
