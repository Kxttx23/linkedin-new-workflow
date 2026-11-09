import { describe, it, expect } from "vitest";
import { escapeLinkedIn } from "../../src/services/postBuilder"; // പാത്ത് ശ്രദ്ധിക്കുക

describe("escapeLinkedIn", () => {
  it("should escape special characters", () => {
    expect(escapeLinkedIn("Hello *World*")).toBe("Hello \\*World\\*");
  });
});