import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import Login from './Login';
import ProductManager from './ProductManager';
// const Login = React.lazy(() => import('./Login'));
// const ProductManager = React.lazy(() => import('./ProductManager'));

const Admin = () => {

  const [user, setUser] = useState(null);

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

  return (
    <div>
      {
        user === 'admin' ? 
        <ProductManager /> :
        user === 'auth' ?
        <Login signInHandler={signInHandler} /> : null
      }
    </div>
  )
}

export default Admin;