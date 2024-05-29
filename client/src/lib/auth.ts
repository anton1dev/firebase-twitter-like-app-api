import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

const ACCESS_TOKEN_KEY = 'accessToken';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? undefined;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    return null;
  }
  const { userId, token } = await response.json();
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  console.log();

  return await getUserFromToken(userId);
}

export function getUser() {
  const token = getAccessToken();
  if (!token) {
    return null;
  }
  return getUserFromToken(token);
}

export async function logout() {
  const response = await axios.post(`${API_URL}/logout`).then(console.log);
  if (!response.ok) {
    return null;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

async function getUserFromToken(userId: string) {
  const response = await axios.get(`${API_URL}/profile`).then();
  const user = response.data;

  console.log(`User ${user.nickname} is here!`);

  return user;
}
