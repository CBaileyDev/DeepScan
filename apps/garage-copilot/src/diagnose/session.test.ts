import { describe, it, expect } from 'vitest';
import { runDiagnosticSession } from './session.js';
import { Elm327Client } from '../obd/elm327.js';
import { ReplayTransport } from '../obd/replay-transport.js';
import { DEMO_VEHICLE } from '../obd/recordings.js';
import type { ObdReader, ObdIdentity } from '../obd/reader.js';
import type { MonitorStatus } from '../obd/dtc-decode.js';
import type { DecodedPid } from '../obd/pid-formulas.js';

const FIXED = () => new Date('2026-01-01T00:00:00.000Z');

describe('runDiagnosticSession against the demo vehicle', () => {
  it('collects a complete, internally-consistent snapshot', async () => {
    const client = new Elm327Client(new ReplayTransport(DEMO_VEHICLE));
    const snap = await runDiagnosticSession(client, { now: FIXED });

    expect(snap.capturedAt).toBe('2026-01-01T00:00:00.000Z');
    expect(snap.milOn).toBe(true);
    expect(snap.reportedDtcCount).toBe(2);
    expect(snap.storedDtcs).toEqual(['P0301', 'P0420']);
    expect(snap.pendingDtcs).toEqual([]);
    expect(snap.notReadyMonitors).toContain('Catalyst');
    expect(snap.voltage).toBe(14.2);
    expect(snap.vin).toBe('1HGBH41JXMN109186');
    // The default PID set is sampled and decoded.
    const rpm = snap.livePids.find((p) => p.pid === '0C');
    expect(rpm?.value).toBe(812);
    expect(snap.warnings).toEqual([]);
  });
});

describe('runDiagnosticSession tolerance', () => {
  it('records a warning (not a throw) when an optional read fails', async () => {
    const identity: ObdIdentity = { description: 'fake', protocol: 'test' };
    const status: MonitorStatus = {
      milOn: false,
      dtcCount: 0,
      ignitionType: 'spark',
      monitors: [],
    };
    const reader: ObdReader = {
      initialize: async () => identity,
      readMonitorStatus: async () => status,
      readStoredDtcs: async () => [],
      readPendingDtcs: async () => {
        throw new Error('mode 07 unsupported');
      },
      readPermanentDtcs: async () => [],
      readLivePid: async (pid: string): Promise<DecodedPid | undefined> =>
        pid === '0C' ? { pid: '0C', label: 'Engine RPM', value: 700, unit: 'rpm' } : undefined,
      readVoltage: async () => undefined,
      close: async () => undefined,
    };

    const snap = await runDiagnosticSession(reader, { livePids: ['0C', '05'], now: FIXED });
    expect(snap.pendingDtcs).toEqual([]); // fell back
    expect(snap.warnings.some((w) => /pending DTCs/.test(w))).toBe(true);
    expect(snap.livePids.map((p) => p.pid)).toEqual(['0C']); // 05 returned undefined, skipped
  });

  it('records warnings when monitor status or stored DTC reads fail', async () => {
    const identity: ObdIdentity = { description: 'fake', protocol: 'test' };
    const reader: ObdReader = {
      initialize: async () => identity,
      readMonitorStatus: async () => {
        throw new Error('mode 01 unsupported');
      },
      readStoredDtcs: async () => {
        throw new Error('mode 03 unsupported');
      },
      readPendingDtcs: async () => [],
      readPermanentDtcs: async () => [],
      readLivePid: async () => undefined,
      readVoltage: async () => undefined,
      close: async () => undefined,
    };

    const snap = await runDiagnosticSession(reader, { now: FIXED });
    expect(snap.milOn).toBe(false);
    expect(snap.storedDtcs).toEqual([]);
    expect(snap.warnings.some((w) => /monitor status/.test(w))).toBe(true);
    expect(snap.warnings.some((w) => /stored DTCs/.test(w))).toBe(true);
  });

  it('skips initialize when skipInitialize and identity are provided', async () => {
    let initCalls = 0;
    const identity: ObdIdentity = { description: 'cached', protocol: 'CAN' };
    const status: MonitorStatus = {
      milOn: false,
      dtcCount: 0,
      ignitionType: 'spark',
      monitors: [],
    };
    const reader: ObdReader = {
      initialize: async () => {
        initCalls++;
        return identity;
      },
      readMonitorStatus: async () => status,
      readStoredDtcs: async () => [],
      readPendingDtcs: async () => [],
      readPermanentDtcs: async () => [],
      readLivePid: async () => undefined,
      readVoltage: async () => undefined,
      close: async () => undefined,
    };

    const snap = await runDiagnosticSession(reader, {
      skipInitialize: true,
      identity,
      now: FIXED,
    });
    expect(initCalls).toBe(0);
    expect(snap.identity).toEqual(identity);
  });
});
