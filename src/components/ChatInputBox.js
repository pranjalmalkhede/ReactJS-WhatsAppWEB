import React from "react";
import { ReactComponent as EmojiIcon } from "../assets/tag_faces.svg";
import { ReactComponent as YourSvg } from "../assets/send.svg";

import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from "@material-ui/core/styles";

const BlueOnGreenTooltip = withStyles({
  tooltip: {
   fontSize:"15px"
  }
})(Tooltip);

const ChatInputBox = ({
  message,
  setMessage,
  pushMessage,
  showEmojiTray,
  toggleEmojiTray,
}) => {
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
      <EmojiIcon onClick={() => toggleEmojiTray(!showEmojiTray)} />
      </BlueOnGreenTooltip>
        
        <div className={`emoji-${showEmojiTray ? "show" : "hide"}`}>
          <Picker
            native
            showPreview={false}
            onSelect={selectEmoji}
          />
        </div>
      </div>

      <div className="chat-input">
        <input
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
        {<YourSvg />}
      </div>
      </BlueOnGreenTooltip>
    </div>
  );
};

export default ChatInputBox;
