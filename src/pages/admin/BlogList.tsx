import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { BlogPost } from "../../data/blogPosts";
import { deletePost, getPosts } from "../../lib/storage";
import { useAuth } from "../../context/AuthContext";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export default function BlogList() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPosts() {
    setLoading(true);
    setError("");

    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleDelete(id: string) {
    const ok = window.confirm("Yakin ingin menghapus post ini?");
    if (!ok) return;

    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err: any) {
      window.alert(err?.message || "Gagal menghapus post");
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Manage Posts</h1>
          <p className="text-gray-400 text-sm">
            Logged in as {user?.email}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/posts/new"
            className="rounded-xl bg-white text-black px-4 py-2 font-medium"
          >
            New Post
          </Link>
        </div>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !posts.length && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-400">
          Belum ada post.
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
          <table className="w-full min-w-[720px]">
            <thead className="border-b border-white/10 text-left text-sm text-gray-400">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4">Published</th>
                <th className="p-4">Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-white/5">
                  <td className="p-4">
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-gray-400">{post.author}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-300">{post.slug}</td>
                  <td className="p-4">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wide">
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-300">
                    {formatDate(post.publishedAt)}
                  </td>
                  <td className="p-4 text-sm text-gray-300">
                    {formatDate(post.updatedAt)}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="rounded-lg border border-white/10 px-3 py-2 text-sm"
                      >
                        View
                      </Link>
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="rounded-lg border border-white/10 px-3 py-2 text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="rounded-lg border border-red-500/40 px-3 py-2 text-sm text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}