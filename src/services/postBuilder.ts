import { HASHTAGS } from "../config/constants";

export function escapeLinkedIn(text: string) {
  return text.replace(/([\\*_{}\[\]()#+\-.!])/g, "\\$1");
}

export function buildPost(
  header: string,
  data: { intro: string; bullets: string[]; takeaway: string },
  codeLink?: string
) {
  const intro = escapeLinkedIn(data.intro);
  const bullets = data.bullets.map(b => `• ${escapeLinkedIn(b)}`).join("\n");
  const takeaway = escapeLinkedIn(data.takeaway);
  
  let finalPost = `${header}\n\n${intro}\n\n${bullets}\n\n${takeaway}`;
  
  if (codeLink && codeLink.trim() !== "") {
    finalPost += `\n\nCode: ${codeLink}`;
  }
  
  finalPost += `\n\n${HASHTAGS}`;

  if (finalPost.length > 3000) {
    return { ok: false, reason: "Post exceeds 3000 characters" };
  }
  
  return { ok: true, post: finalPost };
}