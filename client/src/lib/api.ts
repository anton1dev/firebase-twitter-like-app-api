import axios from 'axios';
import { PostType } from './../types/PostType';
import { UserType } from './../types/UserType';

export const API_URL = 'http://localhost:3000/';

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function getAuthToken(): string | null {
  return localStorage.getItem('accessToken');
}

export async function getPosts(): Promise<PostType[]> {
  return wait(500)
    .then(() => fetch(`${API_URL}posts`))
    .then((response) => response.json());
}

export async function getUsers(): Promise<UserType[]> {
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
