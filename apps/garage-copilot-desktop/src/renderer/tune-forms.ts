/**
 * Tune advisor forms for final drive, injectors, and electrical load assessments.
 * Manages form submission and assessment result display.
 */

import {
  assessFinalDriveChange,
  assessInjectorsForTarget,
  assessAddedElectricalLoad,
  type Assessment
} from "./core.js";
import { errorLine, errMsg, getElement, numFrom, clamp } from "./ui-helpers.js";

type Zone = "ok" | "watch" | "warn";

/** Human-readable labels + units for assessment detail keys. */
const TUNE_LABELS: Record<string, string> = {
  currentRpm: "Current cruise RPM",
  newRpm: "New cruise RPM",
  deltaPct: "Change",
  requiredCcMin: "Required injector",
  proposedCcMin: "Proposed injector",
  headroomPct: "Headroom",
  perInjectorLbHr: "Fuel per injector",
  totalLbHr: "Total fuel",
  addedAmps: "Added draw",
  totalAmps: "Total draw",
  utilizationPct: "Alternator load"
};

const TUNE_UNITS: Record<string, string> = {
  currentRpm: "rpm",
  newRpm: "rpm",
  deltaPct: "%",
  requiredCcMin: "cc/min",
  proposedCcMin: "cc/min",
  headroomPct: "%",
  perInjectorLbHr: "lb/hr",
  totalLbHr: "lb/hr",
  addedAmps: "A",
  totalAmps: "A",
  utilizationPct: "%"
};

export class TuneAdvisorController {
  private fdButton: HTMLElement;
  private fdResultEl: HTMLElement;
  private injButton: HTMLElement;
  private injResultEl: HTMLElement;
  private loadButton: HTMLElement;
  private loadResultEl: HTMLElement;
  private injSizeInput: HTMLInputElement;

  constructor(
    fdButtonId: string,
    fdResultId: string,
    injButtonId: string,
    injResultId: string,
    loadButtonId: string,
    loadResultId: string,
    injSizeInputId: string
  ) {
    this.fdButton = getElement(fdButtonId);
    this.fdResultEl = getElement(fdResultId);
    this.injButton = getElement(injButtonId);
    this.injResultEl = getElement(injResultId);
    this.loadButton = getElement(loadButtonId);
    this.loadResultEl = getElement(loadResultId);
    this.injSizeInput = getElement<HTMLInputElement>(injSizeInputId);
  }

  setup(): void {
    this.fdButton.addEventListener("click", () => this.runFinalDrive());
    this.injButton.addEventListener("click", () => this.runInjectors());
    this.loadButton.addEventListener("click", () => this.runLoad());
  }

  private runFinalDrive(): void {
    this.renderAssessment(
      this.fdResultEl,
      () =>
        assessFinalDriveChange({
          speedMph: numFrom("fd-speed"),
          tireDiameterIn: numFrom("fd-tire"),
          topGearRatio: numFrom("fd-gear"),
          currentFinalDrive: numFrom("fd-from"),
          newFinalDrive: numFrom("fd-to")
        })
    );
  }

  private runInjectors(): void {
    this.renderAssessment(
      this.injResultEl,
      () => {
        const proposed = this.injSizeInput.value.trim();
        return assessInjectorsForTarget({
          targetHp: numFrom("inj-hp"),
          cylinders: numFrom("inj-cyl"),
          proposedCcMin: proposed === "" ? undefined : Number(proposed)
        });
      }
    );
  }

  private runLoad(): void {
    this.renderAssessment(
      this.loadResultEl,
      () =>
        assessAddedElectricalLoad({
          systemVoltage: numFrom("load-volt"),
          existingLoadA: numFrom("load-existing"),
          addedWatts: numFrom("load-watts"),
          alternatorRatedA: numFrom("load-alt")
        })
    );
  }

