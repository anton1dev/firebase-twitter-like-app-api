import axios from 'axios';
import { API_URL } from '../config/variables';
import { Comment } from '../interfaces/Comment';
import { getAuthToken } from './api';

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const response = await axios.get(`${API_URL}/comments/${postId}`);

  return response.data;
}

export async function addComment(postId: string, text: string, authorName: string) {
  const token = getAuthToken();

  const commentObj = {
    text,
    postId,
    username: authorName,
  };

  return await axios.post(`${API_URL}/comments`, commentObj, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
