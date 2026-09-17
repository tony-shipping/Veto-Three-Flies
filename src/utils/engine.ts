import { Launch, Decision, ScentBreakdown } from '../types';

export const SNIPE_WINDOW_S = 60.0;
export const AGE_MATURE_S = 600.0;
export const UNIQUE_WALLETS_TARGET = 40.0;
export const VOLUME_ETH_TARGET = 5.0;
export const CONCENTRATION_MAX = 0.20;
export const SCOUT_THRESHOLD = 0.35;
export const GUARD_SCENT_MIN = 0.60;
export const CREATOR_MAX_PCT = 0.15;
export const SIZE_ETH = 0.04;
export const FORBIDDEN_NAMES = new Set(['VETO', 'EL VETO', 'FLYVETO']);

export function clamp(val: number, min = 0.0, max = 1.0): number {
  return Math.max(min, Math.min(max, val));
}

export function computeScentBreakdown(launch: Launch): ScentBreakdown {
  // Age factor
  let age_factor = 0.0;
  if (!launch.in_snipe_window) {
    if (launch.age_s < SNIPE_WINDOW_S) {
      age_factor = 0.0;
    } else if (launch.age_s >= AGE_MATURE_S) {
      age_factor = 1.0;
    } else {
      age_factor = clamp((launch.age_s - SNIPE_WINDOW_S) / (AGE_MATURE_S - SNIPE_WINDOW_S));
    }
  }

  // Unique wallets factor
  const unique_factor = clamp(launch.unique_wallets / UNIQUE_WALLETS_TARGET);

  // Volume factor
  const volume_factor = clamp(launch.volume_eth / VOLUME_ETH_TARGET);

  // Concentration factor
  const concentration_factor = clamp(launch.top_holder_pct / CONCENTRATION_MAX);
  const distributed_factor = clamp(1.0 - concentration_factor);

  const raw = (0.25 * age_factor) + (0.25 * unique_factor) + (0.25 * volume_factor) + (0.25 * distributed_factor);
  const total_scent = Math.round(clamp(raw, 0.0, 1.0) * 100) / 100;

  return {
    age_factor,
    unique_factor,
    volume_factor,
    concentration_factor,
    distributed_factor,
    total_scent,
  };
}

export function normalizeTicker(ticker: string): string {
  if (!ticker) return '';
  let cleaned = ticker.trim().toUpperCase();
  if (cleaned.startsWith('$')) {
    cleaned = cleaned.slice(1).trim();
  }
  return cleaned;
}

export function evaluateScout(launch: Launch, scentVal: number) {
  if (scentVal < SCOUT_THRESHOLD) {
    return { action: 'SKIP' as const, scent: scentVal };
  }
  return { action: 'SNIFF' as const, scent: scentVal };
}

export function evaluateGuard(launch: Launch, scentVal: number) {
  if (launch.in_snipe_window) {
    return { action: 'REFUSED' as const, why: 'snipe window' as const };
  }
  if (launch.creator_pct > CREATOR_MAX_PCT) {
    return { action: 'REFUSED' as const, why: 'creator' as const };
  }
  if (launch.mint_open) {
    return { action: 'REFUSED' as const, why: 'mint' as const };
  }
  const norm = normalizeTicker(launch.ticker);
  if (FORBIDDEN_NAMES.has(norm) || FORBIDDEN_NAMES.has(launch.ticker.toUpperCase())) {
    return { action: 'REFUSED' as const, why: 'own name' as const };
  }
  if (scentVal < GUARD_SCENT_MIN) {
    return { action: 'REFUSED' as const, why: 'flat scent' as const };
  }
  return { action: 'PASS' as const, why: null };
}

export function evaluateHunter(guardAction: string, mode: string, alreadyLanded: boolean) {
  if (guardAction === 'PASS' && mode === 'paper' && !alreadyLanded) {
    return { action: 'LANDED' as const, size_eth: SIZE_ETH };
  }
  return { action: 'IDLE' as const, size_eth: null };
}

export function processLaunch(launch: Launch, alreadyLandedIds: Set<string>): Decision {
  const breakdown = computeScentBreakdown(launch);
  const scentVal = breakdown.total_scent;

  const scoutRes = evaluateScout(launch, scentVal);
  let guardRes: { action: 'PASS' | 'REFUSED'; why: any };

  if (scoutRes.action === 'SKIP') {
    guardRes = { action: 'REFUSED', why: 'low scent' };
  } else {
    guardRes = evaluateGuard(launch, scentVal);
  }

  const isLanded = alreadyLandedIds.has(launch.id);
  const hunterRes = evaluateHunter(guardRes.action, 'paper', isLanded);

  return {
    ts: new Date().toISOString(),
    launch_id: launch.id,
    ticker: launch.ticker,
    scent: scentVal,
    scout: scoutRes.action,
    guard: guardRes.action,
    why: guardRes.why,
    hunter: hunterRes.action,
    size_eth: hunterRes.size_eth,
    mode: 'paper',
  };
}
