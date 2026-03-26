import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { getPosts } from '../lib/storage';
import { BlogPost } from '../data/blogPosts';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-16"
    >
      <header className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Writings</h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          Thoughts on security, infrastructure, and the intersection of both.
        </p>
      </header>

      <div className="space-y-12">
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link to={`/blog/${post.id}`} className="block space-y-4">
              {post.coverImage && (
                <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
                <time dateTime={post.date}>{post.date}</time>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight group-hover:text-gray-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-3xl text-lg">
                {post.excerpt}
              </p>
              <div className="text-sm font-medium text-black group-hover:underline decoration-1 underline-offset-4">
                Read more →
              </div>
            </Link>
          </motion.article>
        ))}
        {posts.length === 0 && (
          <p className="text-gray-500 text-lg">No posts available yet.</p>
        )}
      </div>
    </motion.div>
  );
}
