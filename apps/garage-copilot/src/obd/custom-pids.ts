/**
 * User-defined PID formulas for parameters not in the standard J1979 table.
 *
 * Custom PIDs are registered at runtime (desktop: localStorage; CLI: optional
 * JSON file) and merged into the decode path alongside built-in formulas.
 */

import {
  decodePidData as decodeBuiltin,
  lookupFormula as lookupBuiltin,
  normalizePid,
  type DecodedPid,
  type PidFormula,
} from './pid-formulas.js';

/** Supported formula types for user-defined PIDs (no arbitrary code execution). */
export type CustomFormulaType =
  | 'raw_a'
  | 'percent_a'
  | 'temp_a'
  | 'trim_a'
  | 'rpm_ab'
  | 'voltage_ab'
  | 'maf_ab'
  | 'kpa_ab'
  | 'signed_ab_div4';

export type CustomPidDef = {
  pid: string;
  label: string;
  unit?: string;
  bytes: 1 | 2;
  formula: CustomFormulaType;
};

const r2 = (n: number): number => Math.round(n * 100) / 100;

const FORMULA_BUILDERS: Record<CustomFormulaType, (data: number[]) => number> = {
  raw_a: ([a]) => a,
  percent_a: ([a]) => r2((a * 100) / 255),
  temp_a: ([a]) => a - 40,
  trim_a: ([a]) => r2((a - 128) * (100 / 128)),
  rpm_ab: ([a, b]) => r2((256 * a + b) / 4),
  voltage_ab: ([a, b]) => r2((256 * a + b) / 1000),
  maf_ab: ([a, b]) => r2((256 * a + b) / 100),
  kpa_ab: ([a, b]) => 256 * a + b,
  signed_ab_div4: ([a, b]) => {
    const raw = 256 * a + b;
    return (raw > 32767 ? raw - 65536 : raw) / 4;
  },
};

/** In-memory registry of user-defined PIDs. */
const customRegistry = new Map<string, PidFormula>();

/** Convert a user definition into a runtime formula. */
export function customDefToFormula(def: CustomPidDef): PidFormula | undefined {
  const pid = normalizePid(def.pid);
  if (!pid) return undefined;
  const builder = FORMULA_BUILDERS[def.formula];
  if (!builder) return undefined;
  const bytes = def.bytes;
  return {
    pid,
    label: def.label.trim() || `PID ${pid}`,
    unit: def.unit,
    bytes,
    decode: (data) => builder(data),
  };
}

/** Register one or more custom PIDs (replaces any prior entry for the same PID). */
export function registerCustomPids(defs: CustomPidDef[]): void {
  for (const def of defs) {
    const formula = customDefToFormula(def);
    if (formula) customRegistry.set(formula.pid, formula);
  }
}

/** Remove all custom PIDs from the registry. */
export function clearCustomPids(): void {
  customRegistry.clear();
}

/** Look up a formula: custom registry first, then built-in table. */
export function lookupAnyFormula(pid: string | undefined): PidFormula | undefined {
  const code = normalizePid(pid);
  if (!code) return undefined;
  return customRegistry.get(code) ?? lookupBuiltin(code);
}

/** Decode a PID using custom + built-in formulas. */
export function decodeAnyPidData(pid: string, data: number[]): DecodedPid | undefined {
  const formula = lookupAnyFormula(pid);
  if (!formula) return decodeBuiltin(pid, data);
  if (data.length < formula.bytes) return undefined;
  const value = formula.decode(data.slice(0, formula.bytes));
  return { pid: formula.pid, label: formula.label, value, unit: formula.unit };
}

/** Parse a JSON array of custom PID definitions. Returns invalid entries skipped. */
export function parseCustomPidJson(json: string): CustomPidDef[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const out: CustomPidDef[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const pid = typeof o.pid === 'string' ? o.pid : undefined;
    const label = typeof o.label === 'string' ? o.label : undefined;
    const formula = typeof o.formula === 'string' ? o.formula : undefined;
    const bytes = o.bytes === 1 || o.bytes === 2 ? o.bytes : 1;
    if (!pid || !label || !formula || !(formula in FORMULA_BUILDERS)) continue;
    out.push({
      pid,
      label,
      unit: typeof o.unit === 'string' ? o.unit : undefined,
      bytes,
      formula: formula as CustomFormulaType,
    });
  }
  return out;
}

/** Serialize the current custom registry for export. */
export function exportCustomPidJson(): string {
  const defs: CustomPidDef[] = [];
  for (const f of customRegistry.values()) {
    const match = Object.entries(FORMULA_BUILDERS).find(([, fn]) => {
      const probe = f.bytes === 2 ? [0x10, 0x20] : [0x80];
      return fn(probe) === f.decode(probe);
    });
    if (!match) continue;
    defs.push({
      pid: f.pid,
      label: f.label,
      unit: f.unit,
      bytes: f.bytes as 1 | 2,
      formula: match[0] as CustomFormulaType,
    });
  }
  return JSON.stringify(defs, null, 2);
}
