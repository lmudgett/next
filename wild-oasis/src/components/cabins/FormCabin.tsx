"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { convertFileToBase64 } from "@/lib/fileToBase64";
import { cabinSchema, CabinFormData } from "@/lib/validations/cabins";
import { updateCabinAction } from "@/server/actions/cabins";

type FormCabinProps = {
  cabin?: CabinFormData;
  isEdit: boolean;
  onClose?: () => void;
  className?: string;
  onFormEvent?: () => void;
};

export const FormCabin = ({
  cabin,
  isEdit,
  onClose,
  onFormEvent,
  className = "form-regular",
}: FormCabinProps) => {
  const router = useRouter();
  // Used both as a modal (edit, with onClose) and as a page (create, no onClose).
  const close = onClose ?? (() => router.push("/cabins"));
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CabinFormData>({
    resolver: zodResolver(cabinSchema),
    defaultValues: cabin ?? {},
  });

  const onSubmit = async (data: CabinFormData) => {
    let base64String = "";

    //convert the uploaded image to base64
    if (data.image && data.image[0]) {
      base64String = await convertFileToBase64(data.image[0]);
    }

    //use the original image if it exists
    if (base64String === "" && cabin?.imageBase64) {
      base64String = cabin?.imageBase64;
    }

    const res = await updateCabinAction({
      id: data.id,
      name: data.name,
      maxCapacity: data.maxCapacity,
      regularPrice: data.regularPrice,
      description: data.description,
      discount: data.discount,
      imageBase64: base64String,
    });

    if (isEdit) {
      if (res.success) {
        toast.success("Cabin has been updated");
        onClose?.();
        onFormEvent?.();
      } else {
        toast.error("Unable to update cabin");
      }
    } else {
      if (res.success) {
        toast.success("Cabin has been added");
        reset();
        close();
      } else {
        toast.error("Unable to add cabin");
      }
    }
  };

  return (
    <form className={className} onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Cabin Name"
        id="name"
        type="text"
        register={register}
        error={errors.name}
      />
      <FormField
        label="Maximum capacity"
        id="maxCapacity"
        type="number"
        register={register}
        error={errors.maxCapacity}
      />
      <FormField
        label="Regular price"
        id="regularPrice"
        register={register}
        type="number"
        error={errors.regularPrice}
      />
      <FormField
        label="Discount price"
        id="discount"
        register={register}
        type="number"
        error={errors.discount}
      />
      <FormField
        label="Description"
        id="description"
        register={register}
        type="text"
        error={errors.description}
      />
      <FormField label="Picture" id="image" register={register} type="file" />
      <div className="form-row">
        {cabin && <input type="hidden" {...register("id")} />}
        <Button
          variant="secondary"
          onClick={() => {
            close();
            onFormEvent?.();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Cabin"}
        </Button>
      </div>
    </form>
  );
};
