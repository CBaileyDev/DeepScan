/**
 * Shared UI helper functions used across multiple modules.
 */

export function getElement<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

export function numFrom(id: string): number {
  return Number(getElement<HTMLInputElement>(id).value);
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

export function infoLine(text: string): HTMLElement {
  const p = document.createElement("p");
  p.className = "muted";
  p.textContent = text;
  return p;
}

export function errorLine(text: string): HTMLElement {
  const p = document.createElement("p");
  p.className = "row row--warn";
  p.textContent = text;
  return p;
}

export function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
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
