import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginWithGoogle } from '../../lib/auth';

import { actions as userActions } from '../../features/user/userSlice';

export const Profile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const handleGoogleAuth = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const userData = await loginWithGoogle();

    if (userData) {
      dispatch(userActions.set(userData));
    } else {
      console.error('User login failed');
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      {user ? (
        <div>
          <p>Welcome, {user.nickname}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <div>
          <p>No user logged in</p>
          <button onClick={handleGoogleAuth}>Login with Google</button>
        </div>
      )}
    </div>
  );
};
