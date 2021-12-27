import React from "react";
import { useDispatch } from "react-redux";
import { errorNotification } from "../reducers/notificationReducer";
import blogService from "../services/blogs";
import { increaseLike } from "../reducers/blogReducer";

const BlogDetail = ({ blog }) => {
  const dispatch = useDispatch();

  const like = async (blog) => {
    try {
      const updatedBlog = {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      };
      dispatch(increaseLike(updatedBlog));
      await blogService.update(blog.id, updatedBlog);
    } catch (e) {
      dispatch(errorNotification("Something went wrong"));
      setTimeout(() => {
        dispatch(errorNotification(null));
      }, 5000);
    }
  };

  if (!blog) {
    return null;
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <a href={blog.url}>{blog.url}</a>
      <p>
        {blog.likes} likes <button onClick={() => like(blog)}>like</button>
      </p>
      <p>added by {blog.author}</p>
    </div>
  );
};

export default BlogDetail;