  private renderAssessment(target: HTMLElement, run: () => Assessment): void {
    try {
      const a = run();
      target.replaceChildren();

      const verdict = document.createElement("div");
      verdict.className = `verdict verdict--${a.ok ? "ok" : "warn"}`;
      verdict.textContent = a.ok ? "✓ Within limits" : "✗ Check this";
      target.appendChild(verdict);

      const summary = document.createElement("div");
      summary.className = "verdict-summary";
      summary.textContent = a.summary;
      target.appendChild(summary);

      const bar = buildTuneBar(a.details);
      if (bar) target.appendChild(bar);

      const metrics = document.createElement("div");
      metrics.className = "metrics";
      for (const [k, val] of Object.entries(a.details)) {
        const row = document.createElement("div");
        row.className = "metric";
        const key = document.createElement("span");
        key.className = "metric-key";
        key.textContent = tuneLabel(k);
        const value = document.createElement("span");
        value.className = "metric-val";
        value.textContent = tuneValue(k, val);
        row.append(key, value);
        metrics.appendChild(row);
      }
      target.appendChild(metrics);

      if (a.notes.length > 0) {
        const notes = document.createElement("ul");
        notes.className = "tune-notes";
        for (const note of a.notes) {
          const li = document.createElement("li");
          li.textContent = note;
          notes.appendChild(li);
        }
        target.appendChild(notes);
      }
    } catch (err) {
      target.replaceChildren(errorLine(errMsg(err)));
    }
  }
}

function tuneLabel(key: string): string {
  return TUNE_LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function tuneValue(key: string, value: number | string): string {
  const signed =
    (key === "deltaPct" || key === "headroomPct") && typeof value === "number" && value > 0
      ? `+${value}`
      : String(value);
  const unit = TUNE_UNITS[key];
  return unit ? `${signed} ${unit}` : signed;
}

const numOf = (v: number | string): number => (typeof v === "number" ? v : Number(v));

/** A labelled horizontal bar. `fill`/`marks` are 0..1 fractions of the track. */
function makeBar(
  left: string,
  right: string,
  fill: number,
  zone: Zone,
  marks: Array<{ at: number; label: string }> = []
): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "bar-wrap";
  const cap = document.createElement("div");
  cap.className = "bar-caption";
  const l = document.createElement("span");
  l.textContent = left;
  const r = document.createElement("span");
  r.textContent = right;
  cap.append(l, r);
  wrap.appendChild(cap);
  const bar = document.createElement("div");
  bar.className = "bar";
  const fillEl = document.createElement("div");
  fillEl.className = `bar-fill${zone !== "ok" ? ` bar-fill--${zone}` : ""}`;
  fillEl.style.width = `${clamp(fill, 0, 1) * 100}%`;
  bar.appendChild(fillEl);
  for (const m of marks) {
    const mk = document.createElement("div");
    mk.className = "bar-mark";
    mk.style.left = `${clamp(m.at, 0, 1) * 100}%`;
    mk.dataset.label = m.label;
    bar.appendChild(mk);
  }
  wrap.appendChild(bar);
  return wrap;
}

/** Pick a signature visual for whichever assessment this is. */
function buildTuneBar(d: Record<string, number | string>): HTMLElement | null {
  if ("utilizationPct" in d) {
    const util = numOf(d.utilizationPct);
    const zone: Zone = util >= 100 ? "warn" : util >= 80 ? "watch" : "ok";
    return makeBar("Alternator load", `${util}%`, util / 100, zone, [
      { at: 0.8, label: "80%" },
      { at: 1, label: "100%" }
    ]);
  }
  if ("newRpm" in d && "currentRpm" in d && "deltaPct" in d) {
    const cur = numOf(d.currentRpm);
    const nw = numOf(d.newRpm);
    const scale = (Math.max(cur, nw) * 1.2) || 1;
    const zone: Zone = Math.abs(numOf(d.deltaPct)) >= 10 ? "watch" : "ok";
    return makeBar("Cruise RPM", `${nw} rpm`, nw / scale, zone, [{ at: cur / scale, label: "now" }]);
  }
  if ("proposedCcMin" in d && "requiredCcMin" in d) {
    const req = numOf(d.requiredCcMin);
    const prop = numOf(d.proposedCcMin);
    const frac = prop > 0 ? req / prop : 1;
    const zone: Zone = frac > 1 ? "warn" : frac > 0.9 ? "watch" : "ok";
    return makeBar("Injector demand at target", `${Math.round(frac * 100)}% of injector`, frac, zone, [
      { at: 1, label: "max" }
    ]);
  }
  return null;
}
