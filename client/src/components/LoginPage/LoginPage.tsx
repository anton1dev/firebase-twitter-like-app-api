import { useState } from 'react';
import { login, logout } from '../../lib/auth';
import { UserType } from '../../types/UserType';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  const handleLogin = (user: UserType) => {
    setUser(user);
    navigate('/');
  };

  const handleLogout = async (event: any) => {
    event.preventDefault();
    setUser(null);
    await logout();
    console.log(`Logged out!`);
    navigate('/');
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setError(false);
    const user: UserType = await login(email, password);
    if (user) {
      handleLogin(user);
      console.log(user.nickname);
    } else {
      setError(true);
    }
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
            <button type="button" className="button is-danger ml-4" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
