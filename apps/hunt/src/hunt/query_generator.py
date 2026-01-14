"""LLM-based query generator for volleyball data collection."""

import logging
import random
from typing import Optional

from groq import Groq

from .config import get_settings
from .models import DataCategory

logger = logging.getLogger(__name__)


class QueryGenerator:
    """Generate optimized search queries using LLM."""

    def __init__(self):
        """Initialize query generator."""
        settings = get_settings()
        self.client = Groq(api_key=settings.groq_api_key)
        # Use a fast model for query generation
        self.model = "llama-3.3-70b-versatile"

    def generate_query(
        self,
        state: str,
        country: str,
        category: DataCategory,
        previous_queries: Optional[list[str]] = None,
    ) -> str:
        """
        Generate an optimized search query for volleyball data collection.

        Args:
            state: State to search in
            country: Country (USA or India)
            category: Category of data to collect
            previous_queries: List of previously used queries to avoid duplicates

        Returns:
            Generated search query string
        """
        previous = previous_queries or []
        previous_str = "\n".join(f"- {q}" for q in previous[-5:]) if previous else "None"

        prompt = f"""Generate a specific search query to find volleyball {category.value} in {state}, {country}.

The query should:
1. Be specific to find real businesses/venues
2. Include location context
3. Be unique from previous queries
4. Target actual contact information or website

Previous queries used (avoid similar):
{previous_str}

Examples of good queries:
- "volleyball courts near me {state} with phone number"
- "beach volleyball clubs {state} {country} contact"
- "youth volleyball training academy {state} registration"

Return ONLY the search query, nothing else."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.8,  # Higher temperature for variety
                max_tokens=100,
            )

            query = response.choices[0].message.content.strip()
            # Remove quotes if present
            query = query.strip('"\'')
            
            logger.info(f"Generated query: {query}")
            return query

        except Exception as e:
            logger.error(f"Error generating query: {e}")
            # Fallback to a simple query
            return self._fallback_query(state, country, category)

    def _fallback_query(
        self,
        state: str,
        country: str,
        category: DataCategory
    ) -> str:
        """Generate a simple fallback query if LLM fails."""
        templates = {
            DataCategory.COURTS: [
                f"volleyball courts in {state} {country}",
                f"indoor volleyball near {state}",
                f"beach volleyball courts {state}",
            ],
            DataCategory.ACADEMIES: [
                f"volleyball academy {state} {country}",
                f"volleyball training center {state}",
                f"youth volleyball program {state}",
            ],
            DataCategory.EQUIPMENT: [
                f"volleyball equipment store {state}",
                f"volleyball gear shop {state} {country}",
                f"sporting goods volleyball {state}",
            ],
            DataCategory.TOURNAMENTS: [
                f"volleyball tournament {state} {country}",
                f"volleyball league {state}",
                f"volleyball competition {state}",
            ],
            DataCategory.CLUBS: [
                f"volleyball club {state} {country}",
                f"volleyball team {state}",
                f"adult volleyball league {state}",
            ],
        }

        options = templates.get(category, templates[DataCategory.COURTS])
        return random.choice(options)


# Singleton instance
_generator: Optional[QueryGenerator] = None


def get_query_generator() -> QueryGenerator:
    """Get or create the query generator instance."""
    global _generator
    if _generator is None:
        _generator = QueryGenerator()
    return _generator
