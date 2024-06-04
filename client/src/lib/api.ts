import axios from 'axios';
import { Post } from '../interfaces/Post';
import { User } from '../interfaces/User';
import { CreatePost } from '../interfaces/CreatePost';
import { UpdatePost } from '../interfaces/UpdatePost';

export const API_URL = 'https://us-central1-fir-twitter-like-app.cloudfunctions.net/api';

export function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function getAuthToken(): string | null {
  return localStorage.getItem('accessToken');
}

export async function getAllPostsLength(): Promise<number> {
  const allPosts = await wait(0).then(() => fetch(`${API_URL}/posts`).then((response) => response.json()));
  return allPosts.length;
}

export async function getPostsPaginated(page: number = 1, limit: number = 10): Promise<Post[]> {
  return wait(0).then(() => fetch(`${API_URL}/posts?page=${page}&limit=${limit}`).then((response) => response.json()));
}

export async function getPostsByUser(userId: string): Promise<Post[]> {
  return wait(200)
    .then(() => fetch(`${API_URL}/posts/user/${userId}`))
    .then((response) => response.json());
}

export async function getPostsByQuery(query: string): Promise<Post[]> {
  return wait(500)
    .then(() => fetch(`${API_URL}/posts/${query}`))
    .then((response) => response.json());
}

export async function deletePostById(postId: string): Promise<void> {
  return axios.delete(`${API_URL}/posts/${postId}`);
}

export async function getUsers(): Promise<User[]> {
  return wait(0)
    .then(() => fetch(`${API_URL}/users`))
    .then((response) => response.json());
}

export async function giveLike(postId: string): Promise<void> {
  const token = getAuthToken();

  await axios.patch(`${API_URL}/posts/like/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function giveDislike(postId: string): Promise<void> {
  const token = getAuthToken();

  await axios.patch(`${API_URL}/posts/dislike/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createPost(createPost: CreatePost): Promise<Post> {
  const token = getAuthToken();

  return await axios.post(`${API_URL}/posts`, createPost, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updatePost(id: string, updatedPost: UpdatePost) {
  const token = getAuthToken();

  return await axios.patch(`${API_URL}/posts/${id}`, updatedPost, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
