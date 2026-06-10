/**
 * History scan timeline, listing, detail view, and export.
 * Manages the History tab UI and integrates with electron IPC for persistence.
 */

import { buildReport, type UnitSystem, type DiagnosticSnapshot } from "./core.js";
import { errMsg, getElement } from "./ui-helpers.js";
import type { HistoryRecord } from "../shared/ipc.js";

type ReportRenderer = (
  container: HTMLElement,
  headline: string,
  sections: Array<{ title: string; lines: string[] }>,
  caveats: string[],
  text: string
) => void;

export class HistoryViewController {
  private historyListEl: HTMLElement;
  private historyDetailEl: HTMLElement;
  private unitSystem: UnitSystem = "metric";
  private renderReportFn: ReportRenderer;

  constructor(listElementId: string, detailElementId: string, renderReportFn: ReportRenderer) {
    this.historyListEl = getElement(listElementId);
    this.historyDetailEl = getElement(detailElementId);
    this.renderReportFn = renderReportFn;
  }

  setUnitSystem(units: UnitSystem): void {
    this.unitSystem = units;
  }

  setup(tabSelector: string, refreshButtonId: string, clearButtonId: string): void {
    try {
      const tabBtn = document.querySelector<HTMLElement>(tabSelector);
      if (tabBtn) {
        tabBtn.addEventListener("click", () => void this.loadHistory());
      }
    } catch {
      // Tab selector optional
    }

    try {
      const refreshBtn = getElement(refreshButtonId);
      refreshBtn.addEventListener("click", () => void this.loadHistory());
    } catch {
      // Button optional
    }

    try {
      const clearBtn = getElement(clearButtonId);
      clearBtn.addEventListener("click", async () => {
        await window.garage?.history.clear();
        await this.loadHistory();
        this.historyDetailEl.replaceChildren();
      });
    } catch {
      // Button optional
    }
  }

  private async loadHistory(): Promise<void> {
    if (!window.garage) return;
    const records = await window.garage.history.list();
    this.historyListEl.replaceChildren();

    if (records.length === 0) {
      const li = document.createElement("li");
      li.className = "muted";
      li.textContent = "No saved scans yet. Run a diagnostic scan and it will appear here.";
      this.historyListEl.appendChild(li);
      return;
    }

    records.forEach((record, i) => {
      try {
        this.historyListEl.appendChild(this.historyItem(record, i));
      } catch (err) {
        console.warn("Failed to render history record:", errMsg(err));
      }
    });
  }

  private historyItem(record: HistoryRecord, index: number): HTMLElement {
    const snap = record.snapshot as DiagnosticSnapshot;
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "history-item";
    const when = new Date(record.savedAt).toLocaleString();
    const codes = snap.storedDtcs.length > 0 ? snap.storedDtcs.join(", ") : "no codes";
    const mil = snap.milOn ? "MIL ON" : "MIL off";
    const top = document.createElement("div");
    top.className = "history-when";
    top.textContent = when;
    const sub = document.createElement("div");
    sub.className = "history-sub";
    sub.textContent = `${mil} · ${snap.reportedDtcCount} DTC${snap.reportedDtcCount === 1 ? "" : "s"} · ${codes}${snap.vin ? ` · ${snap.vin}` : ""}`;
    btn.append(top, sub);

    // Red timeline dot when this scan had the MIL on or stored codes; green if clean.
    if (snap.milOn || snap.storedDtcs.length > 0) btn.classList.add("is-alert");

    btn.addEventListener("click", () => {
      for (const el of document.querySelectorAll(".history-item")) {
        el.classList.remove("history-item--active");
      }
      btn.classList.add("history-item--active");
      this.showHistoryRecord(record);
    });

    if (index === 0) {
      btn.classList.add("history-item--active");
      this.showHistoryRecord(record);
    }

    li.appendChild(btn);
    return li;
  }

  private showHistoryRecord(record: HistoryRecord): void {
    const report = buildReport(record.snapshot as DiagnosticSnapshot, record.label, undefined, this.unitSystem);
    this.renderReportFn(
      this.historyDetailEl,
      report.headline,
      report.sections,
      report.caveats,
      report.text
    );
  }
}
