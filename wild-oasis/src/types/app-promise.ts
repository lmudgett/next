import { ApplicationError } from "@/types/errors";

export type AppPromise = {
  success: boolean;
  appError?: ApplicationError;
};
