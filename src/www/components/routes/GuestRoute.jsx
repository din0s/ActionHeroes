import { Redirect, Route } from "react-router-dom";

import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

export default connect(
  (state) => ({ auth: state.auth.loggedIn }),
  undefined
)(({ auth, redirect, children, ...rest }) => {
  useTranslation(); // wait for translation to load - fixes incorrect redirect!
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          <Redirect to={{ pathname: redirect, state: { from: location } }} />
        ) : (
          children
        )
      }
    />
  );
});
