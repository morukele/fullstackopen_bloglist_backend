import React from "react";
const Blog = ({ blog }) => (
  <div>
    <strong>Title:</strong> {blog.title} <strong>by</strong> {blog.author}
  </div>
);

export default Blog;
