import { describe, it, expect } from "vitest";
import { escapeLinkedIn } from "../../src/services/postBuilder";

describe("escapeLinkedIn", () => {
  it("should escape special characters", () => {
    expect(escapeLinkedIn("Hello *World*")).toBe("Hello \\*World\\*");
  });
});