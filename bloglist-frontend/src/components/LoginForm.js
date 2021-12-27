import React, { useState } from "react";
import { useDispatch } from "react-redux";
import loginService from "../services/login";
import blogService from "../services/blogs";
import {
  successNotification,
  errorNotification,
} from "../reducers/notificationReducer";
import { loginUser } from "../reducers/userReducer";
import { useHistory } from "react-router-dom";

const LoginForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    const userData = {
      username: username,
      password: password,
    };
    setUsername("");
    setPassword("");

    try {
      const user = await loginService.login(userData);

      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(loginUser(user));
      dispatch(successNotification(`${user.name} succesfully logged in`));
      setTimeout(() => {
        dispatch(successNotification(null));
      }, 5000);
    } catch (e) {
      dispatch(errorNotification("wrong username or password"));
      setTimeout(() => {
        dispatch(errorNotification(null));
      }, 5000);
    }

    history.push("/home");
  };

  return (
    <div>
      <h2>Log into application</h2>
      <form onSubmit={handleLogin}>
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
