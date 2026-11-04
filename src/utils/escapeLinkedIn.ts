// Escapes special characters for LinkedIn to prevent formatting issues
export function escapeLinkedIn(text: string): string {
  return text.replace(/[\\|{}@\[\]()<>#*_~]/g, (m) => '\\' + m);
}