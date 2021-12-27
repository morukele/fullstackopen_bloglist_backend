import React from "react";
import { Link } from "react-router-dom";

const Blog = ({ blog, handleLikes, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blog">
      <div>
        <Link to={`/blogs/${blog.id}`} className="title">
          {blog.title}
        </Link>
      </div>
    </div>
  );
};

export default Blog;
