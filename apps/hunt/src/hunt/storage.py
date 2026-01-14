"""Data storage and persistence for collected volleyball data."""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional

from .models import CollectionProgress, DataCategory, VenueData

logger = logging.getLogger(__name__)

# Data directory path
DATA_DIR = Path(__file__).parent.parent.parent / "data"


class Storage:
    """Handles data persistence for collected volleyball venues."""

    def __init__(self, data_dir: Optional[Path] = None):
        """Initialize storage with data directory."""
        self.data_dir = data_dir or DATA_DIR
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self._progress_file = self.data_dir / "progress.json"
        self._venues_file = self.data_dir / "venues.json"

    def save_venues(self, venues: list[VenueData]) -> int:
        """
        Save venues to storage, avoiding duplicates.

        Args:
            venues: List of venues to save

        Returns:
            Number of new venues saved
        """
        existing = self.load_all_venues()
        existing_keys = {self._venue_key(v) for v in existing}

        new_venues = []
        for venue in venues:
            if self._venue_key(venue) not in existing_keys:
                new_venues.append(venue)
                existing_keys.add(self._venue_key(venue))

        if new_venues:
            all_venues = existing + new_venues
            self._write_venues(all_venues)
            logger.info(f"Saved {len(new_venues)} new venues")

        return len(new_venues)

    def _venue_key(self, venue: VenueData) -> str:
        """Generate unique key for a venue."""
        return f"{venue.name.lower()}|{venue.state.lower()}|{venue.country.lower()}"

    def _write_venues(self, venues: list[VenueData]) -> None:
        """Write all venues to file."""
        data = [v.model_dump(mode="json") for v in venues]
        with open(self._venues_file, "w") as f:
            json.dump(data, f, indent=2, default=str)

    def load_all_venues(self) -> list[VenueData]:
        """Load all venues from storage."""
        if not self._venues_file.exists():
            return []

        try:
            with open(self._venues_file) as f:
                data = json.load(f)
                return [VenueData(**v) for v in data]
        except (json.JSONDecodeError, Exception) as e:
            logger.error(f"Error loading venues: {e}")
            return []

    def get_venues_by_state(self, state: str) -> list[VenueData]:
        """Get venues for a specific state."""
        all_venues = self.load_all_venues()
        return [v for v in all_venues if v.state.lower() == state.lower()]

    def get_venues_by_category(self, category: DataCategory) -> list[VenueData]:
        """Get venues for a specific category."""
        all_venues = self.load_all_venues()
        return [v for v in all_venues if v.category == category]

    def get_stats(self) -> dict:
        """Get collection statistics."""
        venues = self.load_all_venues()

        by_category = {}
        by_country = {}
        by_state = {}

        for venue in venues:
            # By category
            cat = venue.category.value
            by_category[cat] = by_category.get(cat, 0) + 1

            # By country
            by_country[venue.country] = by_country.get(venue.country, 0) + 1

            # By state
            state_key = f"{venue.state}, {venue.country}"
            by_state[state_key] = by_state.get(state_key, 0) + 1

        return {
            "total_venues": len(venues),
            "by_category": by_category,
            "by_country": by_country,
            "by_state": by_state,
        }

    # Progress tracking
    def load_progress(self) -> CollectionProgress:
        """Load collection progress."""
        if not self._progress_file.exists():
            return CollectionProgress()

        try:
            with open(self._progress_file) as f:
                data = json.load(f)
                return CollectionProgress(**data)
        except (json.JSONDecodeError, Exception) as e:
            logger.error(f"Error loading progress: {e}")
            return CollectionProgress()

    def save_progress(self, progress: CollectionProgress) -> None:
        """Save collection progress."""
        with open(self._progress_file, "w") as f:
            json.dump(progress.model_dump(mode="json"), f, indent=2, default=str)

    def get_completed_states(self) -> set[str]:
        """Get set of completed state-country combinations."""
        progress_file = self.data_dir / "completed_states.json"
        if not progress_file.exists():
            return set()

        try:
            with open(progress_file) as f:
                return set(json.load(f))
        except Exception:
            return set()

    def mark_state_completed(self, state: str, country: str) -> None:
        """Mark a state as completed for current cycle."""
        completed = self.get_completed_states()
        completed.add(f"{state}|{country}")

        progress_file = self.data_dir / "completed_states.json"
        with open(progress_file, "w") as f:
            json.dump(list(completed), f)

    def reset_cycle(self) -> None:
        """Reset completed states for a new collection cycle."""
        progress_file = self.data_dir / "completed_states.json"
        if progress_file.exists():
            progress_file.unlink()
        logger.info("Collection cycle reset")


# Singleton instance
_storage: Optional[Storage] = None


def get_storage() -> Storage:
    """Get or create the storage instance."""
    global _storage
    if _storage is None:
        _storage = Storage()
    return _storage
