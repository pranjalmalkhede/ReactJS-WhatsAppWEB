import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Login from "./pages/login/login";
import UI from "./pages/ui/UI";
import {useStateValue} from './utils/stateprovider'


function App() {
  const [{mainUser}] = useStateValue()

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
