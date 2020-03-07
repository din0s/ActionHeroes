import "./App.scss";

import React, { Component, Suspense } from "react";

import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router } from "react-router-dom";

export default class App extends Component {
  render() {
    return (
      // TODO: loading fallback?
      <Suspense fallback="">
        <Router>
          <div className="App">
            <Navbar />
            <main></main>
            <Footer />
          </div>
        </Router>
      </Suspense>
    );
  }
}
