import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import type { BlogPostStatus } from "../../data/blogPosts";
import { getPostById, savePost } from "../../lib/storage";
import { useAuth } from "../../context/AuthContext";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toLocalDateTimeInput(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function toIso(value: string) {
  if (!value) return new Date().toISOString();
  return new Date(value).toISOString();
}

function estimateReadTimeFromHtml(html: string) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = text ? text.split(" ").length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isEdit = useMemo(() => Boolean(id), [id]);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const [form, setForm] = useState({
    id: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    publishedAt: toLocalDateTimeInput(new Date().toISOString()),
    readTime: "",
    author: "",
    coverImageId: "",
    status: "draft" as BlogPostStatus,
    createdBy: "",
    updatedAt: new Date().toISOString()
  });

  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      author: prev.author || user.name || user.email,
      createdBy: prev.createdBy || user.$id
    }));
  }, [user]);

  useEffect(() => {
    if (!id) return;

    let active = true;

    (async () => {
      try {
        const post = await getPostById(id);

        if (!post) {
          throw new Error("Post tidak ditemukan");
        }

        if (!active) return;

        setForm({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          publishedAt: toLocalDateTimeInput(post.publishedAt),
          readTime: post.readTime,
          author: post.author,
          coverImageId: post.coverImageId || "",
          status: post.status,
          createdBy: post.createdBy,
          updatedAt: post.updatedAt
        });

        setSlugTouched(true);
      } catch (err: any) {
        if (active) setError(err?.message || "Gagal memuat post");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value)
    }));
  }

  async function persist(status: BlogPostStatus) {
    setSaving(true);
    setError("");

    try {
      const readTime = form.readTime.trim() || estimateReadTimeFromHtml(form.content);

      await savePost({
        id: form.id || undefined,
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        publishedAt: toIso(form.publishedAt),
        readTime,
        author: form.author || user?.name || user?.email || "Admin",
        coverImageId: form.coverImageId || "",
        status,
        createdBy: form.createdBy || user?.$id || "",
        updatedAt: new Date().toISOString()
      });

      navigate("/admin/posts", { replace: true });
    } catch (err: any) {
      setError(err?.message || "Gagal menyimpan post");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await persist(form.status);
  }

  if (loading) {
    return <div className="p-8 text-gray-400">Loading editor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">
            {isEdit ? "Edit Post" : "New Post"}
          </h1>
          <p className="text-gray-500 text-sm">
            Editor rich text untuk blog post.
          </p>
        </div>

        <Link
          to="/admin/posts"
          className="rounded-xl border border-black/10 bg-white px-4 py-2"
        >
          Back
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-black/10 bg-white p-6 grid gap-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full rounded-xl bg-white border border-black/10 px-4 py-3 outline-none"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />

          <input
            type="text"
            placeholder="Slug"
            className="w-full rounded-xl bg-white border border-black/10 px-4 py-3 outline-none"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              updateField("slug", slugify(e.target.value));
            }}
          />

          <textarea
            placeholder="Excerpt"
            className="w-full rounded-xl bg-white border border-black/10 px-4 py-3 outline-none min-h-[120px]"
            value={form.excerpt}
            onChange={(e) => updateField("excerpt", e.target.value)}
          />

          <div className="rounded-2xl border border-black/10 overflow-hidden">
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={form.content}
              onEditorChange={(value) => updateField("content", value)}
              init={{
                height: 520,
                menubar: false,
                branding: false,
                promotion: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "codesample",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "preview",
                  "help",
                  "wordcount"
                ],
                toolbar:
                  "undo redo | blocks | bold italic underline inlinecode forecolor backcolor | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | blockquote link image table | " +
                  "codesample code preview fullscreen help",
                formats: {
                  inlinecode: {
                    inline: "code",
                    classes: "inline-code"
                  }
                },
                content_style: `
                  body {
                    font-family: Inter, Arial, sans-serif;
                    font-size: 16px;
                    line-height: 1.7;
                    padding: 12px;
                  }
              
                  code.inline-code {
                    background: #f3f4f6;
                    color: #111827;
                    padding: 2px 6px;
                    border-radius: 6px;
                    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
                  }
                `,
                setup: (editor) => {
                  editor.ui.registry.addToggleButton("inlinecode", {
                    icon: "sourcecode",
                    tooltip: "Inline code",
                    onAction: () => editor.formatter.toggle("inlinecode"),
                    onSetup: (api) => {
                      const handler = () => {
                        api.setActive(editor.formatter.match("inlinecode"));
                      };
                    
                      editor.on("NodeChange", handler);
                    
                      return () => editor.off("NodeChange", handler);
                    }
                  });
                }
              }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="datetime-local"
              className="w-full rounded-xl bg-white border border-black/10 px-4 py-3 outline-none"
              value={form.publishedAt}
              onChange={(e) => updateField("publishedAt", e.target.value)}
            />

            <input
              type="text"
              placeholder="Read time"
              className="w-full rounded-xl bg-white border border-black/10 px-4 py-3 outline-none"
              value={form.readTime}
              onChange={(e) => updateField("readTime", e.target.value)}
            />

            <input
              type="text"
              placeholder="Author"
              className="w-full rounded-xl bg-white border border-black/10 px-4 py-3 outline-none"
              value={form.author}
              onChange={(e) => updateField("author", e.target.value)}
            />

            <input
              type="text"
              placeholder="Cover Image ID"
              className="w-full rounded-xl bg-white border border-black/10 px-4 py-3 outline-none"
              value={form.coverImageId}
              onChange={(e) => updateField("coverImageId", e.target.value)}
            />
          </div>

          <select
            className="w-full rounded-xl bg-white border border-black/10 px-4 py-3 outline-none"
            value={form.status}
            onChange={(e) => updateField("status", e.target.value as BlogPostStatus)}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => persist("draft")}
            className="rounded-xl border border-black/10 bg-white px-5 py-3"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => persist("published")}
            className="rounded-xl bg-black text-white px-5 py-3 font-medium"
          >
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}