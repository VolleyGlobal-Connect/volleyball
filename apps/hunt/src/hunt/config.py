"""Configuration management for Hunt application."""

import os
from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Groq Configuration
    groq_api_key: str

    # LangSmith Configuration (optional)
    langchain_tracing_v2: bool = True
    langchain_api_key: Optional[str] = None
    langchain_project: str = "volleyball-hunt"

    # Scheduler Configuration
    schedule_interval_minutes: int = 30
    results_per_run: int = 30

    # Application Settings
    debug: bool = False

    def configure_langsmith(self) -> None:
        """Configure LangSmith environment variables if API key is provided."""
        if self.langchain_api_key:
            os.environ["LANGCHAIN_TRACING_V2"] = str(self.langchain_tracing_v2).lower()
            os.environ["LANGCHAIN_API_KEY"] = self.langchain_api_key
            os.environ["LANGCHAIN_PROJECT"] = self.langchain_project


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
