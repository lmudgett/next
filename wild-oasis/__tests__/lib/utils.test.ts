import { formatCurrency, formatDate } from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats a whole number as USD", () => {
    expect(formatCurrency(300)).toBe("$300.00");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats decimals with two fraction digits", () => {
    expect(formatCurrency(49.5)).toBe("$49.50");
  });

  it("formats large numbers with grouping separators", () => {
    expect(formatCurrency(1234567)).toBe("$1,234,567.00");
  });
});

describe("formatDate", () => {
  // formatDate pins UTC, so UTC inputs format deterministically regardless of
  // the machine's local timezone.
  it("formats a Date as 'Mon D, YYYY'", () => {
    expect(formatDate(new Date("2026-07-01T00:00:00Z"))).toBe("Jul 1, 2026");
  });

  it("accepts a date string", () => {
    expect(formatDate("2026-12-25T00:00:00Z")).toBe("Dec 25, 2026");
  });
});
