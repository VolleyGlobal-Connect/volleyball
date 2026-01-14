"""Job management API endpoints."""

from typing import Optional

from fastapi import APIRouter, HTTPException

from ..models import DataCategory
from ..scheduler import get_scheduler

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@router.get("")
async def list_jobs() -> dict:
    """List all scheduled jobs and their status."""
    scheduler = get_scheduler()
    status = scheduler.get_status()

    return {
        "jobs": [
            {
                "id": "volleyball_collection",
                "name": "Volleyball Data Collection",
                "interval_minutes": status["interval_minutes"],
                "next_run_at": status["next_run_at"],
                "is_running": status["collection_in_progress"],
            }
        ],
        "scheduler_running": status["scheduler_running"],
    }


@router.get("/status")
async def get_job_status() -> dict:
    """Get detailed status of the collection job."""
    scheduler = get_scheduler()
    return scheduler.get_status()


@router.post("/trigger")
async def trigger_collection(
    state: Optional[str] = None,
    country: str = "USA",
    category: Optional[DataCategory] = None,
) -> dict:
    """
    Manually trigger a data collection run.

    If state is not provided, uses the next state in rotation.
    """
    scheduler = get_scheduler()

    if scheduler.is_running:
        raise HTTPException(
            status_code=409,
            detail="Collection already in progress. Please wait for it to complete."
        )

    result = await scheduler.trigger_manual(
        state=state,
        country=country,
        category=category,
    )

    return result


@router.post("/pause")
async def pause_scheduler() -> dict:
    """Pause the automatic scheduler."""
    scheduler = get_scheduler()
    scheduler.scheduler.pause()
    return {"status": "paused", "message": "Scheduler paused"}


@router.post("/resume")
async def resume_scheduler() -> dict:
    """Resume the automatic scheduler."""
    scheduler = get_scheduler()
    scheduler.scheduler.resume()
    return {"status": "resumed", "message": "Scheduler resumed"}


@router.post("/reset-cycle")
async def reset_cycle() -> dict:
    """Reset the collection cycle to start from the beginning."""
    from ..storage import get_storage

    storage = get_storage()
    storage.reset_cycle()

    return {
        "status": "success",
        "message": "Collection cycle reset. Will start from first state on next run."
    }
