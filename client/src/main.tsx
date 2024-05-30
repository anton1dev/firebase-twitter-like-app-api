import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Root } from './Root.tsx';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import store from './app/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Root />
      </Router>
    </Provider>
    ,
  </React.StrictMode>,
);
