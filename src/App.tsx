/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';

import AdminLayout from './pages/admin/AdminLayout';
import BlogList from './pages/admin/BlogList';
import BlogEditor from './pages/admin/BlogEditor';
import { initializeStorage } from './lib/storage';

export default function App() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/blog/:id" element={<Layout><BlogPost /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/posts" replace />} />
          <Route path="posts" element={<BlogList />} />
          <Route path="posts/new" element={<BlogEditor />} />
          <Route path="posts/:id/edit" element={<BlogEditor />} />
          <Route path="settings" element={<div className="p-8 text-gray-500">Settings coming soon...</div>} />
        </Route>
      </Routes>
    </Router>
  );
}
