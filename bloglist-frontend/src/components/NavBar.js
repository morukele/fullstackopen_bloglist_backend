import React from "react";
import { useDispatch, useSelector } from "react-redux";
import blogService from "../services/blogs";
import { logoutUser } from "../reducers/userReducer";
import { Link, useHistory } from "react-router-dom";

const NavBar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = async (event) => {
    window.localStorage.clear();
    dispatch(logoutUser());
    blogService.setToken(null);
    history.push("/");
  };

  return (
    <div>
      <em>
        <Link to="/users">Users Info</Link>
      </em>
      <em> </em>
      <em>
        <Link to="/home">Blogs</Link>
      </em>
      <em> </em>
      {user ? (
        <em>
          {user.name} logged in <button onClick={handleLogout}>log out</button>
        </em>
      ) : (
        <em>
          <Link to="/login">login</Link>
        </em>
      )}
    </div>
  );
};

export default NavBar;
