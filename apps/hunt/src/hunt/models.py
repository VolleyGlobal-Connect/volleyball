"""Pydantic models for Hunt application."""

from datetime import datetime
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field, HttpUrl


class DataCategory(str, Enum):
    """Categories of volleyball data to collect."""

    COURTS = "courts"
    ACADEMIES = "academies"
    EQUIPMENT = "equipment"
    TOURNAMENTS = "tournaments"
    CLUBS = "clubs"


class Region(str, Enum):
    """Regions for data collection."""

    USA = "USA"
    INDIA = "India"


# USA States
USA_STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California",
    "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
    "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
    "District of Columbia"
]

# India States
INDIA_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Chandigarh"
]


class VenueData(BaseModel):
    """Volleyball venue/court information."""

    name: str = Field(..., description="Name of the venue or court")
    category: DataCategory = Field(..., description="Category of the venue")
    state: str = Field(..., description="State where the venue is located")
    country: str = Field(..., description="Country")
    address: Optional[str] = Field(None, description="Physical address")
    website: Optional[str] = Field(None, description="Website URL")
    phone: Optional[str] = Field(None, description="Contact phone number")
    email: Optional[str] = Field(None, description="Contact email")
    description: Optional[str] = Field(None, description="Description of the venue")
    source_url: Optional[str] = Field(None, description="URL where this info was found")
    collected_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}


class SearchRequest(BaseModel):
    """Request model for manual search."""

    query: Optional[str] = Field(None, description="Custom search query")
    state: str = Field(..., description="State to search in")
    country: str = Field(default="USA", description="Country (USA or India)")
    category: DataCategory = Field(
        default=DataCategory.COURTS,
        description="Category of data to collect"
    )
    max_results: int = Field(default=10, ge=1, le=50, description="Maximum results")


class SearchResponse(BaseModel):
    """Response model for search results."""

    status: str = Field(default="success")
    query_used: str = Field(..., description="The search query that was used")
    results: list[VenueData] = Field(default_factory=list)
    executed_tools: list[str] = Field(default_factory=list)
    trace_url: Optional[str] = Field(None, description="LangSmith trace URL")
    collected_at: datetime = Field(default_factory=datetime.utcnow)


class JobStatus(str, Enum):
    """Status of a collection job."""

    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class CollectionJob(BaseModel):
    """A scheduled data collection job."""

    job_id: str = Field(..., description="Unique job identifier")
    state: str = Field(..., description="State being processed")
    country: str = Field(..., description="Country")
    category: DataCategory = Field(..., description="Data category")
    status: JobStatus = Field(default=JobStatus.PENDING)
    results_count: int = Field(default=0)
    error: Optional[str] = Field(None)
    started_at: Optional[datetime] = Field(None)
    completed_at: Optional[datetime] = Field(None)


class CollectionProgress(BaseModel):
    """Overall collection progress."""

    total_states: int = Field(default=0)
    completed_states: int = Field(default=0)
    current_state: Optional[str] = Field(None)
    current_country: Optional[str] = Field(None)
    total_results: int = Field(default=0)
    last_run_at: Optional[datetime] = Field(None)
    next_run_at: Optional[datetime] = Field(None)
    is_running: bool = Field(default=False)


class StatsResponse(BaseModel):
    """Statistics response."""

    total_venues: int = Field(default=0)
    by_category: dict[str, int] = Field(default_factory=dict)
    by_country: dict[str, int] = Field(default_factory=dict)
    by_state: dict[str, int] = Field(default_factory=dict)
    collection_progress: CollectionProgress
