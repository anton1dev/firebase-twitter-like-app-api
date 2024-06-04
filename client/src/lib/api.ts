import { API_URL } from '../config/variables';
import { User } from '../interfaces/User';

export function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function getAuthToken(): string | null {
  return localStorage.getItem('accessToken');
}

export async function getUsers(): Promise<User[]> {
  return wait(0)
    .then(() => fetch(`${API_URL}/users`))
    .then((response) => response.json());
}
