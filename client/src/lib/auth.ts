import axios from 'axios';

import firebase from '../firebase/config';
import { UserType } from '../types/UserType';

const API_URL = 'http://localhost:3000/auth';
const ACCESS_TOKEN_KEY = 'accessToken';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
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
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const { token } = response.data;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);

    const user = await getUserFromToken();
    return user;
  } catch (error) {
    return null;
  }
}

export async function loginWithGoogle(): Promise<UserType | null> {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    const { user } = result;

    if (!user || !user.displayName || !user.uid || !user.email) {
      return null;
    }

    const userData = {
      id: user.uid,
      nickname: user.displayName,
      name: user.displayName?.split(' ')[0],
      surname: user.displayName?.split(' ')[1],
      email: user.email,
      posts: [],
    };

    try {
      const response = await axios.post(`${API_URL}/googlesignup`, userData);

      if (response.status !== 200) {
        throw new Error('Google signup failed');
      }

      console.log('Google signup successful:', response.data);
    } catch (error) {
      console.error('Error during Google signup request:', error);
    }

    return userData;
  } catch (error) {
    console.error('Error during Google login:', error);
    return null;
  }
}

export async function logout() {
  try {
    const response = await axios.post(`${API_URL}/logout`);
    localStorage.removeItem(ACCESS_TOKEN_KEY);

    return response;
  } catch (error) {
    return null;
  }
}

export function getUser() {
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  return getUserFromToken();
}

async function getUserFromToken() {
  try {
    const response = await axios.get(`${API_URL}/profile`);
    const user = response.data;

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
