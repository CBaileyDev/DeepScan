/**
 * Shared UI helper functions used across multiple modules.
 */

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
