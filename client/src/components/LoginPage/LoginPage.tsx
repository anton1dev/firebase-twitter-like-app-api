import { FormEvent, useState } from 'react';
import { login, loginWithGoogle } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { actions as userActions } from '../../features/user/userSlice';
import { RegisterModal } from '../RegisterModal/RegisterModal';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useAppDispatch();

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await login(email, password);

      if (!user) {
        setError(true);
        setPassword('');

        return;
      }

      dispatch(userActions.set(user));
      navigate('/');
    } catch (error) {
      setError(true);
      navigate('/error');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);
    handleLogin(email, password);
  };

  const handleGoogleAuth = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const user = await loginWithGoogle();

    if (!user) {
      setError(true);
      return;
    }

    dispatch(userActions.set(user));
    navigate('/');
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
          <div className="control is-flex is-flex-direction-row is-justify-content-flex-start">
            <button type="submit" className="button is-link">
              Login
            </button>

            <button type="button" className="button is-primary ml-5" onClick={handleGoogleAuth}>
              Sign in with Google
            </button>
          </div>
        </div>
      </form>

      <button type="button" onClick={() => setIsModalOpen(true)} className="button is-danger mt-5">
        Click here to register
      </button>

      <RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
