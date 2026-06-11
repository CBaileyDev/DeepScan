/**
 * Re-exports the DeepScan engine so the GUI reuses the exact same tested OBD
 * driver, decoders, diagnostic/monitor/tune logic that the CLI and library use.
 */

export {
  Elm327Client,
  ReplayTransport,
  SimulatedObdReader,
  DEMO_VEHICLE,
  DEMO_LIVE_PIDS,
  runDiagnosticSession,
  buildReport,
  analyzeTrends,
  assessFinalDriveChange,
  assessInjectorsForTarget,
  assessAddedElectricalLoad,
  PID_FORMULAS,
  lookupAnyFormula,
  registerCustomPids,
  parseCustomPidJson,
  exportCustomPidJson,
  decodeVin,
  convertUnit,
} from '@deepscan/engine';

export type {
  ObdTransport,
  ObdReader,
  ObdIdentity,
  DiagnosticSnapshot,
  DiagnosticReport,
  TimedSample,
  TrendReport,
  DecodedPid,
  Assessment,
  VinDecode,
  UnitSystem,
  CustomPidDef,
} from '@deepscan/engine';
