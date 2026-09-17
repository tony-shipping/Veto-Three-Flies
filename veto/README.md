# VETO

> **Three Fruit Flies Swarm for Pons Trading (Robinhood Chain)**

VETO is a deterministic trading swarm inspired by *Drosophila melanogaster* (fruit fly) sensory neurobiology, operating on the Pons token launchpad. Three specialized fruit flies collaborate in a unidirectional execution pipeline:

```
                  ┌──────────────────────┐
                  │ Candidate Token (LP) │
                  └──────────┬───────────┘
                             │
                             ▼
                    [ 1. SCOUT FLY ]
                (Sniffs scent formula 0..1)
                             │  scent >= 0.35
                             ▼
                    [ 2. GUARD FLY ]
              (Strict 5-rule veto evaluation)
                             │  PASS
                             ▼
                   [ 3. HUNTER FLY ]
             (Fixed 0.04 ETH paper landing)
                             │
                             ▼
                      [ LEDGER.JSONL ]
```

---

## The Three Fruit Flies

1. **Scout Fly (`flies/scout.py`)**  
   Evaluates early scent markers. Emits `SNIFF` if data is valid and `scent >= 0.35`, else `SKIP`.

2. **Guard Fly (`flies/guard.py`)**  
   Imposes defensive vetoes in strict sequence. First trigger halts the pipeline:
   - `in_snipe_window` → `REFUSED (snipe window)`
   - `creator_pct > 0.15` → `REFUSED (creator)`
   - `mint_open` → `REFUSED (mint)`
   - `ticker ∈ {VETO, EL VETO, FLYVETO}` → `REFUSED (own name)`
   - `scent < 0.60` → `REFUSED (flat scent)`
   - Otherwise → `PASS`

3. **Hunter Fly (`flies/hunter.py`)**  
   Acquires targets only after Guard grants `PASS` and `mode == "paper"`.
   - Fixed position sizing: `SIZE_ETH = 0.04`.
   - Never averages down. Single landing per cycle.

---

## Scent Formula (`senses/scent.py`)

$$\text{Scent} = 0.25 \cdot \text{age} + 0.25 \cdot \text{unique} + 0.25 \cdot \text{vol} + 0.25 \cdot (1 - \text{concentration})$$

- **$\text{age}$**: 0 within anti-snipe window ($< 60s$), scaled smoothly up to 1.0 at $600s$.
- **$\text{unique}$**: Clamped $\text{unique\_wallets} / 40$.
- **$\text{vol}$**: Clamped $\text{volume\_eth} / 5.0$.
- **$\text{concentration}$**: Clamped $\text{top\_holder\_pct} / 0.20$ (excluding LP pool).

All values are clamped $[0.0, 1.0]$, rounded to two decimal places, and 100% deterministic (no random, no external LLM in the hot path).

---

## Safety Guarantees

- **No live signing keys:** No private keys in `os.environ`, no transaction signing modules.
- **`--paper` mode only:** `--live` is permanently prohibited by architecture.
- **Append-only ledger:** Every evaluation cycle appends one deterministic JSON line to `ledger.jsonl`.

---

## Quick Start

### 1. Run Tests
```bash
python -m unittest discover tests
```

### 2. Run Paper Swarm
```bash
python executor.py --paper
```

### 3. Custom Fixtures
```bash
python executor.py --paper --fixtures fixtures/launches.json --ledger ledger.jsonl
```

---

## Drosophila Command Center UI

The visual dashboard (`hive.html` / GitHub Pages) provides an interactive neural map matching the *Drosophila Command Center* telemetry:
- Live 3D neural map & axon connections
- Odor plume & environmental radar
- Scent spectrogram
- Real-time ledger stream viewer

* **GitHub Pages:** [https://armengorax.github.io/veto](https://armengorax.github.io/veto) *(configured via CNAME)*
* **Article & Research Notes:** Coming soon.

---

## License

MIT © 2026 VETO Contributors
