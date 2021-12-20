import React, { useEffect, useRef } from "react";
import loginService from "./services/login";
import blogService from "./services/blogs";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import "./index.css";
import Togglable from "./components/Togglable";
import { createBlog, initializeBlogs } from "./reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "./reducers/userReducer";
import {
  errorNotification,
  successNotification,
} from "./reducers/notificationReducer";
import Notification from "./components/Notification";

const App = () => {
  const dispatch = useDispatch();

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem("loggedInUser");
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson);
      dispatch(loginUser(user));
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(initializeBlogs(blogs)));
  }, [dispatch]);

  const user = useSelector((state) => state.users);

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
    } catch (e) {
      //setErrorMessage("Something went wrong");
      dispatch(errorNotification("Something went wrong"));
      setTimeout(() => {
        dispatch(errorNotification(null));
      }, 5000);
    }
  };

  const handleLogin = async (userData) => {
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
  };

  const handleLogout = async (event) => {
    window.localStorage.clear();
    dispatch(logoutUser());
    blogService.setToken(null);
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
      dispatch(createBlog(newBlog));
      dispatch(
        successNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`
        )
      );
      setTimeout(() => {
        dispatch(successNotification(null));
      }, 5000);
    } catch (e) {
      console.log(e.error);
      dispatch(errorNotification("Something went wrong"));
      setTimeout(() => {
        dispatch(errorNotification(null));
      }, 5000);
    }
  };

  const handleDelete = async (blog) => {
    try {
      blogService.remove(blog.id);
    } catch (e) {
      dispatch(errorNotification("Something went wrong"));
      setTimeout(() => {
        dispatch(errorNotification(null));
      }, 5000);
    }
  };

  const blogs = useSelector((state) => state.blogs);
  const notification = useSelector((state) => state.notification);

  const userBlogs = user
    ? blogs
        .sort((a, b) => b.likes - a.likes)
        .filter((blog) => blog.user.username === user.username)
    : [];

  return (
    <div>
      <h2>Blogs</h2>
      <Notification data={notification} />
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
          <div id="bloglist">
            {userBlogs.map((blog) => (
              <Blog
                key={blog.title}
                blog={blog}
                handleLikes={handleLike}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
