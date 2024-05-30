import { Outlet, useNavigate } from 'react-router-dom';

import { Navbar } from './components/Navbar';

import './App.scss';
import { useState } from 'react';
import { UserType } from './types/UserType';
import { getUser } from './lib/auth';

export const App = () => {
  return (
    <div data-cy="app">
      <Navbar />
      <div className="section">
        <div className="container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
