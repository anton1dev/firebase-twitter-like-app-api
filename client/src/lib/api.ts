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
