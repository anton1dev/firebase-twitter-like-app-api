import axios from 'axios';
import { Post } from '../interfaces/Post';
import { User } from '../interfaces/User';
import { CreatePost } from '../interfaces/CreatePost';

export const API_URL = 'https://us-central1-fir-twitter-like-app.cloudfunctions.net/api/';

export function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function getAuthToken(): string | null {
  return localStorage.getItem('accessToken');
}

export async function getPosts(): Promise<Post[]> {
  return wait(500)
    .then(() => fetch(`${API_URL}posts`))
    .then((response) => response.json());
}

export async function getPostsByUser(userId: string): Promise<Post[]> {
  return wait(500)
    .then(() => fetch(`${API_URL}posts/user/${userId}`))
    .then((response) => response.json());
}

export async function getPostsByQuery(query: string): Promise<Post[]> {
  return wait(500)
    .then(() => fetch(`${API_URL}posts/${query}`))
    .then((response) => response.json());
}

export async function getUsers(): Promise<User[]> {
  return wait(500)
    .then(() => fetch(`${API_URL}users`))
    .then((response) => response.json());
}

export async function giveLike(postId: string): Promise<void> {
  const token = getAuthToken();

  await axios.patch(`${API_URL}posts/like/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function giveDislike(postId: string): Promise<void> {
  const token = getAuthToken();

  await axios.patch(`${API_URL}posts/dislike/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createPost(createPost: CreatePost): Promise<Post> {
  const token = getAuthToken();

  return await axios.post(`${API_URL}posts`, createPost, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
