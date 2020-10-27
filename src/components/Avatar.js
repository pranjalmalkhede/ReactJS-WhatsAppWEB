import React from "react";
import { Avatar as A } from "@material-ui/core";

const Avatar = ({ user, showName }) => {
  return (
    <div className="avatar-component">
      <A src={user.avatar} alt="" className={"avatar"} />
      {/* <img className="avatar" src={user.avatar} alt="" /> */}
      {showName && <h3 className="avatar-title">{user.name}</h3>}
    </div>
  );
};

export default Avatar;
