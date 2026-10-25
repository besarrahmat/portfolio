import { describe, expect, it } from "vitest";
import { formatAccept } from "./file-upload";

describe("formatAccept", () => {
  it("names file types the way people say them, not as MIME types", () => {
    expect(formatAccept("application/pdf")).toBe("PDF");
    expect(formatAccept("image/webp")).toBe("WEBP");
    expect(formatAccept("image/webp, image/png")).toBe("WEBP, PNG");
    expect(formatAccept("image/*")).toBe("Images");
  });
});
