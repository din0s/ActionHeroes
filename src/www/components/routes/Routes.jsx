import { Route, Switch } from "react-router-dom";

import ActionInfo from "../../containers/actionprofile/ActionProfile";
import ActionsPage from "../../containers/actionspage/ActionsPage";
import ContactPage from "../../containers/contactpage/ContactPage";
import Dashboard from "../../containers/dashboard/Dashboard.jsx";
import GuestRoute from "./GuestRoute";
import LandingPage from "../../containers/landingpage/LandingPage";
import Login from "../../containers/authentication/Login";
import PrivateRoute from "./PrivateRoute";
import React from "react";
import Settings from "../../containers/settingspage/SettingsPage";
import Signup from "../../containers/authentication/Signup";
import TeamProfile from "../../containers/teamprofile/TeamProfile";
import TeamsPage from "../../containers/teamspage/TeamsPage";
import UserProfile from "../../containers/userprofile/UserProfile";

export default () => {
  return (
    <main>
      <Switch>
        <Route path="/teams/:id" children={<TeamProfile />} />
        <Route path="/teams" children={<TeamsPage />} />
        <Route path="/contact" children={<ContactPage />} />
        <Route path="/actions/:id" children={<ActionInfo />} />
        <Route path="/actions" children={<ActionsPage />} />
        <GuestRoute path="/login" redirect="/dashboard" children={<Login />} />
        <GuestRoute
          path="/signup"
          redirect="/dashboard"
          children={<Signup />}
        />
        <PrivateRoute
          path="/settings"
          redirect="/login"
          children={<Settings />}
        />
        <PrivateRoute path="/dashboard" redirect="/" children={<Dashboard />} />
        <PrivateRoute
          path="/profile"
          redirect="/login"
          children={<UserProfile />}
        />
        <GuestRoute
          exact
          path="/"
          redirect="/dashboard"
          children={<LandingPage />}
        />
      </Switch>
    </main>
  );
};
