import "./App.scss";

import { Provider as AlertProvider, positions, transitions } from "react-alert";
import { ConnectedRouter, routerMiddleware } from "connected-react-router";
import React, { Component, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { applyMiddleware, compose, createStore } from "redux";

import ActionInfo from "./containers/actionprofile/ActionProfile";
import ActionsPage from "./containers/actionspage/ActionsPage.jsx";
import AlertTemplate from "./components/alert/AlertTemplate";
import ContactPage from "./containers/contactpage/ContactPage.jsx";
import Dashboard from "./containers/dashboard/Dashboard.jsx";
import Footer from "./components/footer/Footer";
import LandingPage from "./containers/landingpage/LandingPage.jsx";
import Login from "./containers/authentication/Login.jsx";
import NavBar from "./components/navbar/NavBar";
import { Provider } from "react-redux";
import ScrollToTop from "react-router-scroll-top";
import Signup from "./containers/authentication/Signup.jsx";
import TeamProfile from "./containers/teamprofile/TeamProfile.jsx";
import TeamsPage from "./containers/teamspage/TeamsPage.jsx";
import UserProfile from "./containers/userprofile/UserProfile";
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
            <ScrollToTop>
              <AlertProvider template={AlertTemplate} {...alert_options}>
                <div className="App">
                  <NavBar />
                  <main>
                    <Switch>
                      <Route path="/login" children={<Login />} />
                      <Route path="/signup" children={<Signup />} />
                      <Route path="/teams/id" children={<TeamProfile />} />
                      <Route path="/teams" children={<TeamsPage />} />
                      <Route path="/contact" children={<ContactPage />} />
                      <Route path="/profile" children={<UserProfile />} />
                      <Route path="/actions/id" children={<ActionInfo />} />
                      <Route path="/actions" children={<ActionsPage />} />
                      <Route path="/dashboard" exact children={<Dashboard />} />
                      <Route path="/" exact children={<LandingPage />} />
                    </Switch>
                  </main>
                  <Footer />
                </div>
              </AlertProvider>
            </ScrollToTop>
          </ConnectedRouter>
        </Suspense>
      </Provider>
    );
  }
}
