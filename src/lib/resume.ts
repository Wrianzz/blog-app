import { storage } from "./appwrite";

const bucketId = import.meta.env.VITE_APPWRITE_RESUME_BUCKET_ID;
const fileId = import.meta.env.VITE_APPWRITE_RESUME_FILE_ID;

if (!bucketId) {
  throw new Error("Missing VITE_APPWRITE_RESUME_BUCKET_ID");
}

if (!fileId) {
  throw new Error("Missing VITE_APPWRITE_RESUME_FILE_ID");
}

export function getResumeDownloadUrl() {
  return String(
    storage.getFileDownload({
      bucketId,
      fileId
    })
  );
}