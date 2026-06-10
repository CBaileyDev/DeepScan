import { describe, it, expect } from 'vitest';
import { convertUnit } from './units.js';

describe('convertUnit', () => {
  it('passes everything through unchanged for metric', () => {
    expect(convertUnit(89, 'C', 'metric')).toEqual({ value: 89, unit: 'C' });
    expect(convertUnit(100, 'km/h', 'metric')).toEqual({ value: 100, unit: 'km/h' });
  });

  it('converts temperature, speed, distance, and pressure for imperial', () => {
    expect(convertUnit(0, 'C', 'imperial')).toEqual({ value: 32, unit: 'F' });
    expect(convertUnit(100, 'C', 'imperial')).toEqual({ value: 212, unit: 'F' });
    expect(convertUnit(100, 'km/h', 'imperial')).toEqual({ value: 62.1, unit: 'mph' });
    expect(convertUnit(100, 'km', 'imperial')).toEqual({ value: 62.1, unit: 'mi' });
    expect(convertUnit(100, 'kPa', 'imperial')).toEqual({ value: 14.5, unit: 'psi' });
  });

  it('converts flow rates for imperial', () => {
    // MAF: 1 g/s = 7.93664 lb/hr (a healthy idle ~3 g/s ≈ 23.8 lb/hr)
    expect(convertUnit(10, 'g/s', 'imperial')).toEqual({ value: 79.4, unit: 'lb/hr' });
    expect(convertUnit(10, 'L/h', 'imperial')).toEqual({ value: 2.6, unit: 'gal/h' });
  });

  it('passes through unknown or unitless values', () => {
    expect(convertUnit(812, 'rpm', 'imperial')).toEqual({ value: 812, unit: 'rpm' });
    expect(convertUnit(50, undefined, 'imperial')).toEqual({ value: 50, unit: undefined });
    expect(convertUnit(14.2, 'V', 'imperial')).toEqual({ value: 14.2, unit: 'V' });
  });
});
