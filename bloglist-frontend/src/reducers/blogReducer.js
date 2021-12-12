const blogReducer = (state = [], action) => {
  console.log("Token", action);
  console.log("State", state);
  switch (action.type) {
    case "INIT_BLOGS":
      return action.data;
    case "SET_TOKEN":
      return action.data;
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

export const setToken = (token) => {
  return {
    type: "SET_TOKEN",
    data: token,
  };
};

export default blogReducer;
