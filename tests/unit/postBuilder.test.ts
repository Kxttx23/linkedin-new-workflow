import { describe, it, expect } from "vitest";
import { buildPost } from "../../src/services/postBuilder";
import { HASHTAGS } from "../../src/config/constants";

describe("buildPost", () => {
  const validData = {
    intro: "Hello *World*",
    bullets: ["Test _this_", "Another bullet"],
    takeaway: "Done!"
  };

  // R8: buildPost വഴി escaping നടക്കുന്നുണ്ടോ എന്ന് പരിശോധിക്കുക
  it("should escape special characters through buildPost", () => {
    const result = buildPost("Header", validData);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.post).toContain("Hello \\*World\\*");
      expect(result.post).toContain("Test \\_this\\_");
    }
  });

  // R5: ഹാഷ്ടാഗുകൾ അതേപടി നിൽക്കണം
  it("should leave hashtags alone", () => {
    const result = buildPost("Header", validData);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.post).toContain(HASHTAGS);
      expect(result.post).not.toContain("\\#100DaysOfCode");
    }
  });

  // R5: 3000 അക്ഷരത്തിൽ കവിഞ്ഞാൽ റിജക്റ്റ് ചെയ്യണം
  it("should reject posts over 3000 characters", () => {
    const longData = { ...validData, intro: "a".repeat(3100) };
    const result = buildPost("Header", longData);
    expect(result.ok).toBe(false);
  });

  it("should accept a post exactly 3000 characters long", () => {
    const baseline = buildPost("Header", { ...validData, intro: "a" });
    expect(baseline.ok).toBe(true);
    if (!baseline.ok) return;

    const exactData = {
      ...validData,
      intro: "a".repeat(3001 - baseline.post.length),
    };
    const result = buildPost("Header", exactData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.post).toHaveLength(3000);
    }
  });
});