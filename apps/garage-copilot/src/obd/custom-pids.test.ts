import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerCustomPids,
  clearCustomPids,
  decodeAnyPidData,
  lookupAnyFormula,
  parseCustomPidJson,
} from './custom-pids.js';

describe('custom PIDs', () => {
  beforeEach(() => clearCustomPids());

  it('registers and decodes a custom PID', () => {
    registerCustomPids([
      { pid: 'F0', label: 'Boost', unit: 'kPa', bytes: 1, formula: 'raw_a' },
    ]);
    expect(lookupAnyFormula('F0')?.label).toBe('Boost');
    expect(decodeAnyPidData('F0', [42])?.value).toBe(42);
  });

  it('parses JSON definitions', () => {
    const defs = parseCustomPidJson(
      '[{"pid":"22","label":"Test","formula":"percent_a","bytes":1}]'
    );
    expect(defs).toHaveLength(1);
    expect(defs[0].pid).toBe('22');
  });
});
