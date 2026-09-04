export function sanitizeInput(text: string): string {
  return text.trim().replace(/[<>]/g, "");
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
