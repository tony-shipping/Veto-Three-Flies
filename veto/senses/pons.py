"""
Senses: Pons Launchpad adapter (Robinhood Chain).
v0: load_launches() -> list[Launch] from fixtures/launches.json.
Interface compatible with future RPC provider. No network access unless --live-scan is explicit.
"""

import json
import os
from typing import Any, Dict, List

DEFAULT_FIXTURE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "fixtures",
    "launches.json",
)


def load_launches(fixture_path: str = None, live_scan: bool = False) -> List[Dict[str, Any]]:
    """
    Loads candidate token launches.
    In v0 / offline mode (live_scan=False), loads directly from fixture file.
    """
    if live_scan:
        raise NotImplementedError("Live RPC scan requires verified Pons contract deployment. Use fixtures.")

    path = fixture_path or DEFAULT_FIXTURE_PATH
    if not os.path.exists(path):
        raise FileNotFoundError(f"Fixture file not found: {path}")

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise ValueError("Fixture data must be a list of Launch dictionaries.")

    return data
