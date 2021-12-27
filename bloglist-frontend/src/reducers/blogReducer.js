const blogReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_BLOGS":
      return action.data;
    case "NEW_BLOG":
      return state.concat(action.data);
    case "LIKE_BLOG": {
      const title = action.data.title;
      const blogToChange = state.find((b) => b.title === title);
      const changedBlog = {
        ...blogToChange,
        likes: blogToChange.likes + 1,
      };

      return state.map((blog) => (blog.title !== title ? blog : changedBlog));
    }

    case "ADD_COMMENT": {
      const title = action.data.title;
      const blogToChange = state.find((b) => b.title === title);
      const changedBlog = {
        ...blogToChange,
        comments: action.data.comments,
      };

      return state.map((blog) => (blog.title !== title ? blog : changedBlog));
    }

    case "DELETE_BLOG": {
      const title = action.data.title;

      return state.filter((b) => b.title !== title);
    }

    default:
      return state;
  }
};

export const initializeBlogs = (blogs) => {
  return {
    type: "INIT_BLOGS",
    data: blogs,
  };
};

export const createBlog = (blog) => {
  return {
    type: "NEW_BLOG",
    data: blog,
  };
};

export const increaseLike = (blog) => {
  return {
    type: "LIKE_BLOG",
    data: blog,
  };
};

export const deleteBlog = (blog) => {
  return {
    type: "DELETE_BLOG",
    data: blog,
  };
};

export const addComment = (blog) => {
  return {
    type: "ADD_COMMENT",
    data: blog,
  };
};

export default blogReducer;
