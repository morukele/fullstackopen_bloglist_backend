import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { errorNotification } from "../reducers/notificationReducer";
import blogService from "../services/blogs";
import { increaseLike, addComment } from "../reducers/blogReducer";

const BlogDetail = ({ blog }) => {
  const [comment, setComment] = useState("");
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

  const CreateComment = async (e) => {
    e.preventDefault();
    try {
      const updatedBlog = {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
        comments: blog.comments.concat(comment),
      };
      dispatch(addComment(updatedBlog));
      await blogService.update(blog.id, updatedBlog);
      setComment("");
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
      <h3>comments</h3>
      <form onSubmit={CreateComment}>
        <input
          id="comment"
          type="text"
          value={comment}
          name="comment"
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
        {blog.comments.length !== 0 ? (
          blog.comments.map((c) => <li key={c}>{c}</li>)
        ) : (
          <p>no comments yet</p>
        )}
      </form>
    </div>
  );
};

export default BlogDetail;
