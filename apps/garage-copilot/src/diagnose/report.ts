/**
 * Turn a {@link DiagnosticSnapshot} into a structured, human-readable report.
 *
 * DTC formatting now includes make-specific meanings when available.
 * Structural decode (system / generic-vs-manufacturer / functional area) comes from SAE J2012.
 */

import type { DiagnosticSnapshot } from "./session.js";
import { convertUnit, type UnitSystem } from "../obd/units.js";
import { describeDtcByMake } from "../obd/dtc-meanings.js";

export type ReportSection = { title: string; lines: string[] };

export type DiagnosticReport = {
  headline: string;
  sections: ReportSection[];
  caveats: string[];
  /** Fully rendered plain-text report. */
  text: string;
};

const DTC_SYSTEM: Record<string, string> = {
  P: "Powertrain",
  C: "Chassis",
  B: "Body",
  U: "Network"
};

const P_AREA: Record<string, string> = {
  "0": "auxiliary emission / other",
  "1": "fuel & air metering",
  "2": "fuel & air metering (injector circuit)",
  "3": "ignition system or misfire",
  "4": "auxiliary emission controls",
  "5": "speed / idle control",
  "6": "computer & output circuits",
  "7": "transmission",
  "8": "transmission",
  "9": "transmission"
};

/** Structural + optional make-specific decode of a DTC. */
function describeStructural(code: string): string {
  const c = code.trim().toUpperCase();
  if (!/^[PCBU][0-3][0-9A-F]{3}$/.test(c)) return "unrecognized code format";
  const system = DTC_SYSTEM[c[0]] ?? "Unknown";
  const kind = c[1] === "0" ? "generic" : "manufacturer-specific";
  const area = c[0] === "P" ? P_AREA[c[2]] ?? "powertrain (other)" : `${system.toLowerCase()} system`;
  return `${system}, ${kind}, ${area}`;
}

export function describeDtcStructure(code: string, make?: string): string {
  const structural = describeStructural(code);
  const specific = make ? describeDtcByMake(code, make) : undefined;
  if (specific) {
    return `${specific.description} (${structural})`;
  }
  return structural;
}

const r = (n: number): string => (Number.isInteger(n) ? String(n) : n.toFixed(2));

/** Extract vehicle make from label like "2014 Honda Accord" → "Honda" */
function extractMake(label: string): string | undefined {
  const known = ["Toyota", "Honda", "Ford", "GM", "Chevrolet", "BMW", "Audi", "Volkswagen", "Subaru", "Nissan"];
  for (const make of known) {
    if (label.toLowerCase().includes(make.toLowerCase())) return make;
  }
  return undefined;
}

export function buildReport(
  snapshot: DiagnosticSnapshot,
  vehicleLabel?: string,
  vehicleMake?: string,
  unitSystem: UnitSystem = "metric"
): DiagnosticReport {
  const sections: ReportSection[] = [];

  const subject = vehicleLabel ? `${vehicleLabel} — ` : "";
  const headline = `${subject}MIL ${snapshot.milOn ? "ON" : "off"}, ${snapshot.reportedDtcCount} confirmed DTC${
    snapshot.reportedDtcCount === 1 ? "" : "s"
  } reported`;

  // Overview
  sections.push({
    title: "Overview",
    lines: [
      `Adapter: ${snapshot.identity.description} (${snapshot.identity.protocol})`,
      ...(snapshot.vin ? [`VIN: ${snapshot.vin}`] : []),
      `Engine type: ${snapshot.ignitionType}-ignition`,
      `MIL (check-engine light): ${snapshot.milOn ? "ON" : "off"}`,
      `ECU-reported DTC count: ${snapshot.reportedDtcCount}`,
      ...(snapshot.voltage !== undefined ? [`Module voltage: ${r(snapshot.voltage)} V`] : []),
      `Captured: ${snapshot.capturedAt}`
    ]
  });

  // Determine make for code lookup: explicit > extracted from label > undefined
  const make = vehicleMake || (vehicleLabel ? extractMake(vehicleLabel) : undefined);

  // DTCs
  const dtcLines: string[] = [];
  const dtcGroup = (label: string, codes: string[]) => {
    if (codes.length === 0) {
      dtcLines.push(`${label}: none`);
      return;
    }
    dtcLines.push(`${label}:`);
    for (const code of codes) dtcLines.push(`  • ${code} — ${describeDtcStructure(code, make)}`);
  };
  dtcGroup("Stored (confirmed)", snapshot.storedDtcs);
  dtcGroup("Pending", snapshot.pendingDtcs);
  dtcGroup("Permanent", snapshot.permanentDtcs);
  sections.push({ title: "Diagnostic Trouble Codes", lines: dtcLines });

  // Readiness
  const readinessLines = snapshot.readiness
    .filter(m => m.state !== "not-supported")
    .map(m => `${m.state === "ready" ? "✓" : "✗"} ${m.name}: ${m.state}`);
  if (snapshot.notReadyMonitors.length > 0) {
    readinessLines.push(
      `${snapshot.notReadyMonitors.length} monitor(s) not ready — a recent code clear or battery disconnect can cause this.`
    );
  }
  sections.push({
    title: "I/M Readiness (evidence only — does not predict an inspection result)",
    lines: readinessLines.length > 0 ? readinessLines : ["No supported monitors reported."]
  });

  // Live data (converted to the chosen display units)
  const liveLines = snapshot.livePids.map(p => {
    const c = convertUnit(p.value, p.unit, unitSystem);
    return `${p.label}: ${r(c.value)}${c.unit ? ` ${c.unit}` : ""}`;
  });
  sections.push({
    title: "Live Snapshot",
    lines: liveLines.length > 0 ? liveLines : ["No live parameters sampled."]
  });

  if (snapshot.warnings.length > 0) {
    sections.push({ title: "Warnings", lines: snapshot.warnings });
  }

  const caveats = [
    "This is EVIDENCE, not a repair diagnosis. Confirm against service information for the specific vehicle.",
    "DTC entries are decoded structurally only; manufacturer-specific (P1xxx, etc.) meanings are not included — look them up, don't guess.",
    "Readiness state does NOT predict an emissions-inspection result.",
    "DeepScan is read-only: it never clears codes or writes to the ECU."
  ];

  const text = render(headline, sections, caveats);
  return { headline, sections, caveats, text };
}

function render(headline: string, sections: ReportSection[], caveats: string[]): string {
  const out: string[] = [`# ${headline}`, ""];
  for (const section of sections) {
    out.push(`## ${section.title}`);
    for (const line of section.lines) out.push(line);
    out.push("");
  }
  out.push("## Caveats");
  for (const c of caveats) out.push(`- ${c}`);
  return out.join("\n");
}
