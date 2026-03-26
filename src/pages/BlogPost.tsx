import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getPost } from '../lib/storage';
import { BlogPost as BlogPostType } from '../data/blogPosts';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundPost = getPost(id);
      setPost(foundPost || null);
    }
    setLoading(false);
  }, [id]);

  if (loading) return null;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-12"
    >
      <Link
        to="/blog"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Blog
      </Link>

      <header className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 font-mono border-b border-gray-100 pb-8">
          <time dateTime={post.date}>{post.date}</time>
          <span>·</span>
          <span>{post.readTime}</span>
          <span>·</span>
          <span>{post.author}</span>
        </div>
      </header>

      {post.coverImage && (
        <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-12">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose prose-lg prose-gray max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <footer className="border-t border-gray-100 pt-12 mt-24">
        <div className="bg-gray-50 rounded-2xl p-8 flex items-center gap-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-bold text-gray-500">
            AW
          </div>
          <div>
            <h4 className="font-semibold text-lg">Fathur Wiriansyah</h4>
            <p className="text-gray-500 text-sm mt-1">
              DevOps Engineer & Security Engineer. Writing about security, infrastructure, and the future of the world.
            </p>
          </div>
        </div>
      </footer>
    </motion.article>
  );
}

