import { z } from "zod";

const linkOrHashtagPattern =
  /(?:\b[a-z][a-z\d+.-]*:\/\/|\bwww\.)\S+|\b(?:localhost|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:\/\S*)?|\b(?:[a-z\d](?:[a-z\d-]*[a-z\d])?\.)+[a-z]{2,}(?:\/\S*)?|\[[^\]]+\]\([^)]+\)|#[\p{L}\p{N}_]+/iu;

const noLinksOrHashtags = (text: string) => !linkOrHashtagPattern.test(text);

export const PostSchema = z.object({
  intro: z.string()
    .min(10, { message: "Intro must be at least 10 characters" })
    .max(200, { message: "Intro must be at most 200 characters" })
    .refine(noLinksOrHashtags, { message: "Links and hashtags are not allowed" }),
  bullets: z.array(
    z.string()
      .min(5, { message: "Bullet must be at least 5 characters" })
      .max(150, { message: "Bullet must be at most 150 characters" })
      .refine(noLinksOrHashtags, { message: "Links and hashtags are not allowed" })
  )
    .min(2, { message: "Must have at least 2 bullets" })
    .max(4, { message: "Must have at most 4 bullets" }),
  takeaway: z.string()
    .min(5, { message: "Takeaway must be at least 5 characters" })
    .max(150, { message: "Takeaway must be at most 150 characters" })
    .refine(noLinksOrHashtags, { message: "Links and hashtags are not allowed" }),
}).strict().refine((data) => {
  const fullText = `${data.intro} ${data.bullets.join(" ")} ${data.takeaway}`;
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;
  return wordCount >= 60 && wordCount <= 130;
}, {
  message: "Total word count must be between 60 and 130",
});
