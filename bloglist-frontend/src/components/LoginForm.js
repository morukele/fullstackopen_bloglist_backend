import React, { useState } from "react";
import PropTypes from "prop-types";

const LoginForm = ({ handleLogin }) => {
  LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = (event) => {
    event.preventDefault();
    const user = {
      username: username,
      password: password,
    };
    handleLogin(user);
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <h2>Log into application</h2>
      <form onSubmit={login}>
        <div>
          username{" "}
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          log in
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
