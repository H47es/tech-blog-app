import React, { useState } from 'react';
import { createPost } from '../services/api';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        try {
            await createPost({ title, content, tags }, 1);
            setTitle('');
            setContent('');
            setTags('');
            onPostCreated();
            onClose();
        } catch (err) {
            console.error('Failed to create post:', err);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                background: '#16171d', padding: '30px', borderRadius: '8px',
                width: '100%', maxWidth: '500px', position: 'relative', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}>
                <h3 style={{ marginTop: 0, color: '#fff' }}>Create New Article</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                        type="text"
                        placeholder="Article Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <textarea
                        placeholder="Write your article content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                        required
                        style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input
                        type="text"
                        placeholder="Tags (e.g., Java, React, Spring)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button type="submit" style={{ padding: '10px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Publish
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};