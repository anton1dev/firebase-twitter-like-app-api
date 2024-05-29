import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    classNames('navbar-item', {
      'has-background-grey-lighter': isActive,
    });

  return (
    <nav data-cy="nav" className="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <NavLink className={getLinkClass} to="/">
            Home
          </NavLink>

          <NavLink className={getLinkClass} to="/profile">
            My Profile
          </NavLink>

          <NavLink className={getLinkClass} to="/login">
            Login
          </NavLink>

          <NavLink className={getLinkClass} to="/feed">
            Feed
          </NavLink>

          <NavLink className={getLinkClass} to="/logout">
            Logout
          </NavLink>
        </div>
      </div>
    </nav>
  );
};