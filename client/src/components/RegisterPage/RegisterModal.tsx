import { FormEvent, useState } from 'react';
import { signup } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { actions as userActions } from '../../features/user/userSlice';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [error, setError] = useState(false);

  const dispatch = useAppDispatch();

  const handleSignup = async (email: string, password: string, nickname: string, name: string, surname: string) => {
    try {
      const user = await signup({ email, password, nickname, name, surname });

      if (!user) {
        setError(true);
        setPassword('');
        return;
      }

      dispatch(userActions.set(user));
      navigate('/');
      onClose(); // Close the modal on successful signup
    } catch (error) {
      setError(true);
      navigate('/error');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);
    handleSignup(email, password, nickname, name, surname);
  };

  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <div className="box">
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
              <label className="label">Nickname</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  required
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
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
            <div className="field">
              <label className="label">Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Surname</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  required
                  value={surname}
                  onChange={(event) => setSurname(event.target.value)}
                />
              </div>
            </div>
            {error && (
              <div className="message is-danger">
                <p className="message-body">Registration failed</p>
              </div>
            )}
            <div className="field">
              <div className="control">
                <button type="submit" className="button is-link">
                  Register
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  );
};
