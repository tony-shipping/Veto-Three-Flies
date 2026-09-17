"""
Flies: Hunter Fly (Executioner).
Lands on verified targets strictly after Guard Fly grants PASS.
Rules:
- LANDED only if guard=PASS and mode=paper.
- Fixed sizing SIZE_ETH = 0.04.
- Does not average down. One landing per cycle.
"""

from typing import Any, Dict, Optional, Set

SIZE_ETH: float = 0.04


def evaluate(
    decision: Dict[str, Any],
    already_landed_ids: Optional[Set[str]] = None,
) -> Dict[str, Any]:
    """
    Evaluates execution decision for the candidate.
    Returns: {"action": "IDLE" | "LANDED", "size_eth": float | None}
    """
    guard_action = decision.get("guard")
    mode = decision.get("mode")
    launch_id = decision.get("launch_id")

    if already_landed_ids is None:
        already_landed_ids = set()

    # Must be approved by Guard Fly and operating under paper mode
    if guard_action == "PASS" and mode == "paper":
        if launch_id not in already_landed_ids:
            return {
                "action": "LANDED",
                "size_eth": SIZE_ETH,
            }

    return {
        "action": "IDLE",
        "size_eth": None,
    }
