import "./App.scss";

import { ConnectedRouter, routerMiddleware } from "connected-react-router";
import React, { Component, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { applyMiddleware, compose, createStore } from "redux";

import ContactPage from "./components/contactpage/ContactPage.jsx";
import Footer from "./components/footer/Footer";
import Login from "./containers/authentication/Login.jsx";
import NavBar from "./components/navbar/NavBar";
import { Provider } from "react-redux";
import Signup from "./containers/authentication/Signup.jsx";
import { createBrowserHistory } from "history";
import { createRootReducer } from "./reducers";
import { handshake } from "./actions/auth";
import thunk from "redux-thunk";

export const history = createBrowserHistory();

const store = createStore(
  createRootReducer(history),
  compose(
    applyMiddleware(routerMiddleware(history), thunk),
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

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
            <div className="App">
              <NavBar />
              <main>              
                <Switch>                                   
                  <Route path="/login" children={<Login />} />
                  <Route path="/signup" children={<Signup />} />
                  <Route path="/contact" children={<ContactPage />} /> 
                  {/*<Route path="/actions" children={<ContactPage2 />} /> */}
                  <Route path="/" children="Hello" />
                </Switch>
              </main>
              <Footer />
            </div>
          </ConnectedRouter>
        </Suspense>
      </Provider>
    );
  }
}
