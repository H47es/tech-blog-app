import React from 'react';
import type { Post } from '../services/api';

interface PostDetailProps {
    post: Post;
    onBack: () => void;
    onDelete: (id?: number) => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, onDelete }) => {
    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', color: '#fff' }}>
            {/* Back Button */}
            <button
                onClick={onBack}
                style={{ background: 'transparent', color: '#4dabf7', border: '1px solid #4dabf7', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', marginBottom: '20px', fontWeight: 'bold' }}
            >
                &larr; Back to Feed
            </button>

            {/* Full Article Card */}
            <article style={{ background: '#1a1a1a', padding: '40px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                <span style={{ fontSize: '14px', color: '#e05638', fontWeight: 'bold' }}>
                    Published on: {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}
                </span>
                <h1 style={{ margin: '10px 0 20px 0', fontSize: '36px', color: '#fff' }}>{post.title}</h1>

                {post.tags && (
                    <p style={{ fontSize: '14px', color: '#4dabf7', marginBottom: '25px' }}>
                        <strong>Tags:</strong> {post.tags}
                    </p>
                )}

                <div style={{ width: '100%', height: '300px', backgroundColor: '#2a2a2a', borderRadius: '6px', overflow: 'hidden', marginBottom: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {post.imageUrl ? (
                        <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ color: '#555', fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>Tech Blog Article</span>
                    )}
                </div>

                {/* Full Untruncated Content */}
                <div style={{ color: '#ccc', lineHeight: '1.8', fontSize: '16px', whiteSpace: 'pre-wrap', marginBottom: '40px' }}>
                    {post.content}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #252525', paddingTop: '20px' }}>
                    <button
                        onClick={() => {
                            onDelete(post.id);
                            onBack();
                        }}
                        style={{ background: 'transparent', color: '#e53e3e', border: '1px solid #e53e3e', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                    >
                        Delete Article
                    </button>
                </div>
            </article>
        </div>
    );
};