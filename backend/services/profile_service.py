# backend/services/profile_service.py
import os
import json
import logging
from typing import Dict, Any, List
from dotenv import load_dotenv
import openai
from pathlib import Path
import re
import uuid

load_dotenv()
logging.basicConfig(level=logging.INFO)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY_GPT4O") or os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY_EMBED")
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

HERE = Path(__file__).resolve()
DATA_DIR = HERE.parents[2] / "shared" / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
PROFILE_PATH = DATA_DIR / "Profile.json"

def _call_openai_normalize(text: str) -> Dict[str, Any]:
    prompt = f"""
You are a helpful assistant. Convert the following user profile text into a JSON object with these fields:
ProfileId, Name, ExperienceYears, ExperienceSummary, Education, Skills, CareerGoal, Interests.

- Provide values in English.
- If a field is missing, use an empty string or empty list for Skills.
- Return ONLY valid JSON (no extra commentary).

Profile text:
\"\"\"{text} \"\"\"
"""
    try:
        resp = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role":"system","content":"You are a JSON extraction assistant."},
                      {"role":"user","content": prompt}],
            temperature=0.0,
            max_tokens=500,
        )
        content = resp.choices[0].message["content"]
        m = re.search(r"(\{.*\})", content, re.S)
        json_text = m.group(1) if m else content
        parsed = json.loads(json_text)
        return parsed
    except Exception as e:
        logging.exception("OpenAI normalization failed")
        raise RuntimeError(f"OpenAI normalization failed: {e}")

# --------- NEW: chỉ chuẩn hoá, KHÔNG lưu ---------
def normalize_profile(raw_text: str) -> Dict[str, Any]:
    """
    Return normalized dict (does not save to disk).
    """
    normalized = _call_openai_normalize(raw_text)
    # ensure Skills is list
    if "Skills" in normalized and isinstance(normalized["Skills"], str):
        normalized["Skills"] = [s.strip() for s in normalized["Skills"].split(",") if s.strip()]
    return normalized

# --------- NEW: lưu profile (append vào list trong Profile.json) ---------
def save_normalized_profile(normalized: Dict[str, Any]) -> Dict[str, Any]:
    """
    Save the normalized profile into Profile.json as part of a list.
    If ProfileId missing or empty, generate uuid4 hex.
    Returns the saved profile (with ProfileId).
    """
    try:
        if "ProfileId" not in normalized or not normalized.get("ProfileId"):
            normalized["ProfileId"] = uuid.uuid4().hex

        # ensure Skills is list
        if "Skills" in normalized and isinstance(normalized["Skills"], str):
            normalized["Skills"] = [s.strip() for s in normalized["Skills"].split(",") if s.strip()]

        # read existing file (if exists) as list
        profiles: List[Dict[str, Any]] = []
        if PROFILE_PATH.exists():
            try:
                with open(PROFILE_PATH, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    # support either list or dict storage; normalize to list
                    if isinstance(data, list):
                        profiles = data
                    elif isinstance(data, dict):
                        # if previously single object, convert to list
                        profiles = [data]
            except Exception:
                # if file malformed, overwrite with new list
                profiles = []

        # check if profile with same ProfileId exists -> replace, else append
        found = False
        for i, p in enumerate(profiles):
            if p.get("ProfileId") == normalized["ProfileId"]:
                profiles[i] = normalized
                found = True
                break
        if not found:
            profiles.append(normalized)

        # write back full list
        with open(PROFILE_PATH, "w", encoding="utf-8") as f:
            json.dump(profiles, f, ensure_ascii=False, indent=2)

        logging.info(f"Saved profile {normalized['ProfileId']} to {PROFILE_PATH}")
        return normalized
    except Exception as e:
        logging.exception("Failed to save normalized profile")
        raise RuntimeError(f"Failed to save normalized profile: {e}")
