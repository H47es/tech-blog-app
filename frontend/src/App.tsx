import React, { useEffect, useState, useCallback } from 'react';
import { getPosts, deletePost, type Post } from './services/api';
import { CreatePostModal } from './components/CreatePostModal';
import './App.css';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPosts = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      const data = await getPosts(query);
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, [fetchPosts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    fetchPosts(e.target.value);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await deletePost(id);
      fetchPosts(search);
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '30px 40px', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif' }}>

      {/* Top Header Row: Title pushed far left, Button pushed far right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px', width: '100%' }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '28px' }}>Tech Blog Platform</h1>
          <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '14px' }}>A full-stack web application built with Java Spring Boot and React.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', whiteSpace: 'nowrap' }}
        >
          + Create Article
        </button>
      </div>

      {/* Modal Popup Component */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={() => fetchPosts(search)}
      />

      {/* Search Bar */}
      <div style={{ marginBottom: '25px', width: '100%' }}>
        <input
          type="text"
          placeholder="Search posts by title or tags..."
          value={search}
          onChange={handleSearchChange}
          style={{ width: '100%', padding: '12px 15px', fontSize: '16px', borderRadius: '6px', border: '1px solid #555', background: '#1e1e1e', color: '#fff', boxSizing: 'border-box' }}
        />
      </div>

      {/* Posts Feed */}
      <section style={{ width: '100%' }}>
        <h3 style={{ color: '#fff', marginBottom: '15px' }}>Articles Feed</h3>
        {loading ? (
          <p style={{ color: '#aaa' }}>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p style={{ color: '#aaa' }}>No articles found.</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #333', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              <h2 style={{ margin: '0 0 10px 0', color: '#fff' }}>{post.title}</h2>
              <p style={{ color: '#ccc', lineHeight: '1.5' }}>{post.content}</p>
              {post.tags && (
                <p style={{ fontSize: '12px', color: '#4dabf7', margin: '10px 0' }}>
                  <strong>Tags:</strong> {post.tags}
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <span style={{ fontSize: '12px', color: '#888' }}>Published on: {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}</span>
                <button
                  onClick={() => handleDelete(post.id)}
                  style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

export default App;