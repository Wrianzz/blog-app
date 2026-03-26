import { v4 as uuidv4 } from 'uuid';
import { BlogPost, blogPosts as initialPosts } from '../data/blogPosts';

const STORAGE_KEY = 'minimalist_blog_posts';

// Initialize storage with default posts if empty
export const initializeStorage = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPosts));
  }
};

export const getPosts = (): BlogPost[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getPost = (id: string): BlogPost | undefined => {
  const posts = getPosts();
  return posts.find(p => p.id === id);
};

export const savePost = (post: Omit<BlogPost, 'id'> & { id?: string }): BlogPost => {
  const posts = getPosts();
  
  if (post.id) {
    // Update existing
    const index = posts.findIndex(p => p.id === post.id);
    if (index !== -1) {
      posts[index] = post as BlogPost;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
      return posts[index];
    }
  }
  
  // Create new
  const newPost: BlogPost = {
    ...post,
    id: uuidv4(),
  };
  
  posts.unshift(newPost); // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return newPost;
};

export const deletePost = (id: string): void => {
  const posts = getPosts();
  const filtered = posts.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
