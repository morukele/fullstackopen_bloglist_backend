import React, { useState, useEffect } from "react";
import loginService from "./services/login";
import blogService from "./services/blogs";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import SuccessNotification from "./components/SuccessNotification";
import ErrorNotification from "./components/ErrorNotification";
import "./index.css";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, [user]);

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem("loggedInUser");
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username: username,
        password: password,
      });

      window.localStorage.setItem("loggedInUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setSuccessMessage(`${user.name} succesfully logged in`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (e) {
      setErrorMessage("wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    window.localStorage.clear();
    setUser(null);
    blogService.setToken(null);
    setBlogs([]);
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      const userData = {
        username: user.username,
        name: user.name,
      };
      const newBlog = {
        title: title,
        author: author,
        url: url,
        user: userData,
      };

      await blogService.create(newBlog);
      setBlogs(blogs.concat(newBlog));
      setSuccessMessage(
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      );
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch (e) {
      console.log(e.error);
      setErrorMessage("Something went wrong");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const userBlogs = user
    ? blogs.filter((blog) => blog.user.username === user.username)
    : [];
  return (
    <div>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <h2>Blogs</h2>
      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      ) : (
        <div>
          <BlogForm
            title={title}
            author={author}
            url={url}
            setAuthor={setAuthor}
            setUrl={setUrl}
            setTitle={setTitle}
            handleCreate={handleCreate}
          />
          <p>
            {user.name} logged in{" "}
            <button onClick={handleLogout}>log out</button>
          </p>
          {userBlogs.map((blog) => (
            <Blog key={blog.title} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
