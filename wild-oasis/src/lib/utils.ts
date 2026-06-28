export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );

export const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    // Booking dates are stored as UTC midnight; format in UTC so a date-only
    // value isn't shifted to the previous/next day by the local timezone.
    timeZone: "UTC",
  }).format(new Date(date));

// "YYYY-MM-DD" for a date the user picked locally (e.g. in a calendar).
export const toDateInput = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

// Parse a "YYYY-MM-DD" string as a local-midnight date.
export const parseDateInput = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// Stored booking dates are UTC midnight; render them as the same calendar day
// in local time so the calendar marks the correct days.
export const utcToLocalDay = (date: Date | string) => {
  const dt = new Date(date);
  return new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate());
};
