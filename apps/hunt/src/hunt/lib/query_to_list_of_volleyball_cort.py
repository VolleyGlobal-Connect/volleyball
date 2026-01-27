

import os
from groq import Groq
from dotenv import find_dotenv, load_dotenv
from OSMPythonTools.api import Api, ApiResult

find_dotenv()

groq_api_key:str = os.getenv("GROQ_API_KEY", "")
model:str = "groq/compound"





system_prompt:str = """
# Role and Goal: Geospatial Data Analyst

**Role:** You are a highly precise Geospatial Data Analyst specializing in querying and extracting relevant feature data from OpenStreetMap (OSM).

**Tool Use:** You are instructed to use the available `openstreetmap` tool (or equivalent search function) to perform a targeted geospatial query.

**Core Objective:** Find all points of interest (POIs) and features explicitly tagged as volleyball facilities within a user-defined geographical area.

---

## 1. User Input Variables (MANDATORY)

The user will provide the following information:

| Variable              | Description                                       | Example                       |
| :-------------------- | :------------------------------------------------ | :---------------------------- |
| **[TARGET_LOCATION]** | The central location for the search.              | "Central Park, New York City" |
| **[Type]**            | The type we are looking form volleball releation. | court, # Academy              |

---

## 2. Search Protocol

1.  **Search Tags:** The query must specifically look for OSM objects using the key-value pair `leisure=pitch` AND `sport=volleyball`.
2.  **Tool Execution:** Execute the search using the provided `[TARGET_LOCATION]` and `[Type]`.

## 3. Output Format (MANDATORY)

Present the findings in a clear, single Markdown table titled **"Volleyball Facility Search Results"**.

The table must include the following columns in order:

1.  **Name:** The name of the facility/location (if available). If no name is available, state "Unnamed Facility".
2.  **Feature Type:** The specific OSM tags found (e.g., `leisure=pitch / sport=volleyball`).
3.  **Description:** A brief note about the feature (e.g., part of a school, public park).
4.  **Coordinates (Lat, Lon):** The precise latitude and longitude of the feature.

"""
if (groq_api_key == ""):
    exit(-1)

client = Groq(api_key=groq_api_key)

# TODO: query: pydantic model
def random_function(query: list[str]):
    """
    Docstring for random_function
    
    :param query: Description
    :type query: list[str]
    """
    

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"location: {query[0], query[1], query[2]}\n\n{query[3]}"}
        ],
        temperature=0.1,
        max_tokens=4096,
    )

    return response.choices[0].message

def search_function(query:str):
    pass 



if __name__ == "__main__":
    api = Api()
    way:ApiResult = api.query('way/5887599')

    print(way.apiVersion)
    print(way.id)
    print(way.members)
    print(way.attribution)
    print(way.tags)