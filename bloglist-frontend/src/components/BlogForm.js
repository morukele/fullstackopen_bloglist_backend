import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import blogService from "../services/blogs";
import { createBlog } from "../reducers/blogReducer";
import {
  successNotification,
  errorNotification,
} from "../reducers/notificationReducer";

const BlogForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.users);

  const addBlog = async (event) => {
    event.preventDefault();
    const newBlog = {
      title: title,
      author: author,
      url: url,
      likes: 0,
      user: {
        username: user.username,
        name: user.name,
      },
    };

    try {
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

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div className="formDiv">
      <h2>Create New Entry</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:{" "}
          <input
            id="title"
            type="text"
            name="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author:{" "}
          <input
            id="author"
            type="text"
            name="Author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          Url:{" "}
          <input
            id="url"
            type="text"
            name="Url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button id="create" type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
