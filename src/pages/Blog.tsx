import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import type { BlogPost } from "../data/blogPosts";
import { getPublishedPosts } from "../lib/storage";
import { getCoverImageUrl } from "../lib/media";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await getPublishedPosts();
        if (active) setPosts(data);
      } catch (err: any) {
        if (active) setError(err?.message || "Failed to load posts.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto space-y-16"
      >
        <header className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Blog
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Catatan, ide, dan tulisan terbaru.
          </p>
        </header>

        <div className="rounded-3xl bg-gray-50 p-8 text-gray-500">
          Loading posts...
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
        className="max-w-3xl mx-auto space-y-16"
      >
        <header className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Blog
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Catatan, ide, dan tulisan terbaru.
          </p>
        </header>

        <div className="rounded-3xl bg-red-50 p-8 text-red-500">
          {error}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-16"
    >
      <header className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
          Blog
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          Catatan, ide, dan tulisan terbaru.
        </p>
      </header>

      {!posts.length ? (
        <div className="rounded-3xl bg-gray-50 p-8 text-gray-500">
          Belum ada post yang dipublish.
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-3xl bg-gray-50 overflow-hidden hover:bg-gray-100/80 transition-colors"
            >
              {post.coverImageId && (
                <div className="overflow-hidden">
                  <img
                    src={getCoverImageUrl(post.coverImageId)}
                    alt={post.title}
                    className="w-full h-[260px] object-cover"
                  />
                </div>
              )}

              <div className="p-8 space-y-5">
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {post.title}
                  </h2>
                  <p className="text-lg text-gray-500 leading-8">
                    {post.excerpt}
                  </p>
                </div>

                <div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </motion.div>
  );
}