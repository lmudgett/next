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
