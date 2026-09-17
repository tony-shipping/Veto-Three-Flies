"""
Senses: Scent evaluation for token launches.
0.25*age + 0.25*unique + 0.25*vol + 0.25*(1-concentration)
Deterministic, clamped 0..1, no randomness.
"""

from typing import Any, Dict

# Constants for scent evaluation
SNIPE_WINDOW_S: float = 60.0
AGE_MATURE_S: float = 600.0
UNIQUE_WALLETS_TARGET: float = 40.0
VOLUME_ETH_TARGET: float = 5.0
CONCENTRATION_MAX: float = 0.20


def clamp(val: float, min_val: float = 0.0, max_val: float = 1.0) -> float:
    return max(min_val, min(max_val, val))


def calculate_age_factor(launch: Dict[str, Any]) -> float:
    if launch.get("in_snipe_window", False):
        return 0.0
    age_s = float(launch.get("age_s", 0.0))
    if age_s < SNIPE_WINDOW_S:
        return 0.0
    if age_s >= AGE_MATURE_S:
        return 1.0
    return clamp((age_s - SNIPE_WINDOW_S) / (AGE_MATURE_S - SNIPE_WINDOW_S))


def calculate_unique_factor(launch: Dict[str, Any]) -> float:
    unique = float(launch.get("unique_wallets", 0))
    return clamp(unique / UNIQUE_WALLETS_TARGET)


def calculate_volume_factor(launch: Dict[str, Any]) -> float:
    vol = float(launch.get("volume_eth", 0.0))
    return clamp(vol / VOLUME_ETH_TARGET)


def calculate_concentration_factor(launch: Dict[str, Any]) -> float:
    top_holder_pct = float(launch.get("top_holder_pct", 0.0))
    return clamp(top_holder_pct / CONCENTRATION_MAX)


def scent(launch: Dict[str, Any]) -> float:
    """
    Computes scent index in range [0.0, 1.0], rounded to 2 decimal places.
    Formula: 0.25*age + 0.25*unique + 0.25*vol + 0.25*(1 - concentration)
    """
    f_age = calculate_age_factor(launch)
    f_unique = calculate_unique_factor(launch)
    f_vol = calculate_volume_factor(launch)
    f_conc = calculate_concentration_factor(launch)
    f_distributed = clamp(1.0 - f_conc)

    raw_scent = (0.25 * f_age) + (0.25 * f_unique) + (0.25 * f_vol) + (0.25 * f_distributed)
    return round(clamp(raw_scent, 0.0, 1.0), 2)
