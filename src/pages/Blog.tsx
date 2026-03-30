import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        if (active) setError(err?.message || "Gagal memuat post");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <div className="py-20 text-gray-400">Loading posts...</div>;
  }

  if (error) {
    return <div className="py-20 text-red-400">{error}</div>;
  }

  if (!posts.length) {
    return <div className="py-20 text-gray-400">Belum ada post yang dipublish.</div>;
  }

  return (
    <section className="py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold">Blog</h1>
        <p className="text-gray-400">
          Catatan, ide, dan tulisan terbaru.
        </p>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
              <span>{formatDate(post.publishedAt)}</span>
              <span>•</span>
              <span>{post.readTime}</span>
              <span>•</span>
              <span>{post.author}</span>
            </div>
            {post.coverImageId && (
              <div className="mb-5 overflow-hidden rounded-2xl border border-black/10">
                <img
                  src={getCoverImageUrl(post.coverImageId)}
                  alt={post.title}
                  className="w-full h-[240px] object-cover"
                />
              </div>
            )}
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-300 mb-4">{post.excerpt}</p>

            <Link
              to={`/blog/${post.slug}`}
              className="inline-flex rounded-xl bg-white text-black px-4 py-2 font-medium"
            >
              Read more
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}