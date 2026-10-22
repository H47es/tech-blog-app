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
    const [imageUrl, setImageUrl] = useState('');

    if (!isOpen) return null;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        try {
            await createPost({ title, content, tags, imageUrl }, 1);
            setTitle('');
            setContent('');
            setTags('');
            setImageUrl('');
            onPostCreated();
            onClose();
        } catch (err) {
            console.error('Failed to create post:', err);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px', boxSizing: 'border-box'
        }}>
            <div style={{
                background: '#1a1a1a', padding: '30px', borderRadius: '8px',
                width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
                position: 'relative', boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                border: '1px solid #333', color: '#fff', boxSizing: 'border-box'
            }}>
                <h3 style={{ marginTop: 0, color: '#fff' }}>Create New Article</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                        type="text"
                        placeholder="Article Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }}
                    />
                    <textarea
                        placeholder="Write your article content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        required
                        style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }}
                    />
                    <input
                        type="text"
                        placeholder="Tags (e.g., Java, React, Spring)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff' }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '12px', color: '#aaa' }}>Upload Image or Paste Image URL:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ fontSize: '14px', color: '#ccc' }}
                        />
                        <input
                            type="text"
                            placeholder="Or paste image URL here..."
                            value={imageUrl.startsWith('data:') ? '' : imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            style={{ padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #444', background: '#2a2a2a', color: '#fff', marginTop: '4px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 16px', background: '#444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button type="submit" style={{ padding: '10px 16px', background: '#e05638', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Publish
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};