"""
Flies: Guard Fly (Veto Mechanism).
Inspects incoming candidates and imposes strict vetoes in sequence:
1. in_snipe_window -> 'snipe window'
2. creator_pct > 0.15 -> 'creator'
3. mint_open -> 'mint'
4. ticker in {VETO, EL VETO, FLYVETO} -> 'own name'
5. scent < 0.60 -> 'flat scent'
Otherwise -> PASS
"""

from typing import Any, Dict, Optional, Tuple

FORBIDDEN_NAMES = {"VETO", "EL VETO", "FLYVETO"}
CREATOR_MAX_PCT = 0.15
GUARD_SCENT_MIN = 0.60


def normalize_ticker(ticker: str) -> str:
    if not ticker:
        return ""
    # Strip whitespace and common token prefixes like '$'
    cleaned = ticker.strip().upper()
    if cleaned.startswith("$"):
        cleaned = cleaned[1:].strip()
    return cleaned


def evaluate(launch: Dict[str, Any], scent_val: float) -> Dict[str, Optional[str]]:
    """
    Evaluates a candidate launch against defensive veto rules.
    Returns: {"action": "PASS" | "REFUSED", "why": str | None}
    """
    # 1. Anti-snipe active
    if launch.get("in_snipe_window", False):
        return {"action": "REFUSED", "why": "snipe window"}

    # 2. Creator retains too much supply (> 15%)
    creator_pct = float(launch.get("creator_pct", 0.0))
    if creator_pct > CREATOR_MAX_PCT:
        return {"action": "REFUSED", "why": "creator"}

    # 3. Mint still open (unlimited supply exploit risk)
    if launch.get("mint_open", False):
        return {"action": "REFUSED", "why": "mint"}

    # 4. Ticker spoofing project / own swarm name
    raw_ticker = str(launch.get("ticker", ""))
    norm_ticker = normalize_ticker(raw_ticker)
    if norm_ticker in FORBIDDEN_NAMES or raw_ticker.upper() in FORBIDDEN_NAMES:
        return {"action": "REFUSED", "why": "own name"}

    # 5. Scent too weak for defensive passage
    if scent_val < GUARD_SCENT_MIN:
        return {"action": "REFUSED", "why": "flat scent"}

    # All checks passed cleanly
    return {"action": "PASS", "why": None}
