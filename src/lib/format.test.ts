import { describe, expect, it } from "vitest";
import {
  certificateStatus,
  currentMonth,
  formatDuration,
  spanMonths,
} from "./format";

describe("formatDuration", () => {
  it("writes years and months the way the ledger shows them", () => {
    expect(formatDuration(54)).toBe("4 yrs 6 mo");
    expect(formatDuration(12)).toBe("1 yr");
    expect(formatDuration(13)).toBe("1 yr 1 mo");
    expect(formatDuration(24)).toBe("2 yrs");
    expect(formatDuration(1)).toBe("1 mo");
    expect(formatDuration(0)).toBe("0 mo");
  });
});

describe("spanMonths", () => {
  it("counts both ends and runs open roles to now", () => {
    expect(spanMonths("2026-01", "2026-01", "2026-10")).toBe(1);
    expect(spanMonths("2026-01", null, "2026-10")).toBe(10);
  });
});

describe("certificateStatus", () => {
  it("is valid through the expiry month and expired after it", () => {
    expect(certificateStatus(null, "2026-10")).toBe("no-expiry");
    expect(certificateStatus("2026-10", "2026-10")).toBe("valid");
    expect(certificateStatus("2026-09", "2026-10")).toBe("expired");
    expect(certificateStatus("2027-01", "2026-12")).toBe("valid");
  });
});

describe("currentMonth", () => {
  it("uses Jakarta time, so UTC 31 Oct 20:00 is already November", () => {
    expect(currentMonth(new Date("2026-10-31T20:00:00Z"))).toBe("2026-11");
    expect(currentMonth(new Date("2026-10-31T16:00:00Z"))).toBe("2026-10");
  });
});
