import { Redirect, Route } from "react-router-dom";

import React from "react";
import SpinnerPage from "../../containers/spinner/SpinnerPage";
import { connect } from "react-redux";

const mapState = (state) => ({
  auth: state.auth.loggedIn,
  handshake: state.auth.handshake,
});

export default connect(
  mapState,
  undefined
)(({ auth, handshake, redirect, children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return auth ? (
          children
        ) : handshake ? (
          <Redirect to={{ pathname: redirect, state: { from: location } }} />
        ) : (
          <SpinnerPage />
        );
      }}
    />
  );
});
