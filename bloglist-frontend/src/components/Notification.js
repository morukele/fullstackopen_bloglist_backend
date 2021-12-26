import React from "react";
import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (!notification) {
    return null;
  }

  const { text, type } = notification;

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
