import { convertFileToBase64 } from "@/lib/fileToBase64";

describe("convertFileToBase64", () => {
  it("resolves with a data URL for a text file", async () => {
    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    const result = await convertFileToBase64(file);
    // FileReader.readAsDataURL produces a base64 data URL; "hello" -> aGVsbG8=
    expect(result.startsWith("data:")).toBe(true);
    expect(result).toContain("base64,");
    expect(result).toContain("aGVsbG8=");
  });

  it("rejects when the reader errors", async () => {
    const file = new File(["x"], "x.txt", { type: "text/plain" });
    const spy = jest
      .spyOn(FileReader.prototype, "readAsDataURL")
      .mockImplementation(function (this: FileReader) {
        // Defer so the handler (assigned after readAsDataURL is called) is attached.
        setTimeout(() => {
          this.onerror?.(
            new ProgressEvent("error") as ProgressEvent<FileReader>
          );
        }, 0);
      });

    await expect(convertFileToBase64(file)).rejects.toBeDefined();
    spy.mockRestore();
  });
});
