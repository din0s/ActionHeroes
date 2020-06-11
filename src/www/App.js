import "./App.scss";

import { Provider as AlertProvider, positions, transitions } from "react-alert";
import { ConnectedRouter, routerMiddleware } from "connected-react-router";
import React, { Component, Suspense } from "react";
import { applyMiddleware, compose, createStore } from "redux";

import AlertTemplate from "./components/alert/AlertTemplate";
import Footer from "./components/footer/Footer";
import NavBar from "./components/navbar/NavBar";
import { Provider } from "react-redux";
import Routes from "./components/routes/Routes";
import ScrollToTop from "react-router-scroll-top";
import SpinnerPage from "./containers/spinner/SpinnerPage";
import { createBrowserHistory } from "history";
import { createRootReducer } from "./reducers";
import { fetchCategories } from "./actions/categories";
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
    store.dispatch(fetchCategories());
  }

  render() {
    return (
      <Provider store={store}>
        <Suspense fallback={<SpinnerPage />}>
          <ConnectedRouter history={history}>
            <ScrollToTop>
              <AlertProvider template={AlertTemplate} {...alert_options}>
                <div className="App">
                  <NavBar />
                  <Routes />
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
