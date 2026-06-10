import { describe, it, expect } from "vitest";
import { describeDtcByMake, normalizeMake, DTC_MEANINGS } from "./dtc-meanings.js";

describe("normalizeMake", () => {
  it("handles case-insensitivity", () => {
    expect(normalizeMake("HONDA")).toBe("Honda");
    expect(normalizeMake("honda")).toBe("Honda");
    expect(normalizeMake("Honda")).toBe("Honda");
  });

  it("handles aliases", () => {
    expect(normalizeMake("chevy")).toBe("Chevrolet");
    expect(normalizeMake("vw")).toBe("Volkswagen");
    expect(normalizeMake("gm")).toBe("GM");
  });

  it("handles full vehicle labels by extracting first word", () => {
    expect(normalizeMake("2014 Honda Accord")).toBe("Honda");
    expect(normalizeMake("Toyota Camry")).toBe("Toyota");
    expect(normalizeMake("Chevy Silverado")).toBe("Chevrolet");
  });

  it("returns generic for unknown make", () => {
    expect(normalizeMake("DeLorean")).toBe("Delorean"); // capitalizes but not in DB, so caller will use GENERIC
  });

  it("trims whitespace", () => {
    expect(normalizeMake("  Honda  ")).toBe("Honda");
  });
});

describe("describeDtcByMake", () => {
  it("returns generic meaning when make not provided", () => {
    const meaning = describeDtcByMake("P0300");
    expect(meaning).toBeDefined();
    expect(meaning?.description).toMatch(/Random.*Misfire/);
  });

  it("returns generic for unknown make", () => {
    const meaning = describeDtcByMake("P0300", "DeLorean");
    expect(meaning).toBeDefined();
    expect(meaning?.description).toMatch(/Random.*Misfire/);
  });

  it("returns make-specific meaning when available", () => {
    const meaning = describeDtcByMake("P0133", "Honda");
    expect(meaning).toBeDefined();
    expect(meaning?.description).toMatch(/O2 Sensor.*Response Slow.*Bank 1/);
  });

  it("returns different meanings for different makes", () => {
    const honda = describeDtcByMake("P0133", "Honda");
    const toyota = describeDtcByMake("P0133", "Toyota");
    expect(honda?.description).not.toBe(toyota?.description);
  });

  it("includes common causes in make-specific meanings", () => {
    const meaning = describeDtcByMake("P0133", "Honda");
    expect(meaning?.commonCauses).toBeDefined();
    expect(meaning?.commonCauses?.length).toBeGreaterThan(0);
  });

  it("handles case-insensitive make lookup", () => {
    const honda1 = describeDtcByMake("P0133", "Honda");
    const honda2 = describeDtcByMake("P0133", "HONDA");
    const honda3 = describeDtcByMake("P0133", "honda");
    expect(honda1?.code).toBe(honda2?.code);
    expect(honda2?.code).toBe(honda3?.code);
  });

  it("handles make aliases", () => {
    const chevy1 = describeDtcByMake("P0133", "Chevy");
    const chevy2 = describeDtcByMake("P0133", "Chevrolet");
    expect(chevy1?.code).toBe(chevy2?.code);
  });

  it("returns undefined for unknown code", () => {
    const meaning = describeDtcByMake("P9999", "Honda");
    expect(meaning).toBeUndefined();
  });

  it("returns undefined for null/empty code", () => {
    expect(describeDtcByMake("", "Honda")).toBeUndefined();
    expect(describeDtcByMake("", "")).toBeUndefined();
  });
});

describe("DTC_MEANINGS database", () => {
  it("has GENERIC entry with common codes", () => {
    expect(DTC_MEANINGS.GENERIC).toBeDefined();
    expect(DTC_MEANINGS.GENERIC.P0300).toBeDefined();
    expect(DTC_MEANINGS.GENERIC.P0301).toBeDefined();
    expect(DTC_MEANINGS.GENERIC.P0133).toBeDefined();
    expect(DTC_MEANINGS.GENERIC.P0420).toBeDefined();
  });

  it("has entries for all top 10 makes", () => {
    const makes = ["Toyota", "Honda", "Ford", "GM", "Chevrolet", "BMW", "Audi", "Volkswagen", "Subaru", "Nissan"];
    for (const make of makes) {
      expect(DTC_MEANINGS[make]).toBeDefined();
      expect(Object.keys(DTC_MEANINGS[make]).length).toBeGreaterThan(0);
    }
  });

  it("has common codes P0171 (lean) and P0172 (rich) for all makes", () => {
    const makes = ["Toyota", "Honda", "Ford", "GM", "Chevrolet", "BMW", "Audi", "Volkswagen", "Subaru", "Nissan"];
    for (const make of makes) {
      expect(DTC_MEANINGS[make].P0171).toBeDefined();
      expect(DTC_MEANINGS[make].P0172).toBeDefined();
    }
  });

  it("includes commonCauses for fault diagnosis", () => {
    const meaning = DTC_MEANINGS.GENERIC.P0171;
    expect(meaning.commonCauses).toBeDefined();
    expect(meaning.commonCauses?.length).toBeGreaterThan(0);
  });

  it("marks likelihood as common or rare where specified", () => {
    const common = DTC_MEANINGS.GENERIC.P0300;
    const rare = DTC_MEANINGS.GENERIC.P0600;
    expect(common.likelihood).toBe("common");
    expect(rare.likelihood).toBe("rare");
  });
});
