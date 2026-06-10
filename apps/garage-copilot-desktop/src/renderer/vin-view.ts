/**
 * VIN input, validation, offline decode, and online NHTSA lookup.
 * Manages the VIN checker tab UI and stores the vehicle make for DTC enrichment.
 */

import { decodeVin, type VinDecode } from "./core.js";
import { infoLine, errorLine, errMsg } from "./ui-helpers.js";

export class VinViewController {
  private vehicleMake: string | undefined;
  private resultEl: HTMLElement;
  private onlineEl: HTMLElement;
  private inputEl: HTMLInputElement;

  constructor(
    resultElementId: string,
    onlineElementId: string,
    inputElementId: string
  ) {
    this.resultEl = this.getElement(resultElementId);
    this.onlineEl = this.getElement(onlineElementId);
    this.inputEl = this.getElement<HTMLInputElement>(inputElementId);
  }

  private getElement<T extends HTMLElement = HTMLElement>(id: string): T {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Missing element #${id}`);
    return el as T;
  }

  get make(): string | undefined {
    return this.vehicleMake;
  }

  reset(): void {
    this.vehicleMake = undefined;
  }

  setAndCheck(vinValue: string): void {
    this.inputEl.value = vinValue;
    this.checkVin();
  }

  setup(checkButtonId: string, onlineButtonId: string): void {
    const checkBtn = this.getElement(checkButtonId);
    const onlineBtn = this.getElement(onlineButtonId);

    checkBtn.addEventListener("click", () => this.checkVin());
    this.inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.checkVin();
    });
    onlineBtn.addEventListener("click", () => this.onlineCheck());
  }

  private checkVin(): void {
    const vin = this.inputEl.value.trim();
    this.onlineEl.replaceChildren();
    if (vin === "") {
      this.resultEl.replaceChildren(infoLine("Enter a VIN to check."));
      return;
    }
    this.renderVinDecode(decodeVin(vin));
  }

  private onlineCheck(): void {
    const decoded = decodeVin(this.inputEl.value);
    this.renderVinDecode(decoded);
    // Don't spend a request on a VIN that fails the offline format check.
    if (decoded.validation.format.ok) {
      void this.vinOnlineLookup(decoded.vin, decoded.modelYear);
    }
  }

  private renderVinDecode(d: VinDecode): void {
    const fmtOk = d.validation.format.ok;
    const cd = d.validation.checkDigit;

    const banner = document.createElement("div");
    banner.className = "report-headline " + (!fmtOk ? "is-warn" : cd.matches ? "is-ok" : "");
    const lamp = document.createElement("span");
    lamp.className = "lamp " + (!fmtOk ? "lamp--warn" : cd.matches ? "lamp--ok" : "lamp--watch");
    const txt = document.createElement("span");
    txt.textContent = d.validation.assessment;
    banner.append(lamp, txt);
    this.resultEl.replaceChildren(banner);

    if (!fmtOk) return; // nothing structural to show on a malformed VIN

    const rows: Array<[string, string | undefined]> = [
      ["VIN", d.vin],
      ["Country of origin", d.country],
      ["Region", d.region],
      ["Model year", d.modelYear ? String(d.modelYear) : undefined],
      ["WMI (manufacturer)", d.wmi],
      ["Plant code", d.plantCode],
      ["Serial", d.serial],
      ["Check digit", cd.evaluated ? `${cd.found} (expected ${cd.expected})` : undefined]
    ];
    this.resultEl.appendChild(metricsCard(rows));
  }

  private async vinOnlineLookup(vin: string, modelYear?: number): Promise<void> {
    this.onlineEl.replaceChildren(infoLine("Looking up the VIN with NHTSA vPIC…"));
    try {
      const yr = modelYear ? `&modelyear=${modelYear}` : "";
      const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json${yr}`;
      // Wrap fetch in timeout (10 seconds) to avoid hanging on slow/offline networks
      const fetchPromise = fetch(url);
      const timeoutPromise = new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error("vPIC API timeout (>10s)")), 10000)
      );
      const res = await Promise.race([fetchPromise, timeoutPromise]);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { Results?: Array<Record<string, string>> };
      const row = json.Results?.[0];
      if (!row) throw new Error("no result returned");
      this.vehicleMake = row.Make;
      this.renderVinOnline(row);
    } catch (err) {
      this.onlineEl.replaceChildren(
        errorLine(`Online lookup unavailable: ${errMsg(err)}. The offline decode above still applies.`)
      );
    }
  }

  private renderVinOnline(row: Record<string, string>): void {
    this.onlineEl.replaceChildren();
    const head = document.createElement("div");
    head.className = "report-headline is-ok";
    const lamp = document.createElement("span");
    lamp.className = "lamp lamp--ok";
    const txt = document.createElement("span");
    txt.textContent = "NHTSA vPIC decode";
    head.append(lamp, txt);
    this.onlineEl.appendChild(head);

    const plant = [row.PlantCity, row.PlantState, row.PlantCountry].filter((v) => v && v.trim()).join(", ");
    const rows: Array<[string, string | undefined]> = [
      ["Make", row.Make],
      ["Model", row.Model],
      ["Model year", row.ModelYear],
      ["Trim", row.Trim],
      ["Body class", row.BodyClass],
      ["Vehicle type", row.VehicleType],
      ["Cylinders", row.EngineCylinders],
      ["Displacement (L)", row.DisplacementL],
      ["Fuel", row.FuelTypePrimary],
      ["Drive", row.DriveType],
      ["Manufacturer", row.Manufacturer],
      ["Plant", plant || undefined]
    ];
    this.onlineEl.appendChild(metricsCard(rows));

    if (row.ErrorCode && row.ErrorCode !== "0" && row.ErrorText) {
      this.onlineEl.appendChild(infoLine(`vPIC note: ${row.ErrorText}`));
    }
  }
}

/** Build a card of label/value metric rows, skipping blank values. */
export function metricsCard(rows: Array<[string, string | undefined]>): HTMLElement {
  const card = document.createElement("div");
  card.className = "card";
  const grid = document.createElement("div");
  grid.className = "metrics";
  for (const [key, value] of rows) {
    if (!value || value.trim() === "") continue;
    const row = document.createElement("div");
    row.className = "metric";
    const k = document.createElement("span");
    k.className = "metric-key";
    k.textContent = key;
    const v = document.createElement("span");
    v.className = "metric-val";
    v.textContent = value;
    row.append(k, v);
    grid.appendChild(row);
  }
  card.appendChild(grid);
  return card;
}

