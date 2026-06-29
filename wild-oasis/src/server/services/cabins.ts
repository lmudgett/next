import * as cabinDao from "@/server/data/cabins";
import { AppPromise } from "@/types/app-promise";
import { CabinFormData } from "@/lib/validations/cabins";
import { convertToApplicationError, ErrorType } from "@/types/errors";

/**
 * get all cabins
 * @returns - true if successful with cabin list results or false with a message
 */
export async function getAllCabins(): Promise<{
  success: boolean;
  cabins?: CabinFormData[];
  message?: string;
}> {
  try {
    const cabins = await cabinDao.getAllCabins();

    const cabinFormDataList: CabinFormData[] = cabins.map((c) => {
      let imageBase64 = "";
      if (c.image) {
        const buffer = Buffer.from(c.image);
        if (buffer.length > 0) {
          //have to do this check since we add a empty buffer when no image is uploaded
          imageBase64 = `data:image/jpeg;base64,${buffer.toString("base64")}`;
        }
      }
      return {
        id: c.id,
        name: c.name,
        maxCapacity: c.maxCapacity,
        regularPrice: c.regularPrice,
        discount: c.discount,
        description: c.description,
        imageBase64: imageBase64,
      };
    });
    return { success: true, cabins: cabinFormDataList };
  } catch (error) {
    const appErr = convertToApplicationError(error, ErrorType.DATABASE);
    return { success: false, message: appErr.message };
  }
}

/**
 * add a cabin to the application
 *
 * @param name - name of the cabin
 * @param maxCapacity - max capacity of the cabin
 * @param regularPrice - price
 * @param discount - discount on the price
 * @param description - description of the cabin
 * @param image - image of the cabin
 * @returns - true if successful or false with an application error when adding
 */
export async function addCabin(
  name: string,
  maxCapacity: number,
  regularPrice: number,
  discount: number,
  description: string,
  image: Buffer
): Promise<AppPromise> {
  const res = await cabinDao.addCabin({
    name,
    maxCapacity,
    regularPrice,
    discount,
    description,
    // Prisma 7 types Bytes as Uint8Array<ArrayBuffer>; normalize from Buffer.
    image: Uint8Array.from(image),
  });

  return res;
}

/**
 * update cabin in the application
 *
 * @param name - name of the cabin
 * @param maxCapacity - max capacity of the cabin
 * @param regularPrice - price
 * @param discount - discount on the price
 * @param description - description of the cabin
 * @param image - image of the cabin
 * @param id - id of the cabin. if the id is undefined it will cause an add if defined it will cause an update
 * @returns - true if successful or false with an application error when updating or adding
 */
export async function updateCabin(
  name: string,
  maxCapacity: number,
  regularPrice: number,
  discount: number,
  description: string,
  image: Buffer,
  id?: number
): Promise<AppPromise> {
  let res: AppPromise;
  if (id) {
    res = await cabinDao.updateCabin(id, {
      name,
      maxCapacity,
      regularPrice,
      discount,
      description,
      // Prisma 7 types Bytes as Uint8Array<ArrayBuffer>; normalize from Buffer.
      image: Uint8Array.from(image),
    });
  } else {
    res = await cabinDao.addCabin({
      name,
      maxCapacity,
      regularPrice,
      discount,
      description,
      // Prisma 7 types Bytes as Uint8Array<ArrayBuffer>; normalize from Buffer.
      image: Uint8Array.from(image),
    });
  }
  return res;
}

/**
 * delete a cabin from the application
 *
 * @param id - id of the cabin to delete
 * @returns - true if successful or false with an application error when deleting
 */
export async function deleteCabin(id: number): Promise<AppPromise> {
  const res = await cabinDao.deleteCabin(id);
  if (res.success) {
    return { success: true };
  } else {
    return { success: false, appError: res.appError };
  }
}
