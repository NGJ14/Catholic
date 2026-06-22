"""
NRSV Import Script Template

Because the NRSV Catholic Edition is copyrighted, we cannot bundle it directly.
If you have legally obtained the NRSV-CE text in a digital format (or have an API key for API.Bible),
you can use this script to format it into the JSON structure required by the app.

Required JSON Structure for the app (bible-data.json):
{
  "gen": {
    "1": [
      { "chapter": 1, "verse": 1, "text": "In the beginning..." },
      ...
    ]
  },
  "jhn": { ... }
}

If you have an API.Bible key, you can fetch it like this:

import requests
import json

API_KEY = "YOUR_API_BIBLE_KEY"
NRSV_CE_BIBLE_ID = "YOUR_NRSV_CE_ID" # e.g. from scripture.api.bible

headers = {"api-key": API_KEY}

def fetch_chapter(bible_id, chapter_id):
    url = f"https://api.scripture.api.bible/v1/bibles/{bible_id}/chapters/{chapter_id}?content-type=json"
    response = requests.get(url, headers=headers)
    return response.json()

# Loop through books and chapters, format them, and save to bible-data.json
# Then, replace the getChapterText function in src/data/bibleData.ts to read from this JSON.
"""

print("Please read the instructions inside this script for integrating NRSV text.")
