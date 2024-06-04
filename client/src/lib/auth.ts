import axios from 'axios';

import firebase from '../firebase/config';
import { User } from '../interfaces/User';
import { NewUser } from '../interfaces/NewUser';

const API_URL = 'https://us-central1-fir-twitter-like-app.cloudfunctions.net/api';
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

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? undefined;
}

function setAccessToken(token: string) {
  return localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export async function signup(newUserData: NewUser) {
  try {
    const user: User = await axios.post(`${API_URL}/auth/signup`, newUserData);

    return user;
  } catch (err) {
    console.error(err);
  }
}

export async function googleSignup(newUserData: User) {
  try {
    const response = await axios.post(`${API_URL}/auth/googlesignup`, newUserData);
    console.log('1234');
    const { token } = response.data;
    setAccessToken(token);

    return newUserData;
  } catch (err) {
    console.error(err);
  }
}

export async function login(email: string, password: string) {
  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const { token } = response.data;
    setAccessToken(token);
    const user = await getUserInfo();

    return user;
  } catch (error) {
    return null;
  }
}

export async function loginWithGoogle(): Promise<User | null> {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);

    const { user } = result;

    if (!user || !user.displayName || !user.uid || !user.email) {
      return null;
    }

    const existingUser = await getUserByEmail(user.email);
    if (existingUser) {
      const token = await user.getIdToken();
      setAccessToken(token);

      return existingUser;
    }

    const userData: User = {
      id: user.uid,
      nickname: user.displayName,
      name: user.displayName?.split(' ')[0],
      surname: user.displayName?.split(' ')[1],
      email: user.email,
      password: '12345678',
      posts: [],
    };

    const registeredUser = await googleSignup(userData);

    if (registeredUser) {
      return registeredUser;
    } else {
      return userData;
    }
  } catch (error) {
    console.error('Error during Google login:', error);
    return null;
  }
}

async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const response = await axios.get(`${API_URL}/users/email?email=${email}`);
    const users = response.data;

    if (users.length > 0) {
      return users[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function logout() {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    localStorage.removeItem(ACCESS_TOKEN_KEY);

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return null;
  }
}

export function getUser() {
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  return getUserInfo();
}

export async function deleteUser() {
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  await logout();

  await axios.delete(`${API_URL}/auth/profile/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function getUserInfo() {
  try {
    const response = await axios.get(`${API_URL}/auth/profile`);
    const user = response.data;

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
