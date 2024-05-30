import { FormEvent, FormEventHandler, useState } from 'react';
import { login } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';

import { actions as userActions } from '../../features/user/userSlice';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const dispatch = useAppDispatch();

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await login(email, password);

      if (user) {
        dispatch(userActions.set(user));
        navigate('/');
      }
    } catch (error) {
      setError(true);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);
    handleLogin(email, password);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              className="input"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        </div>
        {error && (
          <div className="message is-danger">
            <p className="message-body">Login failed</p>
          </div>
        )}
        <div className="field">
          <div className="control">
            <button type="submit" className="button is-link">
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
