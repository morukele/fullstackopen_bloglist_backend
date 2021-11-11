import React, { useState, useEffect, useRef } from "react";
import loginService from "./services/login";
import blogService from "./services/blogs";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import SuccessNotification from "./components/SuccessNotification";
import ErrorNotification from "./components/ErrorNotification";
import "./index.css";
import Togglable from "./components/Togglable";

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const blogFormRef = useRef();

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

  const handleLike = async (blog) => {
    try {
      const updatedBlog = {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      };
      await blogService.update(blog.id, updatedBlog);
      setBlogs(
        blogs.filter((b) => (b.id === blog.id ? (b.likes = b.likes + 1) : b))
      );
    } catch (e) {
      setErrorMessage("Something went wrong");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogin = async (userData) => {
    try {
      const user = await loginService.login(userData);

      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
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

  const handleCreate = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisible();
      const userData = {
        username: user.username,
        name: user.name,
      };
      newBlog.user = userData;

      await blogService.create(newBlog);
      setBlogs(blogs.concat(newBlog));
      setSuccessMessage(
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      );
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (e) {
      console.log(e.error);
      setErrorMessage("Something went wrong");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleDelete = async (blog) => {
    try {
      blogService.remove(blog.id);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
    } catch (e) {
      setErrorMessage("Something went wrong");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const userBlogs = user
    ? blogs
        .sort((a, b) => b.likes - a.likes)
        .filter((blog) => blog.user.username === user.username)
    : [];

  return (
    <div>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <h2>Blogs</h2>
      {user === null ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <div>
          <p>
            {user.name} logged in{" "}
            <button onClick={handleLogout}>log out</button>
          </p>
          <Togglable buttonLabel="Create New Blog" ref={blogFormRef}>
            <BlogForm handleCreate={handleCreate} />
          </Togglable>
          {userBlogs.map((blog) => (
            <Blog
              key={blog.title}
              blog={blog}
              handleLikes={handleLike}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
