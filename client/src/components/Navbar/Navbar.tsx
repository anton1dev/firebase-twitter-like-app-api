import classNames from 'classnames';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../lib/auth';
import { actions as userActions } from '../../features/user/userSlice';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.user);

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    classNames('navbar-item', {
      'has-background-grey-lighter': isActive,
    });

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigate('/');
    dispatch(userActions.clear());
    await logout();
  };

  return (
    <nav data-cy="nav" className="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
      <div className="container is-flex is-justify-content-space-between">
        <div className="navbar-brand"></div>
        <div className="navbar-start is-flex is-flex-direction-row">
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
        </div>

        {user && (
          <div className="navbar-end">
            <p className="is-flex is-align-items-center">Welcome, {user.nickname}</p>
            <button className="has-background-grey-lighter ml-4 p-2" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
