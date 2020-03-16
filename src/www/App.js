import "./App.scss";

import React, { Component, Suspense } from "react";

import Footer from "./components/footer/Footer";
import NavBar from "./components/navbar/NavBar";
import { BrowserRouter as Router } from "react-router-dom";
import { createStore } from "redux";
import reducer from "./reducers";
import { Provider } from "react-redux";

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default class App extends Component {
  render() {
    return (
      // TODO: loading fallback?
      <Provider store={store}>
        <Suspense fallback="">
          <Router>
            <div className="App">
              <NavBar />
              <main></main>
              <Footer />
            </div>
          </Router>
        </Suspense>
      </Provider>
    );
  }
}
