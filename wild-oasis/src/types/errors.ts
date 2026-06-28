export enum ErrorType {
  VALIDATION = "VALIDATION",
  DATABASE = "DATABASE",
  NETWORK = "NETWORK",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  NOT_FOUND = "NOT_FOUND",
  UNKNOWN = "UNKNOWN",
  GENERIC = "GENERIC",
}

export class ApplicationError extends Error {
  public originalError?: Error;
  public errorType: ErrorType;

  constructor(
    message: string,
    errorType: ErrorType = ErrorType.GENERIC,
    originalError?: Error
  ) {
    super(message);
    this.name = "ApplicationError";
    this.errorType = errorType;
    this.originalError = originalError;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function convertToApplicationError(
  error: unknown,
  errorType: ErrorType = ErrorType.GENERIC
): ApplicationError {
  if (error instanceof ApplicationError) {
    return error;
  }
  if (error instanceof Error) {
    //convert standard error to app error
    return new ApplicationError(error.message, errorType, error);
  }
  return new ApplicationError("An unknown error occurred.", errorType);
}
