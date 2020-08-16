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
import ContactManager from './ContactManager';
import HomeManager from './HomeManager';
import AboutManager from './AboutManager';
// const Login = React.lazy(() => import('./Login'));
// const ProductManager = React.lazy(() => import('./ProductManager'));

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

  const clearCookie = () => {
    Axios
      .get('/clear-cookie')
      .then(response => {
        setUser(response.data.screen);
        window.location.reload();
      })
      .catch(err => console.error(err));
  }

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
    // eslint-disable-next-line no-restricted-globals
    // location.reload();
  };

  const toolbarHandler = () => {
    if (showToolbar) {
      setShowToolbar(false);
    } else {
      setShowToolbar(true);
    }
  }

  const returnHome = () => {
    window.location = "http://localhost:3000";
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
    // <div style={{"display":"flex", "height":"100vh", "width":"100vw", "position":"absolute", "top":"0"}}>
    <div>
      <div style={{"height":"10vh"}}></div>
      <h2>Admin Console</h2>
      {
        user === 'admin' ?
          <div>
            <Router>
              <div className="container-page">
                <div className="toolbar-main admin">
                  <div className="header-company">
                    {/* <Link className="link trademark" to="/">United Medicare</Link> */}
                    <span onClick={returnHome} className="link trademark">United Medi-Care Inc.</span>
                  </div>
                  <div className="container-links">
                    <Link className="link" to="/admin/home">Home</Link>
                    <Link className="link" to="/admin/about">About</Link>
                    <Link className="link" to="/admin">Products</Link>
                    <Link className="link" to="/admin/contact">Contact</Link>
                    <span onClick={logout} className="link">Logout</span>
                  </div>
                  <img onClick={toolbarHandler} className="hamburger" src="/hamburger_button_white.svg" alt="hamburger button" />
                </div>
                <div className={showToolbar ? "container-links-small-device" : "container-links-small-device hidden"}>
                  <Link onClick={toolbarHandler} className="link dropdown" to="/admin/home">Home</Link>
                  <Link onClick={toolbarHandler} className="link dropdown" to="/admin/about">About</Link>
                  <Link onClick={toolbarHandler} className="link dropdown" to="/admin">Products</Link>
                  <Link onClick={toolbarHandler} className="link dropdown" to="/admin/contact">Contact</Link>
                  <span onClick={logout} className="link dropdown">Log out</span>
                </div>
                <Switch>
                  {/* <Route path="/admin" render={() => <Admin />} />
                      <Route path="/contact" render={() => <Contact />} />
                      <Route path="/products" render={() => <Products />} />
                      <Route path="/about" render={() => <About />} />
                      <Route exact path="/" render={() => <Home />} /> */}
                  <Route path="/admin/home">
                    <HomeManager />
                  </Route>
                  <Route path="/admin/contact">
                    <ContactManager />
                  </Route>
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