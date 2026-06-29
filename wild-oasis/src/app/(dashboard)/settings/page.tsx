import { Suspense, cache } from "react";
import type { Metadata } from "next";
import { FormSettings } from "@/components/settings/FormSettings";
import { getSettingsAction } from "@/server/actions/settings";
import { FormSkeleton } from "@/components/ui/Skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

// Render dynamically so the settings form streams on each request.
export const dynamic = "force-dynamic";

// Cached per request so generateMetadata and the page share a single query.
const getSettings = cache(getSettingsAction);

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSettings();
  return {
    title: "Settings",
    description: settings
      ? `Hotel settings: stays of ${settings.minBookingLength}–${settings.maxBookingLength} nights, up to ${settings.maxGuestNumberPerBooking} guests, breakfast $${settings.breakfastPrice}.`
      : "Manage hotel-wide booking settings.",
  };
}

async function SettingsContent() {
  const { success, settings, message } = await getSettings();

  if (!success) {
    return <ErrorMessage resource="settings" message={message} />;
  }

  return <FormSettings settings={settings} />;
}

export default function SettingsPage() {
  return (
    <div>
      <h1>Update Hotel Settings</h1>
      <Suspense fallback={<FormSkeleton fields={4} />}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}
