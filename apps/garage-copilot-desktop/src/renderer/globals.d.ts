import type { DeepScanBridge } from '../main/preload.js';

declare global {
  interface Window {
    /** The preload bridge exposed via contextBridge. */
    deepscan: DeepScanBridge;
  }
}

export {};
