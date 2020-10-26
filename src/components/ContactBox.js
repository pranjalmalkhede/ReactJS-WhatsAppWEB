import React from "react";
import Avatar from "./Avatar";
import { ReactComponent as DoubleCheck } from "../assets/double-tick-indicator.svg";
import { ReactComponent as SingleCheck } from "../assets/check-symbol.svg";

export default function ContactBox({
  contact,
  setContactSelected,
  messages,
  onClick,
  setMessage,
}) {
  const maxTs =
    messages.length !== 0 &&
    Math.max(...messages.map((m) => new Date(m.date).getTime()));
  const lastMsg =
    messages.length !== 0 &&
    messages.find((m) => new Date(m.date).getTime() === maxTs);

  let unSeenMsgCount = 0;
  if (messages.length !== 0) {
    messages.forEach((msg) => {
      if (msg.status === "received") {
        unSeenMsgCount += 1;
      }
    });
  }

  const getBoldStyles = () => {
    return unSeenMsgCount > 0 && lastMsg.sender === contact.id;
  };

  function truncate(text, length) {
    return text.length > length ? `${text.substring(0, length)} ...` : text;
  }
  return (
    <div
      className="contact-box"
      onClick={() => {
        setContactSelected(contact);
        onClick();
        setMessage("");
      }}
    >
      <Avatar user={contact} />
      <div className="right-section">
        <div className="contact-box-header">
          <h3
            className={`avatar-title ${
              unSeenMsgCount > 0 && getBoldStyles() ? "unseenBold" : ""
            }`}
          >
            {contact.name}
          </h3>
          {messages.length !== 0 && (
            <span
              className={`time-mark ${
                getBoldStyles() ? "unseenBold greenColor" : ""
              }`}
            >
              {new Date(lastMsg.date).toLocaleDateString()}
            </span>
          )}
        </div>
        {lastMsg && (
          <div className="last-msg">
            {lastMsg.sender !== contact.id &&
              (lastMsg.status === "sent" ? (
                <SingleCheck />
              ) : lastMsg.status === "received" ? (
                <DoubleCheck />
              ) : lastMsg.status === "read" ? (
                <DoubleCheck fill={"skyblue"} />
              ) : null)}
            <div className="contactbox__info">
              <span className={`text ${getBoldStyles() ? "unseenBold" : ""}`}>
                {truncate(lastMsg.msg, 30)}
              </span>
              {getBoldStyles() && (
                <div className="contactbox__unseen">
                  <span className="contactbox__info__unseencount">
                    {unSeenMsgCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
