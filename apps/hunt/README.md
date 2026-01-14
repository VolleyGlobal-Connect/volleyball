# Hunt - Volleyball Data Collector 🏐

An AI-powered data collection system that automatically gathers volleyball-related business information across USA and India states using Groq Compound agent.

## Features

- **Groq Compound Agent**: Pre-made AI agent with built-in web search
- **Automated Queue**: Collects data every 30 minutes
- **State Rotation**: Systematically covers USA (50 states) and India (28 states)
- **LangSmith Tracing**: Full observability of all agent calls
- **FastAPI**: RESTful API for manual searches and job management

## Data Categories

- Volleyball courts (indoor/beach)
- Training academies
- Equipment stores
- Tournaments/events
- Clubs & teams

## Quick Start

### 1. Install Dependencies

```bash
cd apps/hunt
uv sync
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Run Development Server

```bash
uv run uvicorn src.hunt.main:app --reload
```

### 4. Access API

- Health: http://localhost:8000/health
- Docs: http://localhost:8000/docs
- Trigger job: `POST /api/jobs/trigger`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/search` | Manual search |
| GET | `/api/results/{state}` | Get results by state |
| GET | `/api/jobs` | List scheduled jobs |
| POST | `/api/jobs/trigger` | Trigger immediate collection |
| GET | `/api/stats` | Collection statistics |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | Groq API key |
| `LANGCHAIN_API_KEY` | No | LangSmith API key |
| `SCHEDULE_INTERVAL_MINUTES` | No | Interval between runs (default: 30) |
| `RESULTS_PER_RUN` | No | Results per collection run (default: 30) |

## License

MIT
