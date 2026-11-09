import { describe, expect, it } from "vitest";
import { PostSchema } from "../../src/types/PostSchema";

const validDraft = {
  intro: "Today I explored TypeScript generics and practiced writing reusable functions for common application tasks while preserving clear and helpful types.",
  bullets: [
    "Generics help a function accept different input types while keeping the relationship between each input and its returned value safe for callers.",
    "I also learned that constraints can limit a generic type to values that support the operations a particular function needs.",
  ],
  takeaway: "Thoughtful type design makes reusable code easier to understand, test, and maintain.",
};

describe("PostSchema", () => {
  it("accepts a post with the required shape and word count", () => {
    expect(PostSchema.safeParse(validDraft).success).toBe(true);
  });

  it("applies link checks consistently across repeated validations", () => {
    expect(PostSchema.safeParse(validDraft).success).toBe(true);
    expect(PostSchema.safeParse({
      ...validDraft,
      takeaway: "Visit localhost:3000 for more information.",
    }).success).toBe(false);
    expect(PostSchema.safeParse(validDraft).success).toBe(true);
  });

  it.each([
    ["a URL", { ...validDraft, intro: "I learned from https://example.com today and found the documentation useful." }],
    ["a bare domain", { ...validDraft, takeaway: "More details are available at example.com for developers." }],
    ["a hashtag", { ...validDraft, bullets: ["I learned #TypeScript concepts and practiced writing reusable functions.", validDraft.bullets[1]] }],
    ["an oversized bullet", { ...validDraft, bullets: ["x".repeat(151), validDraft.bullets[1]] }],
    ["an unexpected key", { ...validDraft, extra: "not allowed" }],
  ])("rejects a post containing %s", (_description, draft) => {
    expect(PostSchema.safeParse(draft).success).toBe(false);
  });
});
