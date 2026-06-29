import * as dashboardDao from "@/server/data/dashboard";

export type DashboardBooking = { totalPrice: number };
export type DashboardStay = { numberOfNights: number };
export type TodayActivityItem = {
  id: number;
  status: string;
  numberOfNights: number;
  guestName: string;
  guestCountryFlag: string;
};

export type DashboardData = {
  numDays: number;
  bookings: DashboardBooking[];
  confirmedStays: DashboardStay[];
  cabinCount: number;
  todayActivity: TodayActivityItem[];
};

export async function getDashboardData(numDays: number): Promise<DashboardData> {
  const cutoff = new Date(Date.now() - numDays * 24 * 60 * 60 * 1000);

  const [bookings, confirmedStays, cabinCount, activity] = await Promise.all([
    dashboardDao.getBookingsCreatedAfter(cutoff),
    dashboardDao.getStaysStartedAfter(cutoff),
    dashboardDao.getCabinCount(),
    dashboardDao.getTodayActivity(),
  ]);

  const todayActivity: TodayActivityItem[] = activity.map((b) => ({
    id: b.id,
    status: b.status,
    numberOfNights: b.numberOfNights,
    guestName: b.guest.fullName,
    guestCountryFlag: b.guest.countryFlag,
  }));

  return { numDays, bookings, confirmedStays, cabinCount, todayActivity };
}
