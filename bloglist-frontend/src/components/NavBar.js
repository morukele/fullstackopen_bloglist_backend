import React from "react";
import { useDispatch, useSelector } from "react-redux";
import blogService from "../services/blogs";
import { logoutUser } from "../reducers/userReducer";

const NavBar = () => {
  const user = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const handleLogout = async (event) => {
    window.localStorage.clear();
    dispatch(logoutUser());
    blogService.setToken(null);
  };

  return (
    <div>
      <p>
        {user.name} logged in <button onClick={handleLogout}>log out</button>
      </p>
    </div>
  );
};

export default NavBar;
