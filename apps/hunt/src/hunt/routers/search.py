"""Search API endpoints."""

from fastapi import APIRouter, HTTPException

from ..agent import get_agent
from ..models import DataCategory, SearchRequest, SearchResponse
from ..storage import get_storage

router = APIRouter(prefix="/api", tags=["search"])


@router.post("/search", response_model=SearchResponse)
async def search_venues(request: SearchRequest) -> SearchResponse:
    """
    Search for volleyball venues in a specific state.

    This endpoint uses Groq Compound agent with built-in web search
    to find volleyball-related venues.
    """
    agent = get_agent()

    try:
        venues, executed_tools, query_used = await agent.search(
            state=request.state,
            country=request.country,
            category=request.category,
            max_results=request.max_results,
            custom_query=request.query,
        )

        # Optionally save results
        storage = get_storage()
        storage.save_venues(venues)

        return SearchResponse(
            status="success",
            query_used=query_used,
            results=venues,
            executed_tools=executed_tools,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/results/{state}")
async def get_results_by_state(state: str, country: str = "USA") -> dict:
    """Get collected venues for a specific state."""
    storage = get_storage()
    venues = storage.get_venues_by_state(state)

    # Filter by country if specified
    if country:
        venues = [v for v in venues if v.country.lower() == country.lower()]

    return {
        "state": state,
        "country": country,
        "count": len(venues),
        "venues": [v.model_dump(mode="json") for v in venues],
    }


@router.get("/results/category/{category}")
async def get_results_by_category(category: DataCategory) -> dict:
    """Get collected venues for a specific category."""
    storage = get_storage()
    venues = storage.get_venues_by_category(category)

    return {
        "category": category.value,
        "count": len(venues),
        "venues": [v.model_dump(mode="json") for v in venues],
    }


@router.get("/stats")
async def get_stats() -> dict:
    """Get collection statistics."""
    storage = get_storage()
    stats = storage.get_stats()
    progress = storage.load_progress()

    return {
        **stats,
        "collection_progress": progress.model_dump(mode="json"),
    }
