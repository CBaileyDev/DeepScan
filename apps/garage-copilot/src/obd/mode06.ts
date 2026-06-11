/**
 * Decode Mode 06 (On-Board Monitoring Test Results).
 *
 * Mode 06 returns per-monitor test values with min/max limits so you can see
 * whether a component passed its self-test. ECUs vary in which Test IDs (TIDs)
 * they support; this decoder handles the standard 46 <TID> <CID> <val> <min>
 * <max> frame layout from SAE J1979.
 */

import { parseHexBytes } from './dtc-decode.js';

export type OnboardTestResult = {
  /** Test ID (hex, e.g. "01"). */
  tid: string;
  /** Component ID within the test (hex, e.g. "11"). */
  cid: string;
  /** Measured test value (engineering units vary by TID/CID). */
  value: number;
  /** Lower limit reported by the ECU. */
  min: number;
  /** Upper limit reported by the ECU. */
  max: number;
  /** Pass/fail derived from value vs limits (when limits are meaningful). */
  status: 'pass' | 'fail' | 'unknown';
};

/** Human labels for common OBD-II Test IDs (SAE J1979). */
export const TID_LABELS: Record<string, string> = {
  '01': 'Rich to lean O2 sensor threshold (voltage)',
  '02': 'Lean to rich O2 sensor threshold (voltage)',
  '03': 'Low catalyst monitor threshold (voltage)',
  '04': 'High catalyst monitor threshold (voltage)',
  '05': 'Rich to lean O2 sensor threshold (voltage), bank 2',
  '06': 'Lean to rich O2 sensor threshold (voltage), bank 2',
  '07': 'Low catalyst monitor threshold (voltage), bank 2',
  '08': 'High catalyst monitor threshold (voltage), bank 2',
  '09': 'EVAP system (absolute pressure)',
  '0A': 'EVAP system (absolute pressure)',
  '0B': 'EVAP purge flow',
};

function u16(hi: number, lo: number): number {
  return 256 * hi + lo;
}

function deriveStatus(value: number, min: number, max: number): 'pass' | 'fail' | 'unknown' {
  if (min === 0 && max === 0) return 'unknown';
  if (max > min) return value >= min && value <= max ? 'pass' : 'fail';
  return 'unknown';
}

/**
 * Decode one or more Mode 06 response lines into test results.
 * Returns every 46-frame found; empty array if none.
 */
export function decodeMode06Response(lines: string[]): OnboardTestResult[] {
  const results: OnboardTestResult[] = [];
  for (const raw of lines) {
    const cleaned = raw.replace(/^[0-9A-Fa-f]+:\s*/, '');
    const bytes = parseHexBytes(cleaned);
    for (let i = 0; i + 6 < bytes.length; i++) {
      if (bytes[i] !== 0x46) continue;
      const tid = bytes[i + 1].toString(16).toUpperCase().padStart(2, '0');
      const cid = bytes[i + 2].toString(16).toUpperCase().padStart(2, '0');
      const value = u16(bytes[i + 3], bytes[i + 4]);
      const min = u16(bytes[i + 5], bytes[i + 6]);
      const max = bytes.length >= i + 9 ? u16(bytes[i + 7], bytes[i + 8]) : 0;
      results.push({ tid, cid, value, min, max, status: deriveStatus(value, min, max) });
      i += 6;
    }
  }
  return results;
}

/** Label for a TID, falling back to the hex code. */
export function labelTid(tid: string): string {
  const t = tid.toUpperCase().padStart(2, '0');
  return TID_LABELS[t] ?? `Test ID ${t}`;
}
