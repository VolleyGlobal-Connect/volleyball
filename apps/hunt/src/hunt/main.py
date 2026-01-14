"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routers import jobs, search
from .scheduler import get_scheduler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    logger.info("Starting Hunt - Volleyball Data Collector")

    settings = get_settings()
    settings.configure_langsmith()

    # Start the scheduler
    scheduler = get_scheduler()
    scheduler.start()

    logger.info("Application started successfully")

    yield

    # Shutdown
    logger.info("Shutting down...")
    scheduler.stop()
    logger.info("Shutdown complete")


# Create FastAPI app
app = FastAPI(
    title="Hunt - Volleyball Data Collector",
    description="AI-powered volleyball venue data collection using Groq Compound agent",
    version="0.1.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(search.router)
app.include_router(jobs.router)


@app.get("/health")
async def health_check() -> dict:
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "hunt",
        "version": "0.1.0",
    }


@app.get("/")
async def root() -> dict:
    """Root endpoint with API info."""
    return {
        "name": "Hunt - Volleyball Data Collector",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "search": "POST /api/search",
            "results": "GET /api/results/{state}",
            "stats": "GET /api/stats",
            "jobs": "GET /api/jobs",
            "trigger": "POST /api/jobs/trigger",
        },
    }
