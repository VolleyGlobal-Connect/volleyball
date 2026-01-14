"""Background scheduler for automated data collection."""

import asyncio
import logging
from datetime import datetime
from typing import Optional

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from .agent import get_agent
from .config import get_settings
from .models import (
    CollectionProgress,
    DataCategory,
    INDIA_STATES,
    USA_STATES,
)
from .query_generator import get_query_generator
from .storage import get_storage

logger = logging.getLogger(__name__)


class CollectionScheduler:
    """Automated scheduler for volleyball data collection."""

    def __init__(self):
        """Initialize the scheduler."""
        self.settings = get_settings()
        self.scheduler = AsyncIOScheduler()
        self.is_running = False
        self._current_job_id: Optional[str] = None

        # State rotation tracking
        self._state_index = 0
        self._category_index = 0
        self._use_india = False  # Alternate between USA and India

        # All states to process
        self._usa_states = USA_STATES.copy()
        self._india_states = INDIA_STATES.copy()
        self._categories = list(DataCategory)

    def start(self) -> None:
        """Start the scheduler."""
        if self.scheduler.running:
            logger.warning("Scheduler is already running")
            return

        # Add the collection job
        self.scheduler.add_job(
            self._run_collection,
            trigger=IntervalTrigger(minutes=self.settings.schedule_interval_minutes),
            id="volleyball_collection",
            name="Volleyball Data Collection",
            replace_existing=True,
        )

        self.scheduler.start()
        logger.info(
            f"Scheduler started. Running every {self.settings.schedule_interval_minutes} minutes"
        )

    def stop(self) -> None:
        """Stop the scheduler."""
        if self.scheduler.running:
            self.scheduler.shutdown(wait=False)
            logger.info("Scheduler stopped")

    def get_next_state(self) -> tuple[str, str]:
        """
        Get the next state to process.

        Returns:
            Tuple of (state, country)
        """
        storage = get_storage()
        completed = storage.get_completed_states()

        # Try USA states first
        for state in self._usa_states:
            key = f"{state}|USA"
            if key not in completed:
                return state, "USA"

        # Then India states
        for state in self._india_states:
            key = f"{state}|India"
            if key not in completed:
                return state, "India"

        # All states completed, reset and start over
        storage.reset_cycle()
        logger.info("All states completed. Starting new cycle.")
        return self._usa_states[0], "USA"

    def get_next_category(self) -> DataCategory:
        """Get the next category to process."""
        category = self._categories[self._category_index]
        self._category_index = (self._category_index + 1) % len(self._categories)
        return category

    async def _run_collection(self) -> dict:
        """Run a single collection cycle."""
        if self.is_running:
            logger.warning("Collection already in progress, skipping")
            return {"status": "skipped", "reason": "already running"}

        self.is_running = True
        storage = get_storage()
        agent = get_agent()
        query_gen = get_query_generator()

        try:
            # Get next state and category
            state, country = self.get_next_state()
            category = self.get_next_category()

            logger.info(f"Starting collection: {category.value} in {state}, {country}")

            # Update progress
            progress = storage.load_progress()
            progress.current_state = state
            progress.current_country = country
            progress.is_running = True
            progress.last_run_at = datetime.utcnow()
            storage.save_progress(progress)

            # Generate optimized query
            query = query_gen.generate_query(state, country, category)

            # Run search
            venues, executed_tools, query_used = await agent.search(
                state=state,
                country=country,
                category=category,
                max_results=self.settings.results_per_run,
                custom_query=query,
            )

            # Save results
            new_count = storage.save_venues(venues)

            # Mark state as completed for this category
            # Only mark fully completed after all categories
            if self._category_index == 0:  # Just wrapped around
                storage.mark_state_completed(state, country)

            # Update final progress
            stats = storage.get_stats()
            progress = storage.load_progress()
            progress.total_results = stats["total_venues"]
            progress.completed_states = len(storage.get_completed_states())
            progress.total_states = len(self._usa_states) + len(self._india_states)
            progress.is_running = False
            storage.save_progress(progress)

            result = {
                "status": "success",
                "state": state,
                "country": country,
                "category": category.value,
                "query_used": query_used,
                "venues_found": len(venues),
                "new_venues_saved": new_count,
                "executed_tools": executed_tools,
            }

            logger.info(f"Collection complete: {result}")
            return result

        except Exception as e:
            logger.error(f"Collection error: {e}")
            progress = storage.load_progress()
            progress.is_running = False
            storage.save_progress(progress)
            return {"status": "error", "error": str(e)}

        finally:
            self.is_running = False

    async def trigger_manual(
        self,
        state: Optional[str] = None,
        country: Optional[str] = None,
        category: Optional[DataCategory] = None,
    ) -> dict:
        """
        Trigger a manual collection run.

        Args:
            state: Optional state to search (uses next in rotation if not provided)
            country: Optional country (defaults to USA)
            category: Optional category (uses next in rotation if not provided)

        Returns:
            Collection result dictionary
        """
        if self.is_running:
            return {"status": "error", "error": "Collection already in progress"}

        # Override next state/category if provided
        if state and country:
            storage = get_storage()
            agent = get_agent()
            query_gen = get_query_generator()

            self.is_running = True
            try:
                cat = category or DataCategory.COURTS
                query = query_gen.generate_query(state, country, cat)

                venues, executed_tools, query_used = await agent.search(
                    state=state,
                    country=country,
                    category=cat,
                    max_results=self.settings.results_per_run,
                    custom_query=query,
                )

                new_count = storage.save_venues(venues)

                return {
                    "status": "success",
                    "state": state,
                    "country": country,
                    "category": cat.value,
                    "query_used": query_used,
                    "venues_found": len(venues),
                    "new_venues_saved": new_count,
                    "executed_tools": executed_tools,
                }
            finally:
                self.is_running = False

        # Otherwise run normal collection
        return await self._run_collection()

    def get_status(self) -> dict:
        """Get scheduler status."""
        storage = get_storage()
        progress = storage.load_progress()

        next_run = None
        job = self.scheduler.get_job("volleyball_collection")
        if job and job.next_run_time:
            next_run = job.next_run_time.isoformat()

        return {
            "scheduler_running": self.scheduler.running,
            "collection_in_progress": self.is_running,
            "interval_minutes": self.settings.schedule_interval_minutes,
            "next_run_at": next_run,
            "progress": progress.model_dump(mode="json"),
        }


# Singleton instance
_scheduler: Optional[CollectionScheduler] = None


def get_scheduler() -> CollectionScheduler:
    """Get or create the scheduler instance."""
    global _scheduler
    if _scheduler is None:
        _scheduler = CollectionScheduler()
    return _scheduler
