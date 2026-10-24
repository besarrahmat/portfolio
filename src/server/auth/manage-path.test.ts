import { describe, expect, it } from "vitest";

import { isManagePath } from "./manage-path";

describe("isManagePath", () => {
  it("accepts the exact secret", () => {
    expect(isManagePath("s3cret-path", "s3cret-path")).toBe(true);
  });

  it.each([
    ["wrong segment", "nope", "s3cret-path"],
    ["prefix of secret", "s3cret", "s3cret-path"],
    ["case differs", "S3CRET-PATH", "s3cret-path"],
    ["secret unset", "anything", undefined],
    ["secret empty", "", ""],
  ])("rejects %s", (_, segment, secret) => {
    expect(isManagePath(segment, secret)).toBe(false);
  });
});
