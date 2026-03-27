import type {
  BlogPost,
  BlogPostStatus,
  SaveBlogPostInput
} from "../data/blogPosts";
import type { Models } from "appwrite";
import { account, ID, Permission, Query, Role, tablesDB } from "./appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const POSTS_TABLE_ID = import.meta.env.VITE_APPWRITE_POSTS_TABLE_ID;
const ADMIN_TEAM_ID = import.meta.env.VITE_APPWRITE_ADMIN_TEAM_ID?.trim() || "";

if (!DATABASE_ID) {
  throw new Error("Missing VITE_APPWRITE_DATABASE_ID");
}

if (!POSTS_TABLE_ID) {
  throw new Error("Missing VITE_APPWRITE_POSTS_TABLE_ID");
}

interface PostRow extends Models.Row {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readTime: string;
  author: string;
  coverImageId?: string | null;
  status: BlogPostStatus;
  createdBy: string;
  updatedAt: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeIsoDate(value?: string) {
  if (!value) return new Date().toISOString();
  return new Date(value).toISOString();
}

function sortPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.publishedAt).getTime();
    const bTime = new Date(b.updatedAt || b.publishedAt).getTime();
    return bTime - aTime;
  });
}

function rowToPost(row: PostRow): BlogPost {
  return {
    id: row.$id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    publishedAt: row.publishedAt,
    readTime: row.readTime,
    author: row.author,
    coverImageId: row.coverImageId || undefined,
    status: row.status,
    createdBy: row.createdBy,
    updatedAt: row.updatedAt
  };
}

function buildRowPermissions(ownerId: string, status: BlogPostStatus) {
  const managerRole = ADMIN_TEAM_ID
    ? Role.team(ADMIN_TEAM_ID)
    : Role.user(ownerId);

  return [
    status === "published"
      ? Permission.read(Role.any())
      : Permission.read(managerRole),
    Permission.update(managerRole),
    Permission.delete(managerRole)
  ];
}

export async function getPosts(): Promise<BlogPost[]> {
  const result = await tablesDB.listRows<PostRow>({
    databaseId: DATABASE_ID,
    tableId: POSTS_TABLE_ID,
    queries: [Query.limit(200)]
  });

  return sortPosts(result.rows.map(rowToPost));
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const result = await tablesDB.listRows<PostRow>({
    databaseId: DATABASE_ID,
    tableId: POSTS_TABLE_ID,
    queries: [Query.equal("status", ["published"]), Query.limit(200)]
  });

  return sortPosts(result.rows.map(rowToPost));
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  try {
    const row = await tablesDB.getRow<PostRow>({
      databaseId: DATABASE_ID,
      tableId: POSTS_TABLE_ID,
      rowId: id
    });

    return rowToPost(row);
  } catch (error: any) {
    if (error?.code === 404) return undefined;
    throw error;
  }
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  const result = await tablesDB.listRows<PostRow>({
    databaseId: DATABASE_ID,
    tableId: POSTS_TABLE_ID,
    queries: [
      Query.equal("slug", [slug]),
      Query.equal("status", ["published"]),
      Query.limit(1)
    ]
  });

  const row = result.rows[0];
  return row ? rowToPost(row) : undefined;
}

export async function savePost(
  input: SaveBlogPostInput
): Promise<BlogPost> {
  const me = await account.get();

  const slug = slugify(input.slug || input.title);
  const status = input.status ?? "draft";
  const ownerId = input.createdBy || me.$id;

  const data = {
    title: input.title.trim(),
    slug,
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    publishedAt: normalizeIsoDate(input.publishedAt),
    readTime: input.readTime.trim(),
    author: input.author.trim(),
    coverImageId: input.coverImageId?.trim() || "",
    status,
    createdBy: ownerId,
    updatedAt: normalizeIsoDate(input.updatedAt)
  };

  const permissions = buildRowPermissions(ownerId, status);

  if (input.id) {
    const updated = await tablesDB.updateRow<PostRow>({
      databaseId: DATABASE_ID,
      tableId: POSTS_TABLE_ID,
      rowId: input.id,
      data,
      permissions
    });

    return rowToPost(updated);
  }

  const created = await tablesDB.createRow<PostRow>({
    databaseId: DATABASE_ID,
    tableId: POSTS_TABLE_ID,
    rowId: ID.unique(),
    data,
    permissions
  });

return rowToPost(created);
}

export async function deletePost(id: string): Promise<void> {
  await tablesDB.deleteRow({
    databaseId: DATABASE_ID,
    tableId: POSTS_TABLE_ID,
    rowId: id
  });
}