import { describe, it, expect } from 'vitest';
import { isValidHistoryRecord } from './ipc.js';

describe('isValidHistoryRecord', () => {
  it('accepts a well-formed record', () => {
    expect(
      isValidHistoryRecord({
        savedAt: Date.now(),
        label: 'Demo',
        vehicleMake: 'Honda',
        snapshot: { capturedAt: '2026-01-01T00:00:00.000Z' },
      })
    ).toBe(true);
  });

  it('rejects missing or invalid fields', () => {
    expect(isValidHistoryRecord(null)).toBe(false);
    expect(isValidHistoryRecord({ savedAt: 'nope', snapshot: {} })).toBe(false);
    expect(isValidHistoryRecord({ savedAt: 1, snapshot: 'bad' })).toBe(false);
    expect(isValidHistoryRecord({ savedAt: 1, vehicleMake: 42, snapshot: {} })).toBe(false);
  });
});
