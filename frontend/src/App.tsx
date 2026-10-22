import { useEffect, useState, useCallback } from 'react';
import { getPosts, deletePost, type Post } from './services/api';
import { CreatePostModal } from './components/CreatePostModal';
import { PostDetail } from './components/PostDetail';

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchPosts = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPosts(query);
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Unable to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, [fetchPosts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    fetchPosts(query);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;

    // Prompt the user for confirmation before proceeding
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      setError(null);
      await deletePost(id);
      fetchPosts(search);
      if (selectedPost?.id === id) {
        setSelectedPost(null);
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError('Failed to delete the article.');
    }
  };

  if (selectedPost) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
        <nav style={{ padding: '20px 40px', borderBottom: '1px solid #222', backgroundColor: '#1a1a1a' }}>
          <h2 style={{ margin: 0, fontSize: '22px', color: '#fff' }}>TECH BLOG</h2>
        </nav>
        <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} onDelete={handleDelete} />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' }}>

      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #222', backgroundColor: '#1a1a1a' }}>
        <h2 style={{ margin: 0, fontSize: '22px', color: '#fff' }}>TECH BLOG</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ background: '#e05638', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Create Article
        </button>
      </nav>

      {/* Error Banner */}
      {error && (
        <div style={{ backgroundColor: '#e53e3e', color: 'white', padding: '12px 20px', textAlign: 'center', fontWeight: 'bold' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1f3b4d 0%, #111e28 100%)', padding: '60px 40px', borderBottom: '1px solid #333', textAlign: 'left' }}>
        <h1 style={{ margin: 0, fontSize: '48px', color: '#fff' }}>BLOG</h1>
        <p style={{ margin: '10px 0 0 0', color: '#a0aec0', fontSize: '16px' }}>Discover the latest insights, tutorials, and tech articles.</p>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>

        {/* Search Input */}
        <div style={{ marginBottom: '35px' }}>
          <input
            type="text"
            placeholder="Search articles by title or tags..."
            value={search}
            onChange={handleSearchChange}
            style={{ width: '100%', padding: '14px 18px', fontSize: '16px', borderRadius: '6px', border: '1px solid #444', background: '#1e1e1e', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        {/* Modal */}
        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPostCreated={() => fetchPosts(search)}
        />

        {/* Feed Section */}
        <section>
          {loading ? (
            <p style={{ color: '#888', textAlign: 'center' }}>Loading articles...</p>
          ) : posts.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>No articles found.</p>
          ) : (
            posts.map((post) => {
              const summaryContent = post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content;

              return (
                <article key={post.id} style={{ display: 'flex', gap: '30px', background: '#1a1a1a', padding: '25px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #2a2a2a', alignItems: 'flex-start' }}>

                  {/* Thumbnail */}
                  <div style={{ width: '180px', height: '140px', backgroundColor: '#2a2a2a', borderRadius: '6px', overflow: 'hidden', flexShrink: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: '#555', fontSize: '12px', fontWeight: 'bold' }}>TECH BLOG</span>
                    )}
                  </div>

                  {/* Content Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#e05638', fontWeight: 'bold' }}>
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                      <h2 style={{ margin: '6px 0 10px 0', color: '#fff', fontSize: '22px' }}>{post.title}</h2>
                      <p style={{ color: '#aaa', lineHeight: '1.6', fontSize: '14px', margin: '0 0 12px 0' }}>{summaryContent}</p>

                      {post.tags && (
                        <p style={{ fontSize: '12px', color: '#4dabf7', margin: '0 0 15px 0' }}>
                          <strong>Tags:</strong> {post.tags}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #252525', paddingTop: '15px' }}>
                      <button
                        onClick={() => setSelectedPost(post)}
                        style={{ background: '#e05638', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}
                      >
                        Read More
                      </button>

                      <button
                        onClick={() => handleDelete(post.id)}
                        style={{ background: 'transparent', color: '#e53e3e', border: '1px solid #e53e3e', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}