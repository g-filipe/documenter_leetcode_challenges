import sanitizeFilename from "sanitize-filename";

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function sanitizeFolderName (folderName) {
  return sanitizeFilename(folderName, {
    replacement: "_",
  })
    .replaceAll(" ", "_")
    .replaceAll(/[,!\-#.'"()]/g, "_")
    .replaceAll(/_+/g, "_")
    .replace(/_$/, "");
}