import "./SettingsPage.scss";

import { Link, Redirect } from "react-router-dom";
import React, { Component } from "react";

import Map from "../../components/map/Map";
import Select from "react-select";
import { connect } from "react-redux";
import makeAnimated from "react-select/animated";
import { withTranslation } from "react-i18next";

//const favoutite = require("./favourite.json");
//const categories = require("./categories.json");

const options = [
  { value: "Category1", label: "Animals" },
  { value: "Category3", label: "Children" },
  { value: "Category2", label: "Community" },
];

const animatedComponents = makeAnimated();

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
      state = {
        activeTab: "profile",
        selectedOption: null,
      };

      submit = async (event) => {
        event.preventDefault();
      };

      handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
      };

      render() {
        console.log(this.props);
        if (!this.props.loggedIn) {
          return null; //<Redirect to="login" />;
        }

        const { t, user } = this.props;
        const { username, profilePhoto } = user;
        //const photo = profilePhoto || "/img/fakedata/profilePhoto.png";
        //const { selectedOption } = this.state;

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
                <div className="first_panel">
                  <h2>{t("settings.profile")}</h2>
                  <form
                    method="post"
                    action="/settings/submit"
                    onSubmit={this.submit}
                  >
                    <span>{t("settings.username")}</span>
                    <input
                      type="text"
                      name="username"
                      className="Username-field"
                      onChange={(e) =>
                        this.setState({ email: e.target.value.trim() })
                      }
                    />
                    <span>{t("settings.favourite_categories")}</span>
                    <Select
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      isMulti
                      options={options}
                    />
                    <span className="bio">{t("settings.bio")}</span>
                    <textarea
                      type="text"
                      name="bio"
                      className="Bio-field"
                      onChange={(e) =>
                        this.setState({ message: e.target.value.trim() })
                      }
                    />
                    <span>{t("settings.location")}</span>
                    <Map />
                    <input
                      type="submit"
                      className="Submit-button"
                      value={t("settings.update.profile")}
                    />
                  </form>
                </div>
                <div className="photo">
                  <img src="/img/fakedata/profilePhoto.png" alt="Avatar" />
                  <span className="buttons">
                    <input
                      type="submit"
                      className="Upload-button"
                      value={t("settings.photo.upload")}
                    />
                    <input
                      type="submit"
                      className="Remove-button"
                      value={t("settings.photo.remove")}
                    />
                  </span>
                </div>
              </div>
              <div
                className={this.state.activeTab === "security" ? " active" : ""}
              >
                <div className="first_panel">
                  <h2>{t("settings.security")}</h2>
                  <form
                    method="post"
                    action="/settings/submit"
                    onSubmit={this.submit}
                  >
                    <span>{t("settings.email")}</span>
                    <input
                      type="email"
                      name="email"
                      className="Email-field"
                      onChange={(e) =>
                        this.setState({ email: e.target.value.trim() })
                      }
                    />
                    <h4>{t("settings.password.change")}</h4>
                    <span>{t("settings.password.old")}</span>
                    <input
                      type="password"
                      name="old_password"
                      className="Password-field"
                      onChange={(e) =>
                        this.setState({ username: e.target.value.trim() })
                      }
                    />
                    <span>{t("settings.password.new")}</span>
                    <input
                      type="password"
                      name="new_password"
                      className="Password-field"
                      onChange={this.setPassword}
                    />
                    <span>{t("settings.password.confirm_new")}</span>
                    <input
                      type="password"
                      name="confirm_new_password"
                      className="Password-field"
                      onChange={this.setPasswordConfirm}
                    />
                    <p
                      className={`Password-mismatch${
                        this.state.mismatch ? "" : " hidden"
                      }`}
                      children={t("settings.password.mismatch")}
                    />
                    <input
                      type="submit"
                      className="Submit-button"
                      value={t("settings.update.security")}
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  )
);
