import React, { useState } from "react";

const Blog = ({ blog, handleLikes, handleDelete }) => {
  const [visible, setVisible] = useState(false);

  const showWhenVisible = { display: visible ? "" : "none" };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const message = visible ? "hide" : "view";

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const increaseLike = () => {
    handleLikes(blog);
  };

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleDelete(blog);
    }
  };

  return (
    <div style={blogStyle} className="blog">
      <div>
        <p className="title">
          {blog.title} <button onClick={toggleVisible}>{message}</button>{" "}
        </p>
        <div style={showWhenVisible} className="togglePart">
          <p className="url">{blog.url}</p>
          <p className="likes">
            likes {blog.likes}{" "}
            <button id="like" onClick={increaseLike}>
              like
            </button>
          </p>
          <p>{blog.author}</p>
          <button id="remove" onClick={removeBlog}>
            remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
