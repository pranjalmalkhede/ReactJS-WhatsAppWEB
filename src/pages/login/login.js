import React from "react";
import "./login.css";

import Button from "@material-ui/core/Button";
import firebase from "../../firebase";
import { actionTypes } from "../../utils/reducer";
import { useStateValue } from "../../utils/stateprovider";
import { useHistory } from "react-router-dom";
import google from "../../assets/google.png";
import whatsapp from "../../assets/whatsapp.png";

const Login = () => {
  const { auth, firestore } = firebase;
  const [, dispatch] = useStateValue();
  const history = useHistory();

  const signIn = async (e) => {
    e.preventDefault();
    let data = await auth().signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );

    firestore()
      .collection("whatsapp-users")
      .onSnapshot((users) => {
        // console.log(users);
        let check = users.docs.findIndex(
          (user) => user.data().email === data.user.email
        );
        let user = {
          name: data.user.displayName,
          email: data.user.email,
          avatar: data.user.photoURL,
          id: data.user.uid,
          dateCreated: new Date(),
        };
        if (check < 0) {
          firestore().collection("whatsapp-users").add(user);
        }
        if (user) {
          dispatch({
            type: actionTypes.SET_MAIN_USER,
            payload: user,
          });
          history.push("/");
        }
      });
  };
  return (
    <div className="whatsapp_login">
      <img src={whatsapp} alt="whatsapp" />
      <div className="whatsapp_login__header">
        <Button onClick={signIn} className="whatsapp_login__google">
          SignIn with <img src={google} alt="google logo"></img>
        </Button>
      </div>
    </div>
  );
};

export default Login;