import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getPost, savePost } from '../../lib/storage';
import { BlogPost } from '../../data/blogPosts';

export default function BlogEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    excerpt: '',
    content: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: '5 min read',
    author: 'Arthur Wiriansyah',
    coverImage: '',
  });

  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const post = getPost(id);
      if (post) {
        setFormData({
          ...post,
          coverImage: post.coverImage || '',
        });
      } else {
        navigate('/admin/posts');
      }
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePost(isEditing ? { ...formData, id } : formData);
    navigate('/admin/posts');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/posts"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit Post' : 'New Post'}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center justify-center h-10 px-6 font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Post
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
        {/* Main Editor Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-lg font-semibold rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Post Title"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium text-gray-700">
                Content (Markdown)
              </label>
              {previewMode ? (
                <div className="prose prose-gray max-w-none p-4 min-h-[400px] border border-gray-200 rounded-xl bg-gray-50 overflow-y-auto">
                  <ReactMarkdown>{formData.content || '*No content yet...*'}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={15}
                  className="w-full px-4 py-3 font-mono text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-y"
                  placeholder="Write your post content here using Markdown..."
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-semibold text-lg border-b border-gray-100 pb-4">Post Settings</h3>
            
            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-sm font-medium text-gray-700">Excerpt</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                placeholder="Brief summary..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="coverImage" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Cover Image URL
              </label>
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="https://example.com/image.jpg"
              />
              {formData.coverImage && (
                <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
                  <img src={formData.coverImage} alt="Cover Preview" className="w-full h-32 object-cover" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium text-gray-700">Date</label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="readTime" className="text-sm font-medium text-gray-700">Read Time</label>
                <input
                  type="text"
                  id="readTime"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
