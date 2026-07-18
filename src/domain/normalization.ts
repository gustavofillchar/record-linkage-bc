export function normalizeDocument(document: string): string {
  return document.replace(/[^a-zA-Z0-9]/g, "");
}
