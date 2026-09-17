"""
Flies: Scout Fly (Drosophila Scouter).
Narrows the swarm's attention using early scent markers.
SKIP if required metrics are missing or scent < 0.35.
"""

from typing import Any, Dict
from senses.scent import scent as compute_scent

SCOUT_THRESHOLD = 0.35


def evaluate(launch: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates a candidate launch.
    Returns: {"action": "SNIFF" | "SKIP", "scent": float}
    """
    if not launch or not isinstance(launch, dict):
        return {"action": "SKIP", "scent": 0.0}

    # Check basic mandatory fields
    required_keys = ("ticker", "volume_eth", "unique_wallets")
    for k in required_keys:
        if k not in launch:
            return {"action": "SKIP", "scent": 0.0}

    s_val = compute_scent(launch)

    if s_val < SCOUT_THRESHOLD:
        return {"action": "SKIP", "scent": s_val}

    return {"action": "SNIFF", "scent": s_val}
