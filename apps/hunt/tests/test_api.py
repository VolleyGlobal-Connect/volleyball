"""Tests for Hunt API."""

import pytest
from fastapi.testclient import TestClient

from src.hunt.main import app


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


def test_health_check(client):
    """Test health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "hunt"


def test_root_endpoint(client):
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Hunt" in data["name"]
    assert "endpoints" in data


def test_stats_endpoint(client):
    """Test stats endpoint."""
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_venues" in data
    assert "by_category" in data


def test_jobs_endpoint(client):
    """Test jobs listing endpoint."""
    response = client.get("/api/jobs")
    assert response.status_code == 200
    data = response.json()
    assert "jobs" in data
    assert "scheduler_running" in data
