"use server";
import { revalidatePath } from "next/cache";
import * as cabinUC from "@/server/services/cabins";
import { cabinSchema, CabinFormData } from "@/lib/validations/cabins";
import { AppPromise } from "@/types/app-promise";
import { convertToApplicationError } from "@/types/errors";

export const getAllCabinsAction = async (): Promise<{
  success: boolean;
  cabins?: CabinFormData[];
  message?: string;
}> => {
  try {
    const { cabins } = await cabinUC.getAllCabins();
    if (!cabins) {
      return { success: true, message: "No cabins found" };
    }
    return { success: true, cabins: cabins };
  } catch (error) {
    return { success: false, message: `Unable to get cabins ${error}` };
  }
};

export const deleteCabinAction = async (id: number): Promise<AppPromise> => {
  const res = await cabinUC.deleteCabin(id);
  if (res.success) {
    revalidatePath("/cabins");
    return res;
  } else {
    return res;
  }
};

export const updateCabinAction = async (
  data: CabinFormData
): Promise<AppPromise> => {
  try {
    cabinSchema.parse(data);
    const {
      id,
      name,
      maxCapacity,
      regularPrice,
      description,
      discount,
      imageBase64,
    } = data;

    let buffer: Buffer | null = null;
    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      if (base64Data) {
        buffer = Buffer.from(base64Data, "base64");
      }
    }
    const res = await cabinUC.updateCabin(
      name,
      maxCapacity,
      regularPrice,
      discount || 0,
      description || "",
      buffer || Buffer.alloc(0),
      id || undefined
    );

    if (res.success) {
      revalidatePath("/cabins");
      return { success: true };
    } else {
      throw res.appError;
    }
  } catch (error) {
    const err = convertToApplicationError(error);
    return { success: false, appError: err };
  }
};
