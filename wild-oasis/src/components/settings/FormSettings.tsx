"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/FormField";
import { SettingsFormData, settingsSchema } from "@/lib/validations/settings";
import { updateSettingsAction } from "@/server/actions/settings";

// The schema coerces string inputs to numbers, so the form's input type
// (raw fields) differs from the validated output type (SettingsFormData).
type SettingsFormInput = z.input<typeof settingsSchema>;

type FormSettingProps = {
  settings?: SettingsFormData;
};

export const FormSettings = ({ settings }: FormSettingProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SettingsFormInput, unknown, SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    mode: "onBlur",
    defaultValues: settings ?? {},
  });

  const onSubmit = async (data: SettingsFormData) => {
    const res = await updateSettingsAction({
      id: data.id,
      breakfastPrice: data.breakfastPrice,
      maxBookingLength: data.maxBookingLength,
      minBookingLength: data.minBookingLength,
      maxGuestNumberPerBooking: data.maxGuestNumberPerBooking,
    });

    if (res.success) {
      toast.success("Settings have been updated");
    } else {
      toast.error(
        `Unable able to update settings due to ${res.appError?.message}`
      );
    }
  };

  const handleBlur =
    (field: keyof SettingsFormInput, fieldName: string) =>
    (e: React.FocusEvent<HTMLInputElement>) => {
      //TODO: find a way to use the zod validate instead of this 2nd check to make sure what was entered is a number
      if (isNaN(parseInt(e.target.value))) {
        toast.error(`${fieldName} is not a number`);
      } else {
        const value = Number(e.target.value);
        setValue(field, value, { shouldValidate: true });
        handleSubmit(onSubmit)(); // Submit form on blur
      }
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Min Booking Length"
        id="minBookingLength"
        type="number"
        register={register}
        onBlur={handleBlur("minBookingLength", "Min Booking Length")}
        error={errors.minBookingLength}
      />
      <FormField
        label="Max Booking Length"
        id="maxBookingLength"
        type="number"
        register={register}
        onBlur={handleBlur("maxBookingLength", "Max Booking Length")}
        error={errors.maxBookingLength}
      />
      <FormField
        label="Max Guests per Booking"
        id="maxGuestNumberPerBooking"
        type="number"
        register={register}
        onBlur={handleBlur(
          "maxGuestNumberPerBooking",
          "Max Guests per Booking"
        )}
        error={errors.maxGuestNumberPerBooking}
      />
      <FormField
        label="Breakfast Price"
        id="breakfastPrice"
        type="number"
        register={register}
        onBlur={handleBlur("breakfastPrice", "Breakfast Price")}
        error={errors.breakfastPrice}
      />
    </form>
  );
};
