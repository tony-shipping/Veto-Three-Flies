#!/usr/bin/env python3
"""
VETO: Three Fruit Flies Swarm for Pons Trading (Robinhood Chain).
Executor orchestrating Scout, Guard, and Hunter flies.

Usage:
    python executor.py --paper
    python executor.py --paper --fixtures custom_fixtures.json
"""

import argparse
import datetime
import json
import os
import sys
from typing import Any, Dict, List, Set

from flies import guard, hunter, scout
from senses.pons import load_launches


def append_ledger_line(ledger_path: str, decision: Dict[str, Any]) -> None:
    """Appends a single JSON decision line to ledger.jsonl."""
    with open(ledger_path, "a", encoding="utf-8") as f:
        f.write(json.dumps(decision, ensure_ascii=False) + "\n")


def load_previous_landed(ledger_path: str) -> Set[str]:
    """Loads launch_ids that have already received LANDED from the ledger."""
    landed_ids: Set[str] = set()
    if not os.path.exists(ledger_path):
        return landed_ids

    try:
        with open(ledger_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                entry = json.loads(line)
                if entry.get("hunter") == "LANDED" and entry.get("launch_id"):
                    landed_ids.add(entry["launch_id"])
    except Exception:
        pass
    return landed_ids


def run_cycle(fixtures_path: str = None, ledger_path: str = "ledger.jsonl", mode: str = "paper") -> List[Dict[str, Any]]:
    if mode != "paper":
        sys.stderr.write("CRITICAL: Live signing is strictly prohibited. Only --paper mode is permitted.\n")
        sys.exit(1)

    launches = load_launches(fixture_path=fixtures_path)
    already_landed = load_previous_landed(ledger_path)
    cycle_decisions = []

    for launch in launches:
        now_ts = datetime.datetime.now(datetime.timezone.utc).isoformat()
        launch_id = launch.get("id", "unknown")
        ticker = launch.get("ticker", "UNKNOWN")

        # 1. Scout Fly (Sniffs candidate)
        scout_eval = scout.evaluate(launch)
        scout_action = scout_eval["action"]
        scent_val = scout_eval["scent"]

        # 2. Guard Fly (Imposes veto or grants pass)
        if scout_action == "SKIP":
            guard_action = "REFUSED"
            why = "low scent"
        else:
            guard_eval = guard.evaluate(launch, scent_val)
            guard_action = guard_eval["action"]
            why = guard_eval["why"]

        # Form initial decision struct
        decision: Dict[str, Any] = {
            "ts": now_ts,
            "launch_id": launch_id,
            "ticker": ticker,
            "scent": scent_val,
            "scout": scout_action,
            "guard": guard_action,
            "why": why,
            "hunter": "IDLE",
            "size_eth": None,
            "mode": mode,
        }

        # 3. Hunter Fly (Lands on targets only if PASS and mode=paper)
        hunter_eval = hunter.evaluate(decision, already_landed_ids=already_landed)
        decision["hunter"] = hunter_eval["action"]
        decision["size_eth"] = hunter_eval["size_eth"]

        if decision["hunter"] == "LANDED":
            already_landed.add(launch_id)

        # 4. Append to ledger.jsonl
        append_ledger_line(ledger_path, decision)
        cycle_decisions.append(decision)

        # 5. Output one clean human-readable and grep-friendly line to stdout
        why_str = f" ({decision['why']})" if decision["why"] else ""
        size_str = f" [{decision['size_eth']} ETH]" if decision["size_eth"] else ""
        print(
            f"[{decision['ts']}] ID={launch_id:<12} TICKER={ticker:<10} SCENT={decision['scent']:<4.2f} "
            f"SCOUT={decision['scout']:<5} GUARD={decision['guard']:<7}{why_str:<16} "
            f"HUNTER={decision['hunter']}{size_str}"
        )

    return cycle_decisions


def main():
    parser = argparse.ArgumentParser(
        description="VETO: Three Fruit Flies Trading Swarm on Pons (Robinhood Chain)",
        epilog="Live signing is strictly prohibited by architectural mandate.",
    )
    parser.add_argument(
        "--paper",
        action="store_true",
        default=True,
        help="Execute in simulated paper-trading mode (default: True)",
    )
    parser.add_argument(
        "--live",
        action="store_true",
        default=False,
        help="Live trading mode (FORBIDDEN / NOT IMPLEMENTED)",
    )
    parser.add_argument(
        "--fixtures",
        type=str,
        default=None,
        help="Custom path to launches fixtures JSON file",
    )
    parser.add_argument(
        "--ledger",
        type=str,
        default="ledger.jsonl",
        help="Output JSONL ledger path (default: ledger.jsonl)",
    )

    args = parser.parse_args()

    if args.live:
        sys.stderr.write("FATAL ERROR: --live is explicitly forbidden. Live signing keys do not exist.\n")
        sys.exit(1)

    run_cycle(fixtures_path=args.fixtures, ledger_path=args.ledger, mode="paper")


if __name__ == "__main__":
    main()
