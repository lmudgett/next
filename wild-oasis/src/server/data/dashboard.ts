import { prisma } from "@/lib/prisma";

// Booking dates are stored as UTC midnight; build "today" the same way so an
// equality-on-day comparison isn't shifted by the server's local timezone.
function utcDayBounds() {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const next = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, next };
}

// Bookings *created* in the window — drives the Bookings count and Sales total.
export async function getBookingsCreatedAfter(date: Date) {
  return prisma.bookings.findMany({
    where: { createdAt: { gte: date } },
    select: { totalPrice: true },
  });
}

// Stays that *started* in the window and were honoured (checked in or out) —
// drives Check-ins, Occupancy, and the duration breakdown.
export async function getStaysStartedAfter(date: Date) {
  return prisma.bookings.findMany({
    where: {
      startDate: { gte: date },
      status: { in: ["checked-in", "checked-out"] },
    },
    select: { numberOfNights: true },
  });
}

// Guests arriving today (unconfirmed) or leaving today (checked-in).
export async function getTodayActivity() {
  const { start, next } = utcDayBounds();
  return prisma.bookings.findMany({
    where: {
      OR: [
        { status: "unconfirmed", startDate: { gte: start, lt: next } },
        { status: "checked-in", endDate: { gte: start, lt: next } },
      ],
    },
    include: { guest: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getCabinCount() {
  return prisma.cabin.count();
}
