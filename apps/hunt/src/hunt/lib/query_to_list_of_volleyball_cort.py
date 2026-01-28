

import os
from groq import Groq
from dotenv import find_dotenv, load_dotenv
from OSMPythonTools.overpass import Overpass, overpassQueryBuilder
from OSMPythonTools.nominatim import Nominatim

overpass = Overpass()
nominatim = Nominatim()

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
    
    osm_results = search_function(query[0])
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": f"""
                TARGET_LOCATION: {query[0]}
                TYPE: {query[3]}

            RAW OSM DATA:
            {osm_results}
            """
            }
        ],
        temperature=0.1,
        max_tokens=4096,
    )
    return response.choices[0].message



def search_function(query: str):
    # 1️⃣ Geocode location
    place_results = nominatim.query(query)
    places = list(place_results)

    if not places:
        raise ValueError(f"Location '{query}' not found in Nominatim")

    first_place = places[0]
    json_data = first_place.toJSON()
    lat = float(json_data['lat'])
    lon = float(json_data['lon'])

    # 2️⃣ Build raw Overpass QL query
    delta = 0.05  # ~5km radius
    south = lat - delta
    north = lat + delta
    west = lon - delta
    east = lon + delta

    overpass_query = f"""
    (
      node["leisure"="pitch"]["sport"="volleyball"]({south},{west},{north},{east});
      way["leisure"="pitch"]["sport"="volleyball"]({south},{west},{north},{east});
      relation["leisure"="pitch"]["sport"="volleyball"]({south},{west},{north},{east});
    );
    out center;
    """

    # 3️⃣ Execute query
    result = overpass.query(overpass_query)

    # 4️⃣ Normalize results
    facilities = []

    for el in result.elements():
        tags = el.tags() or {}

        facilities.append({
            "name": tags.get("name", "Unnamed Facility"),
            "feature_type": "leisure=pitch / sport=volleyball",
            "description": tags.get("description", "No description"),
            "lat": el.centerLat() if el.centerLat() else el.lat(),
            "lon": el.centerLon() if el.centerLon() else el.lon(),
        })

    return facilities




# if __name__ == "__main__":
#     api = Api()
#     way:ApiResult = api.query('way/5887599')

#     print(way.apiVersion)
#     print(way.id)
#     print(way.members)
#     print(way.attribution)
#     print(way.tags)

if __name__ == "__main__":
    # 1️⃣ Define your search location and type
    TARGET_LOCATION = "Dehradun, India"
    TYPE = "court"  # can be "academy", etc.

    # 2️⃣ Search OSM for volleyball facilities
    facilities = search_function(TARGET_LOCATION)

    # 3️⃣ Check if we found anything
    if not facilities:
        print("No volleyball facilities found.")
    else:
        print("Raw OSM results:")
        for f in facilities:
            print(f)  # prints each facility as a dict

    # 4️⃣ Optional: pass to Groq for Markdown formatting
    formatted_table = random_function([TARGET_LOCATION, "", "", TYPE])
    print("\nFormatted Markdown Table:")
    print(formatted_table.content)
