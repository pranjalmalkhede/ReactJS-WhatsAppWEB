import React, { useEffect, useRef } from "react";
import SendIcon from "@material-ui/icons/Send";
import TagFacesIcon from "@material-ui/icons/TagFaces";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";

const BlueOnGreenTooltip = withStyles({
  tooltip: {
    fontSize: "15px",
  },
})(Tooltip);

const ChatInputBox = ({
  message,
  setMessage,
  pushMessage,
  showEmojiTray,
  toggleEmojiTray,
  contactSelected,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [contactSelected]);

  function handleKeyDown(e) {
    if (e.key === "Enter" && message) {
      pushMessage();
    }
  }

  function selectEmoji(e) {
    setMessage(message + e.native);
  }
  return (
    <div className="chat-input-box">
      <div className="icon emoji-selector">
        <BlueOnGreenTooltip title="emojis">
          <TagFacesIcon onClick={() => toggleEmojiTray(!showEmojiTray)} />
        </BlueOnGreenTooltip>

        <div className={`emoji-${showEmojiTray ? "show" : "hide"}`}>
          <Picker native showPreview={false} onSelect={selectEmoji} />
        </div>
      </div>

      <div className="chat-input">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <BlueOnGreenTooltip title="send">
        <div
          className="icon send"
          onClick={() => {
            pushMessage();
            toggleEmojiTray();
          }}
        >
          {<SendIcon />}
        </div>
      </BlueOnGreenTooltip>
    </div>
  );
};

export default ChatInputBox;
