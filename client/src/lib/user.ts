import axios from 'axios';
import { getAccessToken, logout } from './auth';
import { API_URL } from '../config/variables';
import { UpdateUser } from '../interfaces/UpdateUser';

export async function updateUserPhoto(userId: string, updatedUser: UpdateUser) {
  await axios.patch(`${API_URL}/users/${userId}`, updatedUser);

  return getUserInfo();
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
export async function getUserInfo() {
  try {
    const response = await axios.get(`${API_URL}/auth/profile`);
    const user = response.data;

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
