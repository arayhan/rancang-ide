/** Trigger a client-side file download of text content. */
export function downloadText(
  filename: string,
  text: string,
  mime = "text/markdown",
): void {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
