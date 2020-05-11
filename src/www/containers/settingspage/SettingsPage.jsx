import "./SettingsPage.scss";

import React, { Component } from "react";

import Input from "../../components/input/Input";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

//const favoutite = require("./favourite.json");
//const categories = require("./categories.json");

const mapState = (state) => ({
  user: state.auth.user,
  loggedIn: state.auth.loggedIn,
});

export default connect(
  mapState,
  undefined
)(
  withTranslation()(
    class SettingsPage extends Component {
      state = { activeTab: "security" };

      submit = async (event) => {
        event.preventDefault();
      };

      render() {
        //console.log(this.props);
        if (this.props.loggedIn) {
          //return <Redirect to="login" />;
        }

        const { t, user } = this.props;
        const { username, profilePhoto } = user;
        const photo = profilePhoto || "/img/fakedata/profilePhoto.png";

        return (
          <div className="SettingsPage">
            <div className="SettingsPage_navigation">
              <div className="SettingsPage_navigation_header">
                <h2>{username}</h2>
                <h5>{t("settings.personal_settings")}</h5>
              </div>
              <div className="SettingsPage_navigation_tabs">
                <div
                  className={this.state.activeTab === "profile" ? "active" : ""}
                  onClick={() => this.setState({ activeTab: "profile" })}
                >
                  {t("settings.profile")}
                </div>
                <div
                  className={
                    this.state.activeTab === "security" ? "active" : ""
                  }
                  onClick={() => this.setState({ activeTab: "security" })}
                >
                  {t("settings.security")}
                </div>
              </div>
            </div>
            <div className="SettingsPage_content">
              <div
                className={this.state.activeTab === "profile" ? " active" : ""}
              >
                <h2>{t("settings.profile")}</h2>
              </div>
              <div
                className={this.state.activeTab === "security" ? " active" : ""}
              >
                <h2>{t("settings.security")}</h2>
                <form
                  method="post"
                  action="/settings/submit"
                  onSubmit={this.submit}
                >
                  <span>{t("settings.email")}</span>
                  <Input
                    type="email"
                    name="email"
                    class="Email-field"
                    onChange={(e) =>
                      this.setState({ email: e.target.value.trim() })
                    }
                  />
                  <h4>{t("settings.password.change")}</h4>
                  <span>{t("settings.password.old")}</span>
                  <Input
                    type="password"
                    name="old_password"
                    class="Password-field"
                    onChange={(e) =>
                      this.setState({ username: e.target.value.trim() })
                    }
                  />
                  <span>{t("settings.password.new")}</span>
                  <Input
                    type="password"
                    name="new_password"
                    class="Password-field"
                    onChange={this.setPassword}
                  />
                  <span>{t("settings.password.confirm_new")}</span>
                  <Input
                    type="password"
                    name="confirm_new_password"
                    class="Password-field"
                    onChange={this.setPasswordConfirm}
                  />
                  <p
                    className={`Password-mismatch${
                      this.state.mismatch ? "" : " hidden"
                    }`}
                    children={t("auth.signup.mismatch")}
                  />
                  <input
                    type="submit"
                    className="Submit-button"
                    value={t("settings.update")}
                  />
                </form>
              </div>
            </div>
          </div>
        );
      }
    }
  )
);
