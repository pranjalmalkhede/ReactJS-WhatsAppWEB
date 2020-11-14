import React, { useEffect, useState } from "react";
import "./login.css";

import Button from "@material-ui/core/Button";
import firebase from "../../firebase";
import { actionTypes } from "../../utils/reducer";
import { useStateValue } from "../../utils/stateprovider";
import { useHistory } from "react-router-dom";
import google from "../../assets/google.png";
import { ReactComponent as WhatsappLogo } from "../../assets/logo.svg";

const Login = () => {
  const [, dispatch] = useStateValue();
  const history = useHistory();
  const [users, setusers] = useState([]);

  useEffect(() => {
    let unsubscribe = firebase
      .firestore()
      .collection("whatsapp-users")
      .onSnapshot((user) => {
        let data = user.docs.map((usr) => {
          return {
            ...usr.data(),
            id: usr.id,
          };
        });
        setusers(data);
      });
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  const signIn = async (e) => {
    e.preventDefault();
    let data = await firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider());

    let check = users?.findIndex((user) => user.email === data.user.email);
    let user = {
      name: data.user.displayName,
      email: data.user.email,
      avatar: data.user.photoURL,
      id: data.user.uid,
      dateCreated: new Date(),
    };
    if (check < 0) {
      console.log("ADD USER to DATABASE");
      firebase.firestore().collection("whatsapp-users").add(user);
    }
    if (user) {
      dispatch({
        type: actionTypes.SET_MAIN_USER,
        payload: user,
      });
      history.push("/");
    }
  };
  return (
    <div className="whatsapp_login">
      <WhatsappLogo />
      <div className="whatsapp_login__header">
        <Button onClick={signIn} className="whatsapp_login__google">
          SignIn with <img src={google} alt="google logo"></img>
        </Button>
      </div>
    </div>
  );
};

export default Login;
