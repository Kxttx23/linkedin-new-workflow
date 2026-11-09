import { beforeEach, describe, expect, it, vi } from "vitest";
import { draftPost } from "../../src/services/geminiService";

const { generateContent } = vi.hoisted(() => ({
  generateContent: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: vi.fn().mockImplementation(function () {
    return { models: { generateContent } };
  }),
}));

vi.mock("../../src/config/env", () => ({
  GEMINI_API_KEY: "test-key",
}));

const validDraft = {
  intro: "Today I explored TypeScript generics and practiced writing reusable functions for common application tasks while preserving clear and helpful types.",
  bullets: [
    "Generics help a function accept different input types while keeping the relationship between each input and its returned value safe for callers.",
    "I also learned that constraints can limit a generic type to values that support the operations a particular function needs.",
  ],
  takeaway: "Thoughtful type design makes reusable code easier to understand, test, and maintain.",
};

const response = (value: unknown) => ({ text: JSON.stringify(value) });

describe("draftPost", () => {
  beforeEach(() => {
    generateContent.mockReset();
  });

  it("does not call Gemini for empty notes", async () => {
    const result = await draftPost("   ");

    expect(result).toEqual({
      ok: false,
      reason: "Notes must be a non-empty string",
      attempts: 0,
    });
    expect(generateContent).not.toHaveBeenCalled();
  });

  it("returns a valid draft from the first attempt", async () => {
    generateContent.mockResolvedValueOnce(response(validDraft));

    const result = await draftPost("Some notes about coding.");

    expect(result).toEqual({ ok: true, data: validDraft, attempts: 1 });
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  it("sends the Zod validation error in the retry prompt", async () => {
    generateContent
      .mockResolvedValueOnce(response({ ...validDraft, intro: `${validDraft.intro} #coding` }))
      .mockResolvedValueOnce(response(validDraft));

    const result = await draftPost("Some notes about coding.");

    expect(result).toEqual({ ok: true, data: validDraft, attempts: 2 });
    expect(generateContent).toHaveBeenCalledTimes(2);
    expect(generateContent.mock.calls[1][0].contents).toContain(
      "intro: Links and hashtags are not allowed",
    );
  });

  it("retries invalid JSON once and returns a clear failure if it remains invalid", async () => {
    generateContent
      .mockResolvedValueOnce({ text: "not JSON" })
      .mockResolvedValueOnce({ text: "still not JSON" });

    const result = await draftPost("Some notes about coding.");

    expect(result).toMatchObject({
      ok: false,
      reason: "Gemini returned invalid JSON after two attempts",
      attempts: 2,
    });
    expect(generateContent).toHaveBeenCalledTimes(2);
    expect(generateContent.mock.calls[1][0].contents).toContain("previous response was invalid JSON");
  });

  it("returns a clear failure when both generated drafts fail schema validation", async () => {
    const invalidDraft = { ...validDraft, intro: `${validDraft.intro} #coding` };
    generateContent
      .mockResolvedValueOnce(response(invalidDraft))
      .mockResolvedValueOnce(response(invalidDraft));

    const result = await draftPost("Some notes about coding.");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain("failed schema validation after two attempts");
      expect(result.attempts).toBe(2);
    }
    expect(generateContent).toHaveBeenCalledTimes(2);
  });

  it("returns failure instead of throwing when Gemini requests fail", async () => {
    generateContent.mockRejectedValue(new Error("API unavailable"));

    const result = await draftPost("Some notes about coding.");

    expect(result).toMatchObject({
      ok: false,
      reason: "Gemini generation failed after two attempts: API unavailable",
      attempts: 2,
    });
    expect(generateContent).toHaveBeenCalledTimes(2);
  });
});
