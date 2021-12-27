import React, { useEffect, useRef, useState } from "react";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import "./index.css";
import Togglable from "./components/Togglable";
import { initializeBlogs } from "./reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./reducers/userReducer";
import Notification from "./components/Notification";
import BlogList from "./components/BlogList";
import NavBar from "./components/NavBar";
import UserInfo from "./components/UserInfo";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import User from "./components/User";
import userService from "./services/users";
import BlogDetail from "./components/BlogDetail";

const App = () => {
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    userService.getAll().then((users) => setUsers(users));
  }, []);

  const Home = () => {
    return (
      <div>
        <Togglable buttonLabel="Create New Blog" ref={blogFormRef}>
          <BlogForm />
        </Togglable>
        <BlogList />
      </div>
    );
  };

  const WelcomePage = () => {
    return (
      <div>
        <h1>Welcome to Blogs App</h1>
      </div>
    );
  };

  const userMatch = useRouteMatch("/users/:id");
  const user = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null;

  const blogMatch = useRouteMatch("/blogs/:id");
  const blogs = useSelector((state) => state.blogs);
  const blog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null;

  return (
    <div>
      <h2>Blogs</h2>
      <Notification />
      <NavBar />
      <Switch>
        <Route path="/login">
          <LoginForm />
        </Route>
        <Route path="/users/:id">
          <User user={user} />
        </Route>
        <Route path="/users">
          <UserInfo users={users} />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/blogs/:id">
          <BlogDetail blog={blog} />
        </Route>
        <Route path="/">
          <WelcomePage />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
