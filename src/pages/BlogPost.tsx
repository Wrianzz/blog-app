import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import type { BlogPost } from "../data/blogPosts";
import { getPostBySlug } from "../lib/storage";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        if (!slug) {
          throw new Error("Slug tidak ditemukan");
        }

        const data = await getPostBySlug(slug);

        if (!data) {
          throw new Error("Post tidak ditemukan");
        }

        if (active) setPost(data);
      } catch (err: any) {
        if (active) setError(err?.message || "Gagal memuat post");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [slug]);

  const safeHtml = useMemo(() => {
    return DOMPurify.sanitize(post?.content || "");
  }, [post]);

  if (loading) {
    return <div className="py-20 text-gray-400">Loading post...</div>;
  }

  if (error) {
    return (
      <div className="py-20 space-y-4">
        <p className="text-red-400">{error}</p>
        <Link to="/blog" className="text-white underline">
          Back to blog
        </Link>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <article className="py-12 max-w-3xl mx-auto">
      <Link to="/blog" className="text-sm text-gray-400 hover:text-white">
        ← Back to blog
      </Link>

      <header className="mt-6 mb-10 space-y-4">
        <div className="flex flex-wrap gap-3 text-sm text-gray-400">
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{post.readTime}</span>
          <span>•</span>
          <span>{post.author}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold">{post.title}</h1>
        <p className="text-lg text-gray-300">{post.excerpt}</p>
      </header>

      <div
        className="article-content max-w-none"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </article>
  );
}