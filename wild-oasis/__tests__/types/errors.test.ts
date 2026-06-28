import {
  ApplicationError,
  ErrorType,
  convertToApplicationError,
} from "@/types/errors";

describe("ApplicationError", () => {
  it("defaults to GENERIC error type", () => {
    const err = new ApplicationError("boom");
    expect(err.message).toBe("boom");
    expect(err.errorType).toBe(ErrorType.GENERIC);
    expect(err.name).toBe("ApplicationError");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApplicationError);
  });

  it("retains the provided error type and original error", () => {
    const original = new Error("root cause");
    const err = new ApplicationError("wrapped", ErrorType.DATABASE, original);
    expect(err.errorType).toBe(ErrorType.DATABASE);
    expect(err.originalError).toBe(original);
  });
});

describe("convertToApplicationError", () => {
  it("returns the same instance when already an ApplicationError", () => {
    const err = new ApplicationError("already", ErrorType.VALIDATION);
    expect(convertToApplicationError(err)).toBe(err);
  });

  it("wraps a standard Error, preserving message and original", () => {
    const original = new Error("db down");
    const converted = convertToApplicationError(original, ErrorType.DATABASE);
    expect(converted).toBeInstanceOf(ApplicationError);
    expect(converted.message).toBe("db down");
    expect(converted.errorType).toBe(ErrorType.DATABASE);
    expect(converted.originalError).toBe(original);
  });

  it("produces a generic message for non-Error values", () => {
    const converted = convertToApplicationError("just a string");
    expect(converted).toBeInstanceOf(ApplicationError);
    expect(converted.message).toBe("An unknown error occurred.");
  });
});
