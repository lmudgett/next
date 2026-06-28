import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

const cabins = [
  { name: "001", maxCapacity: 2, regularPrice: 250, discount: 0, description: "Cozy retreat for two." },
  { name: "002", maxCapacity: 2, regularPrice: 350, discount: 25, description: "Romantic forest hideaway." },
  { name: "003", maxCapacity: 4, regularPrice: 300, discount: 0, description: "Family cabin near the lake." },
  { name: "004", maxCapacity: 4, regularPrice: 500, discount: 50, description: "Premium cabin with a view." },
  { name: "005", maxCapacity: 6, regularPrice: 350, discount: 0, description: "Spacious lodge for groups." },
  { name: "006", maxCapacity: 8, regularPrice: 800, discount: 100, description: "Luxury cabin, sleeps eight." },
];

const guests = [
  { fullName: "Jane Cooper", email: "jane@example.com", nationality: "United States", countryFlag: "🇺🇸", nationalId: "US123456" },
  { fullName: "Wade Warren", email: "wade@example.com", nationality: "Canada", countryFlag: "🇨🇦", nationalId: "CA234567" },
  { fullName: "Esther Howard", email: "esther@example.com", nationality: "United Kingdom", countryFlag: "🇬🇧", nationalId: "UK345678" },
  { fullName: "Cameron Williamson", email: "cameron@example.com", nationality: "Germany", countryFlag: "🇩🇪", nationalId: "DE456789" },
];

async function main() {
  // Clear in FK-dependency order so reseeding is idempotent.
  await prisma.bookings.deleteMany();
  await prisma.guests.deleteMany();
  await prisma.cabin.deleteMany();
  await prisma.settings.deleteMany();

  await prisma.settings.create({
    data: {
      minBookingLength: 1,
      maxBookingLength: 14,
      maxGuestNumberPerBooking: 10,
      breakfastPrice: 100,
    },
  });

  const cabinRecords = await Promise.all(
    cabins.map((data) => prisma.cabin.create({ data }))
  );
  const guestRecords = await Promise.all(
    guests.map((data) => prisma.guests.create({ data }))
  );

  const byName = Object.fromEntries(cabinRecords.map((c) => [c.name, c.id]));

  const bookings = [
    { cabin: "001", guest: 0, startDate: "2026-07-01", endDate: "2026-07-06", numberOfNights: 5, numberOfGuests: 2, cabinPrice: 600, extraPrice: 60, totalPrice: 660, status: "confirmed", hasBreakfast: true, hasPaid: true, notes: "" },
    { cabin: "002", guest: 1, startDate: "2026-07-10", endDate: "2026-07-13", numberOfNights: 3, numberOfGuests: 4, cabinPrice: 600, extraPrice: 0, totalPrice: 600, status: "unconfirmed", hasBreakfast: false, hasPaid: false, notes: "Late check-in" },
    { cabin: "005", guest: 2, startDate: "2026-06-20", endDate: "2026-06-27", numberOfNights: 7, numberOfGuests: 2, cabinPrice: 1330, extraPrice: 70, totalPrice: 1400, status: "checked-in", hasBreakfast: true, hasPaid: true, notes: "" },
    { cabin: "003", guest: 3, startDate: "2026-05-02", endDate: "2026-05-04", numberOfNights: 2, numberOfGuests: 3, cabinPrice: 400, extraPrice: 0, totalPrice: 400, status: "checked-out", hasBreakfast: false, hasPaid: true, notes: "" },
  ];

  for (const b of bookings) {
    await prisma.bookings.create({
      data: {
        startDate: new Date(b.startDate),
        endDate: new Date(b.endDate),
        numberOfNights: b.numberOfNights,
        numberOfGuests: b.numberOfGuests,
        cabinPrice: b.cabinPrice,
        extraPrice: b.extraPrice,
        totalPrice: b.totalPrice,
        status: b.status,
        hasBreakfast: b.hasBreakfast,
        hasPaid: b.hasPaid,
        notes: b.notes,
        cabinId: byName[b.cabin],
        guestId: guestRecords[b.guest].id,
      },
    });
  }

  console.log(
    `Seeded: ${cabinRecords.length} cabins, ${guestRecords.length} guests, ${bookings.length} bookings, 1 settings row.`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
