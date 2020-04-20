import "./App.scss";

import { Provider as AlertProvider, positions, transitions } from "react-alert";
import { ConnectedRouter, routerMiddleware } from "connected-react-router";
import React, { Component, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { applyMiddleware, compose, createStore } from "redux";

import ActionsPage from "./containers/actionspage/ActionsPage.jsx";
import AlertTemplate from "./components/alert/AlertTemplate";
import ContactPage from "./containers/contactpage/ContactPage.jsx";
import Footer from "./components/footer/Footer";
import LandingPage from "./containers/landingpage/LandingPage";
import Login from "./containers/authentication/Login.jsx";
import NavBar from "./components/navbar/NavBar";
import UserProfile from "./containers/userprofile/UserProfile";
import { Provider } from "react-redux";
import Signup from "./containers/authentication/Signup.jsx";
import TeamsPage from "./containers/teamspage/TeamsPage.jsx";
import { createBrowserHistory } from "history";
import { createRootReducer } from "./reducers";
import { handshake } from "./actions/auth";
import thunk from "redux-thunk";

export const history = createBrowserHistory();

const store = createStore(
  createRootReducer(history),
  compose(
    applyMiddleware(routerMiddleware(history), thunk)
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

const alert_options = {
  position: positions.BOTTOM_CENTER,
  timeout: 3000,
  offset: "100px",
  transition: transitions.SCALE,
};

export default class App extends Component {
  constructor(props) {
    super(props);
    store.dispatch(handshake());
  }

  render() {
    return (
      // TODO: loading fallback?
      <Provider store={store}>
        <Suspense fallback="">
          <ConnectedRouter history={history}>
            <AlertProvider template={AlertTemplate} {...alert_options}>
              <div className="App">
                <NavBar />
                <main>
                  <Switch>
                    <Route path="/login" children={<Login />} />
                    <Route path="/signup" children={<Signup />} />
                    <Route path="/teams" children={<TeamsPage />} />
                    <Route path="/contact" children={<ContactPage />} />
                    <Route path="/profile" children={<UserProfile />} />
                    <Route path="/" exact children={<LandingPage />} />
                    <Route path="/actions" children={<ActionsPage />} />
                  </Switch>
                </main>
                <Footer />
              </div>
            </AlertProvider>
          </ConnectedRouter>
        </Suspense>
      </Provider>
    );
  }
}
