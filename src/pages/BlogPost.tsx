import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import DOMPurify from "dompurify";
import type { BlogPost } from "../data/blogPosts";
import { getPostBySlug } from "../lib/storage";
import { getCoverImageUrl } from "../lib/media";

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
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-10"
      >
        <div className="rounded-3xl bg-gray-50 p-10 text-gray-500">
          Loading post...
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="rounded-3xl bg-red-50 p-10">
          <p className="text-red-500">{error}</p>
          <Link to="/blog" className="mt-4 inline-flex text-black underline">
            Back to blog
          </Link>
        </div>
      </motion.div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-10"
    >
      <section className="rounded-3xl bg-gray-50 p-8 md:p-12 space-y-8">
        <Link
          to="/blog"
          className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
        >
          ← Back to blog
        </Link>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>{formatDate(post.publishedAt)}</span>
            <span>•</span>
            <span>{post.readTime}</span>
            <span>•</span>
            <span>{post.author}</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight text-black">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="max-w-3xl text-lg md:text-xl leading-8 text-gray-600">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>

        {post.coverImageId && (
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white">
            <img
              src={getCoverImageUrl(post.coverImageId)}
              alt={post.title}
              className="w-full max-h-[460px] object-cover"
            />
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-white">
        <div
          className="article-content max-w-none"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </section>
    </motion.article>
  );
}