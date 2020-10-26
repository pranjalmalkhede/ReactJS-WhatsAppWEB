import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Login from "./pages/login/login";
import UI from "./pages/ui/UI";
import { useStateValue } from "./utils/stateprovider";
import firebase from "./firebase";
import { actionTypes } from "./utils/reducer";

function App() {
  const [{ mainUser }, dispatch] = useStateValue();

  useEffect(() => {
    // will only run once when the app component loads...

    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        // the user just logged in / the user was logged in
        dispatch({
          type: actionTypes.SET_MAIN_USER,
          payload: {
            name: authUser.displayName,
            email: authUser.email,
            avatar: authUser.photoURL,
            id: authUser.uid,
          },
        });
      } else {
        // the user is logged out
        dispatch({
          type: actionTypes.SET_MAIN_USER,
          payload: null,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <div className="App">
      <div className="landing-header">
        <img className="landing-headerLogo" src={logo} alt="whatsapp logo" />
        <div className="landing-headerTitle">WhatsApp Web</div>
      </div>

      <div className="content">
        <Router>
          <Switch>
            {mainUser && <Route exact path="/" component={UI} />}
            <Route exact path="/login" component={Login} />
          </Switch>
          {!mainUser && <Redirect to="/login" />}
          {mainUser && <Redirect to="/" />}
        </Router>
      </div>
    </div>
  );
}

export default App;
