import classNames from 'classnames';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../lib/auth';
import { actions as userActions } from '../features/user/userSlice';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.user);

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    classNames('navbar-item', {
      'has-background-grey-lighter': isActive,
    });

  const handleLogout = async (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();
    const result = await logout();
    console.log(1);
    console.log(result);

    dispatch(userActions.clear());
    navigate('/');
  };

  return (
    <nav data-cy="nav" className="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <NavLink className={getLinkClass} to="/">
            Home
          </NavLink>

          {user && (
            <NavLink className={getLinkClass} to="/profile">
              Profile
            </NavLink>
          )}

          {!user && (
            <NavLink className={getLinkClass} to="/login">
              Login
            </NavLink>
          )}

          <NavLink className={getLinkClass} to="/feed">
            Feed
          </NavLink>

          {user && (
            <button className="navbar-item" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
