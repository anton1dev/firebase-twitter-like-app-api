import axios from 'axios';
import { PostType } from './../types/PostType';
import { UserType } from './../types/UserType';

export const API_URL = 'http://localhost:3000/';

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function getPosts(): Promise<PostType[]> {
  // keep this delay for testing purpose
  return wait(500)
    .then(() => fetch(`${API_URL}posts`))
    .then((response) => response.json());
}

export async function getUsers(): Promise<UserType[]> {
  // keep this delay for testing purpose
  return wait(500)
    .then(() => fetch(`${API_URL}users`))
    .then((response) => response.json());
}

export async function giveLike(postId: string): Promise<void> {
  await axios.patch(`${API_URL}posts/like/${postId}`);
  console.log(1);
}

export async function giveDislike(postId: string): Promise<void> {
  await axios.patch(`${API_URL}posts/dislike/${postId}`);
  console.log(-1);
}
