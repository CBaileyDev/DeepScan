/**
 * IPC contract shared between the Electron main and renderer processes.
 *
 * The renderer does ALL the OBD work itself via the Web Serial API; the only
 * thing it needs from main is the native serial-port picker that Electron's
 * `select-serial-port` flow drives. These channels carry that handshake.
 */

/** A serial port offered by Electron's picker. */
export type SerialPortInfo = {
  portId: string;
  portName?: string;
  displayName?: string;
  vendorId?: string;
  productId?: string;
};

export const IPC = {
  /** main -> renderer: here is the list of ports to choose from. */
  SerialPorts: 'serial:ports',
  /** renderer -> main: the user picked this portId ("" to cancel). */
  SerialChoose: 'serial:choose',
  /** renderer -> main: get app/runtime info. */
  AppInfo: 'app:info',
  /** renderer -> main: list saved scans (newest first). */
  HistoryList: 'history:list',
  /** renderer -> main: persist a scan record. */
  HistorySave: 'history:save',
  /** renderer -> main: clear all saved scans. */
  HistoryClear: 'history:clear',
} as const;

export type AppInfo = {
  appVersion: string;
  electron: string;
  chrome: string;
  platform: string;
};

/** A persisted diagnostic scan. `snapshot` is a DiagnosticSnapshot (opaque to main). */
export type HistoryRecord = {
  savedAt: number;
  label?: string;
  /** OEM make for make-specific DTC descriptions when re-rendering history. */
  vehicleMake?: string;
  snapshot: unknown;
};

/** Validate an IPC history payload before persisting to disk. */
export function isValidHistoryRecord(record: unknown): record is HistoryRecord {
  if (!record || typeof record !== 'object') return false;
  const r = record as Record<string, unknown>;
  return (
    typeof r.savedAt === 'number' &&
    Number.isFinite(r.savedAt) &&
    (r.label === undefined || typeof r.label === 'string') &&
    (r.vehicleMake === undefined || typeof r.vehicleMake === 'string') &&
    r.snapshot !== undefined &&
    typeof r.snapshot === 'object'
  );
}
