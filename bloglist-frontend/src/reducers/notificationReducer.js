const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case "SUCCESS":
      return action.data;
    case "ERROR":
      return action.data;
    default:
      return state;
  }
};

export const successNotification = (message) => {
  return {
    type: "SUCCESS",
    data: { text: message, type: "success" },
  };
};

export const errorNotification = (message) => {
  return {
    type: "ERROR",
    data: { text: message, type: "error" },
  };
};

export default notificationReducer;
