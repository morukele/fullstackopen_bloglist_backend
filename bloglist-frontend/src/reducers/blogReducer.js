const blogReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_BLOGS":
      return action.data;
    case "NEW_BLOG":
      return state.concat(action.data);
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

export default blogReducer;
