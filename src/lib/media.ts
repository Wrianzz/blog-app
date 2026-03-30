import { account, ID, Permission, Role, storage } from "./appwrite";

const bucketId = import.meta.env.VITE_APPWRITE_BLOG_IMAGES_BUCKET_ID;
const adminTeamId = import.meta.env.VITE_APPWRITE_ADMIN_TEAM_ID?.trim() || "";

if (!bucketId) {
  throw new Error("Missing VITE_APPWRITE_BLOG_IMAGES_BUCKET_ID");
}

function buildFilePermissions(userId: string) {
  if (adminTeamId) {
    return [
      Permission.read(Role.any()),
      Permission.update(Role.team(adminTeamId)),
      Permission.delete(Role.team(adminTeamId))
    ];
  }

  return [
    Permission.read(Role.any()),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId))
  ];
}

export async function uploadCoverImage(file: File) {
  const me = await account.get();

  const uploaded = await storage.createFile({
    bucketId,
    fileId: ID.unique(),
    file,
    permissions: buildFilePermissions(me.$id)
  });

  return uploaded;
}

export async function deleteCoverImage(fileId: string) {
  await storage.deleteFile({
    bucketId,
    fileId
  });
}

export function getCoverImageUrl(fileId?: string) {
  if (!fileId) return "";
  return String(
    storage.getFileView({
      bucketId,
      fileId
    })
  );
}