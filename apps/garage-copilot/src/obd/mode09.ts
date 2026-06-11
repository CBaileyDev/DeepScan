/**
 * Decode Mode 09 (vehicle information) responses beyond VIN.
 *
 * Mode 09 returns ASCII or hex fields after a "49 <pid>" header, often spread
 * across ISO-TP frames. This module is tolerant of frame indices and padding,
 * mirroring vin.ts.
 */

import { parseHexBytes } from './dtc-decode.js';

export type VehicleInfo = {
  /** Calibration ID (PID 04), when reported. */
  calid?: string;
  /** Calibration Verification Number (PID 06), hex string. */
  cvn?: string;
  /** ECU name (PID 0A), when reported. */
  ecuName?: string;
};

/** Concatenate all hex bytes from response lines (strips ISO-TP frame prefixes). */
function concatBytes(lines: string[]): number[] {
  const bytes: number[] = [];
  for (const raw of lines) {
    const cleaned = raw.replace(/^[0-9A-Fa-f]+:\s*/, '');
    bytes.push(...parseHexBytes(cleaned));
  }
  return bytes;
}

/** Extract printable ASCII after a "49 <pidByte>" header. */
function decodeAsciiField(lines: string[], pidByte: number, minLen = 1): string | undefined {
  const bytes = concatBytes(lines);
  for (let i = 0; i + 1 < bytes.length; i++) {
    if (bytes[i] === 0x49 && bytes[i + 1] === pidByte) {
      const text = bytes
        .slice(i + 2)
        .filter((b) => b >= 0x20 && b <= 0x7e)
        .map((b) => String.fromCharCode(b))
        .join('')
        .replace(/\s+/g, ' ')
        .trim();
      return text.length >= minLen ? text : undefined;
    }
  }
  return undefined;
}

/** Extract hex digits after a "49 <pidByte>" header (for CVN). */
function decodeHexField(lines: string[], pidByte: number, minBytes = 2): string | undefined {
  const bytes = concatBytes(lines);
  for (let i = 0; i + 1 < bytes.length; i++) {
    if (bytes[i] === 0x49 && bytes[i + 1] === pidByte) {
      let payload = bytes.slice(i + 2);
      // Skip ISO-TP / length count byte when present (same pattern as VIN PID 02).
      if (payload.length > minBytes && payload[0] <= 0x0f) payload = payload.slice(1);
      payload = payload.filter((b) => b > 0);
      if (payload.length < minBytes) return undefined;
      return payload.map((b) => b.toString(16).toUpperCase().padStart(2, '0')).join('');
    }
  }
  return undefined;
}

export function decodeCalidResponse(lines: string[]): string | undefined {
  return decodeAsciiField(lines, 0x04, 4);
}

export function decodeCvnResponse(lines: string[]): string | undefined {
  return decodeHexField(lines, 0x06, 2);
}

export function decodeEcuNameResponse(lines: string[]): string | undefined {
  return decodeAsciiField(lines, 0x0a, 2);
}

/** Merge individually-decoded Mode 09 fields into a single record. */
export function mergeVehicleInfo(parts: Partial<VehicleInfo>): VehicleInfo | undefined {
  const info: VehicleInfo = {};
  if (parts.calid) info.calid = parts.calid;
  if (parts.cvn) info.cvn = parts.cvn;
  if (parts.ecuName) info.ecuName = parts.ecuName;
  return Object.keys(info).length > 0 ? info : undefined;
}
