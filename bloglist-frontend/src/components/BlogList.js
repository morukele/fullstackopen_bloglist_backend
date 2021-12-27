import React from "react";
import Blog from "./Blog";
import { useSelector, useDispatch } from "react-redux";
import blogService from "../services/blogs";
import { errorNotification } from "../reducers/notificationReducer";
import { deleteBlog, increaseLike } from "../reducers/blogReducer";

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const userBlogs = user
    ? blogs
        .sort((a, b) => b.likes - a.likes)
        .filter((blog) => blog.user.username === user.username)
    : [];

  const handleLike = async (blog) => {
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

  const handleDelete = async (blog) => {
    try {
      dispatch(deleteBlog(blog));
      await blogService.remove(blog.id);
    } catch (e) {
      dispatch(errorNotification("Something went wrong"));
      setTimeout(() => {
        dispatch(errorNotification(null));
      }, 5000);
    }
  };

  return (
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
  );
};

export default BlogList;
