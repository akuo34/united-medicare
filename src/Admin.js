import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Axios from 'axios';

import Login from './Login';
import ProductManager from './ProductManager';
import AboutManager from './AboutManager';

const Admin = () => {

  const [user, setUser] = useState(null);
  const [showToolbar, setShowToolbar] = useState(false);

  useEffect(() => {
    Axios
      .get('/read-cookie')
      .then(response => {
        console.log(response.data);
        setUser(response.data.screen)
      })
      .catch(err => console.error(err));

  }, [user]);

  const auth = (username, password) => {
    Axios
      .get('/authenticate', { auth: { username, password } })
      // .get('/authenticate', { auth: { username, password } })
      .then(response => {
        console.log(response.data)
        setUser(response.data.screen)
      })
      .catch(err => {
        alert('incorrect login');
        console.error(err)
      });
  };

  const signInHandler = (e) => {
    e.preventDefault();

    const email = e.target.login.value;
    const password = e.target.password.value;

    auth(email, password);

    document.getElementById('form-login').reset();
  };

  const toolbarHandler = () => {
    if (showToolbar) {
      setShowToolbar(false);
    } else {
      setShowToolbar(true);
    }
  }

  const returnHome = () => {
    window.location = '/';
  }

  const logout = () => {
    Axios
      .get('/clear-cookie')
      .then(() => {
        // eslint-disable-next-line no-restricted-globals
        location.reload();
        console.log('logged out as admin')
      })
      .catch(err => console.error(err));
  }

  return (
    <div>
      <h3>Admin Console</h3>
      {
        user === 'admin' ?
          <div>
            <Router>
              <div className="container-page">
                <div className="toolbar-main admin">
                  <div className="header-company">
                    <span onClick={returnHome} className="link trademark">United Medi-Care Inc.</span>
                  </div>
                  <div className="container-links">
                    <Link className="link" to="/admin/about">About</Link>
                    <Link className="link" to="/admin">Products</Link>
                    <span onClick={logout} className="link">Logout</span>
                  </div>
                  <img onClick={toolbarHandler} className="hamburger" src="/hamburger_button_white.svg" alt="hamburger button" />
                </div>
                <div className={showToolbar ? "container-links-small-device" : "container-links-small-device hidden"}>
                  <Link onClick={toolbarHandler} className="link dropdown" to="/admin/about">About</Link>
                  <Link onClick={toolbarHandler} className="link dropdown" to="/admin">Products</Link>
                  <span onClick={logout} className="link dropdown">Log out</span>
                </div>
                <Switch>
                  <Route path="/admin/about">
                    <AboutManager />
                  </Route>
                  <Route exact path="/admin">
                    <ProductManager />
                  </Route>
                </Switch>
              </div>
            </Router>
          </div>
          :
          user === 'auth' ?
            <Login signInHandler={signInHandler} /> : null
      }
    </div>
  )
}

export default Admin;