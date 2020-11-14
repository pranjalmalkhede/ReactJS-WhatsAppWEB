import React, { useRef, useEffect } from "react";
import Message from "./Message";

const MessagesBox = ({ messages }) => {
  const endDiv = useRef(null);
  useEffect(() => {
    endDiv.current.scrollIntoView();
  }, [messages]);

  return (
    <div
      className="chats"
      style={
        messages.length === 0
          ? {
              justifyContent: "center",
              display: "flex",
              alignItems: "flex-end",
            }
          : {}
      }
    >
      {messages.length === 0 && (
        <p className="no-messages">start a conversation</p>
      )}
      {messages
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((m) =>
          m.dateCreated ? <Message message={m} key={m.uid} /> : null
        )}
      <div style={{ float: "right", clear: "both" }} ref={endDiv}></div>
    </div>
  );
};

export default MessagesBox;
