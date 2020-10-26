import React from "react";
import { ReactComponent as DoubleCheck } from "../assets/double-tick-indicator.svg";
import { useStateValue } from "../utils/stateprovider";
import { ReactComponent as SingleCheck } from "../assets/check-symbol.svg";

const Message = ({ message }) => {
  const [{ mainUser }] = useStateValue();
  return (
    <div
      className={`message ${
        mainUser.id === message.sender ? "sent" : "received"
      }`}
    >
      {message.msg}
      <div className="metadata">
        <span className="date">{new Date(message.date).toLocaleString()}</span>
        {mainUser.id === message.sender &&
          (message.status === "sent" ? (
            <SingleCheck />
          ) : message.status === "received" ? (
            <DoubleCheck />
          ) : message.status === "read" ? (
            <DoubleCheck fill={"skyblue"} />
          ) : null)}
      </div>
    </div>
  );
};

export default Message;
