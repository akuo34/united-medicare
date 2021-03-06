import React from 'react';

const Login = (props) => {
  return (
    <div className="container-login">
      <h4>Sign in</h4>
      <form id="form-login" onSubmit={props.signInHandler}>
        <input
          className="input-login"
          name="login"
          placeholder="E.g: johnDorian123@gmail.com"
          id="login"
        />
        <input
          className="input-login"
          type="password"
          name="password"
          placeholder="Your password"
          id="password"
        />
        <div className="container-landing-button">
          {/* <Link className="link-landing" to="/admin/passwordReset">Forgot your password?</Link> */}
          <button type="submit">Sign In</button>
        </div>
      </form>
    </div>
  )
}

export default Login;