import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface Post {
    id?: number;
    title: string;
    content: string;
    tags: string;
    imageUrl?: string;
    author?: {
        id: number;
        username: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

// Fetch all posts (supports optional search query)
export const getPosts = async (searchQuery?: string) => {
    const url = searchQuery ? `${API_BASE_URL}/posts?search=${searchQuery}` : `${API_BASE_URL}/posts`;
    const response = await axios.get<Post[]>(url);
    return response.data;
};

// Get a single post by ID
export const getPostById = async (id: number) => {
    const response = await axios.get<Post>(`${API_BASE_URL}/posts/${id}`);
    return response.data;
};

// Create a new post (hardcoded userId = 1 for now until auth UI is wired up)
export const createPost = async (postData: Post, userId: number = 1) => {
    const response = await axios.post<Post>(`${API_BASE_URL}/posts?userId=${userId}`, postData);
    return response.data;
};

// Delete a post
export const deletePost = async (id: number) => {
    await axios.delete(`${API_BASE_URL}/posts/${id}`);
};