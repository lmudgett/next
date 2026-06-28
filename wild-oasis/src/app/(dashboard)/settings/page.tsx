import { Suspense } from "react";
import { FormSettings } from "@/components/settings/FormSettings";
import { getSettingsAction } from "@/server/actions/settings";
import { FormSkeleton } from "@/components/ui/Skeleton";

// Render dynamically so the settings form streams on each request.
export const dynamic = "force-dynamic";

async function SettingsContent() {
  const { success, settings, message } = await getSettingsAction();

  if (!success) {
    return (
      <p>
        Sorry there was a problem with listing the setting, please contact the
        admin with these details:<pre>{message}</pre>
      </p>
    );
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
