import React from "react";

const Notification = ({ data }) => {
  if (!data) {
    return null;
  }

  const { text, type } = data;

  if (!text) {
    return null;
  }

  const style = {
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    color: type === "success" ? "green" : "red",
    background: "lightgrey",
  };

  return <div style={style}>{text}</div>;
};

export default Notification;
