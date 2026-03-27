export type BlogPostStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readTime: string;
  author: string;
  coverImageId?: string;
  status: BlogPostStatus;
  createdBy: string;
  updatedAt: string;
}

export type SaveBlogPostInput = Omit<BlogPost, "id"> & { id?: string };