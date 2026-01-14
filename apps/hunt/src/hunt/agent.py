"""Groq Compound agent for volleyball data collection."""

import json
import logging
from typing import Any, Optional

from groq import Groq

from .config import get_settings
from .models import DataCategory, VenueData

logger = logging.getLogger(__name__)


class VolleyballAgent:
    """Agent using Groq Compound for volleyball venue data collection."""

    def __init__(self):
        """Initialize the Groq Compound agent."""
        settings = get_settings()
        self.client = Groq(api_key=settings.groq_api_key)
        self.model = "groq/compound"  # Pre-made agent with web search

    def _build_system_prompt(self, category: DataCategory) -> str:
        """Build system prompt based on data category."""
        category_prompts = {
            DataCategory.COURTS: """You are an expert volleyball venue researcher.
Your task is to find volleyball courts and playing venues.
Look for:
- Indoor volleyball courts
- Beach volleyball courts
- Recreation centers with volleyball
- Sports complexes
- Community centers with volleyball facilities""",

            DataCategory.ACADEMIES: """You are an expert volleyball training researcher.
Your task is to find volleyball academies and training centers.
Look for:
- Volleyball coaching academies
- Youth volleyball programs
- Professional training centers
- Summer volleyball camps
- Club volleyball training""",

            DataCategory.EQUIPMENT: """You are an expert volleyball equipment researcher.
Your task is to find volleyball equipment stores and suppliers.
Look for:
- Sporting goods stores with volleyball equipment
- Online volleyball equipment retailers
- Volleyball specialty shops
- Wholesale volleyball suppliers""",

            DataCategory.TOURNAMENTS: """You are an expert volleyball event researcher.
Your task is to find volleyball tournaments and events.
Look for:
- Local volleyball tournaments
- Beach volleyball competitions
- Youth volleyball leagues
- Professional volleyball events
- Recreational volleyball leagues""",

            DataCategory.CLUBS: """You are an expert volleyball club researcher.
Your task is to find volleyball clubs and teams.
Look for:
- Club volleyball teams
- Adult volleyball leagues
- Youth volleyball clubs
- Recreational volleyball groups
- Competitive volleyball organizations""",
        }
        return category_prompts.get(category, category_prompts[DataCategory.COURTS])

    def _build_extraction_prompt(self) -> str:
        """Build prompt for extracting structured data."""
        return """
For each venue found, extract and return as JSON array:
{
  "name": "venue name",
  "address": "full address if available",
  "website": "website URL if available",
  "phone": "phone number if available",
  "email": "email if available",
  "description": "brief description of the venue",
  "source_url": "URL where you found this information"
}

Return ONLY a valid JSON array of venues. Do not include any other text.
If no venues found, return an empty array: []
"""

    async def search(
        self,
        state: str,
        country: str,
        category: DataCategory,
        max_results: int = 10,
        custom_query: Optional[str] = None,
    ) -> tuple[list[VenueData], list[str], str]:
        """
        Search for volleyball venues using Groq Compound agent.

        Args:
            state: State to search in
            country: Country (USA or India)
            category: Category of venue to search for
            max_results: Maximum number of results
            custom_query: Optional custom search query

        Returns:
            Tuple of (venues list, executed tools, query used)
        """
        system_prompt = self._build_system_prompt(category)
        extraction_prompt = self._build_extraction_prompt()

        if custom_query:
            query = custom_query
        else:
            query = f"Find {max_results} {category.value} in {state}, {country}"

        full_prompt = f"""{system_prompt}

SEARCH TASK: {query}

{extraction_prompt}"""

        try:
            logger.info(f"Searching: {query}")

            # Use Groq Compound - it has built-in web search
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"{query}\n\n{extraction_prompt}"}
                ],
                temperature=0.1,
                max_tokens=4096,
            )

            content = response.choices[0].message.content or "[]"

            # Extract executed tools from response
            executed_tools = []
            if hasattr(response.choices[0].message, 'executed_tools'):
                executed_tools = [
                    tool.get('type', 'unknown')
                    for tool in (response.choices[0].message.executed_tools or [])
                ]

            # Parse the JSON response
            venues = self._parse_venues(content, state, country, category)

            logger.info(f"Found {len(venues)} venues for {state}, {country}")
            return venues[:max_results], executed_tools, query

        except Exception as e:
            logger.error(f"Error searching for venues: {e}")
            raise

    def _parse_venues(
        self,
        content: str,
        state: str,
        country: str,
        category: DataCategory
    ) -> list[VenueData]:
        """Parse JSON response into VenueData objects."""
        venues = []

        try:
            # Try to extract JSON from the response
            # Sometimes the model includes extra text
            start_idx = content.find('[')
            end_idx = content.rfind(']') + 1

            if start_idx != -1 and end_idx > start_idx:
                json_str = content[start_idx:end_idx]
                data = json.loads(json_str)

                for item in data:
                    if isinstance(item, dict) and item.get('name'):
                        venue = VenueData(
                            name=item.get('name', 'Unknown'),
                            category=category,
                            state=state,
                            country=country,
                            address=item.get('address'),
                            website=item.get('website'),
                            phone=item.get('phone'),
                            email=item.get('email'),
                            description=item.get('description'),
                            source_url=item.get('source_url'),
                        )
                        venues.append(venue)

        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse JSON response: {e}")
            # Return empty list if parsing fails

        return venues


# Singleton instance
_agent: Optional[VolleyballAgent] = None


def get_agent() -> VolleyballAgent:
    """Get or create the volleyball agent instance."""
    global _agent
    if _agent is None:
        _agent = VolleyballAgent()
    return _agent
