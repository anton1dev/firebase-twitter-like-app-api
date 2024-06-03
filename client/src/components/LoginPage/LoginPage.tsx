import { FormEvent, useState } from 'react';
import { login, loginWithGoogle } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { actions as userActions } from '../../features/user/userSlice';
import { RegisterModal } from '../RegisterModal/RegisterModal';
import { Loader } from '../Loader';

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isLoading } = useAppSelector((state) => state.user);

  const handleLogin = async (email: string, password: string) => {
    try {
      dispatch(userActions.setLoading(true));
      navigate('/feed');
      console.log('entering');
      const user = await login(email, password);

      if (!user) {
        setError(true);
        setPassword('');
        return;
      }

      dispatch(userActions.set(user));
      dispatch(userActions.setLoading(false));
    } catch (error) {
      setError(true);
      navigate('/error');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);
    navigate('/feed');

    handleLogin(email, password);
  };

  const handleGoogleAuth = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const user = await loginWithGoogle();

    dispatch(userActions.setLoading(true));

    if (!user) {
      setError(true);
      dispatch(userActions.setLoading(false));

      return;
    }
    navigate('/feed');
    dispatch(userActions.setLoading(false));
    dispatch(userActions.set(user));
  };

  return isLoading ? (
    <Loader />
  ) : (
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
