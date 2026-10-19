import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / "backend" / ".env")

SUPABASE_URL = (os.getenv("SUPABASE_URL") or "").rstrip("/")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") or ""


def main() -> int:
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: SUPABASE_URL / SUPABASE_KEY not set (backend/.env missing?)")
        return 1

    url = f"{SUPABASE_URL}/rest/v1/community_post?select=id&limit=1"
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}

    try:
        res = requests.get(url, headers=headers, timeout=15)
    except requests.exceptions.RequestException as e:
        print(f"Keep-alive ping failed: {e}")
        return 1

    if res.status_code in (200, 204, 206):
        print(f"Keep-alive ping OK (HTTP {res.status_code})")
        return 0

    print(f"Keep-alive ping got HTTP {res.status_code}: {res.text[:200]}")
    print("If the project is paused, unpause it once in the Supabase Dashboard.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
