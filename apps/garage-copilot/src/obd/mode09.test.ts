import { describe, it, expect } from 'vitest';
import {
  decodeCalidResponse,
  decodeCvnResponse,
  decodeEcuNameResponse,
  mergeVehicleInfo,
} from './mode09.js';

describe('mode09 decoders', () => {
  it('decodes CALID ASCII', () => {
    expect(decodeCalidResponse(['49 04 01 43 41 4C 49 44 31 32 33'])).toBe('CALID123');
  });

  it('decodes CVN hex', () => {
    expect(decodeCvnResponse(['49 06 01 A1 B2 C3 D4'])).toBe('A1B2C3D4');
  });

  it('decodes ECU name', () => {
    expect(decodeEcuNameResponse(['49 0A 01 50 43 4D 20 45 43 55'])).toBe('PCM ECU');
  });

  it('mergeVehicleInfo drops empty records', () => {
    expect(mergeVehicleInfo({})).toBeUndefined();
    expect(mergeVehicleInfo({ calid: 'X' })?.calid).toBe('X');
  });
});
