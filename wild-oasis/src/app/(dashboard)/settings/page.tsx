import { FormSettings } from "@/components/settings/FormSettings";
import { getSettingsAction } from "@/server/actions/settings";

export default async function SettingsPage() {
  const { success, settings, message } = await getSettingsAction();

  if (!success) {
    return (
      <p>
        Sorry there was a problem with listing the setting, please contact the
        admin with these details:<pre>{message}</pre>
      </p>
    );
  }

  return (
    <div>
      <h1>Update Hotel Settings</h1>
      <FormSettings settings={settings} />
    </div>
  );
}
