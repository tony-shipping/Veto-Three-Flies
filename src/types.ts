export interface Launch {
  id: string;
  ticker: string;
  pair: string;
  created_ts: number;
  age_s: number;
  unique_wallets: number;
  volume_eth: number;
  creator_pct: number;
  top_holder_pct: number;
  mint_open: boolean;
  in_snipe_window: boolean;
}

export interface ScentBreakdown {
  age_factor: number;
  unique_factor: number;
  volume_factor: number;
  concentration_factor: number;
  distributed_factor: number;
  total_scent: number;
}

export type ScoutAction = 'SNIFF' | 'SKIP';
export type GuardAction = 'PASS' | 'REFUSED';
export type GuardWhy = 'snipe window' | 'creator' | 'mint' | 'own name' | 'flat scent' | 'low scent' | null;
export type HunterAction = 'IDLE' | 'LANDED';

export interface Decision {
  ts: string;
  launch_id: string;
  ticker: string;
  scent: number;
  scout: ScoutAction;
  guard: GuardAction;
  why: GuardWhy;
  hunter: HunterAction;
  size_eth: number | null;
  mode: 'paper';
}
