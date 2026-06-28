// Client-only: depends on the browser FileReader API, so it lives in the
// presentation layer (Q4) — not in the framework-agnostic domain core.
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to Base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
