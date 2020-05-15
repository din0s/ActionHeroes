import "./SettingsPage.scss";

import React, { Component } from "react";

import ImageUploader from "react-images-upload";
import Map from "../../components/map/Map";
import Select from "react-select";
import { connect } from "react-redux";
import makeAnimated from "react-select/animated";
import { withTranslation } from "react-i18next";

//import { Link, Redirect } from "react-router-dom"; 
//const favoutite = require("./favourite.json");
//const categories = require("./categories.json");

const options = [
  { value: "Category1", label: "Animals" },
  { value: "Category2", label: "Children" },
  { value: "Category3", label: "Community" },
  { value: "Category4", label: "Education & Literacy" },
  { value: "Category5", label: "Emergency & Safety" },
  { value: "Category6", label: "Employment" },
  { value: "Category7", label: "Health & Medicine" },
  { value: "Category8", label: "Hunger" },
  { value: "Category9", label: "Homeless" },
  { value: "Category10", label: "Nature" },
  { value: "Categorυ11", label: "Poverty" },
  { value: "Category12", label: "Science" },
  { value: "Category13", label: "Seniors" },
  { value: "Category14", label: "Special Needs" },
  { value: "Category15", label: "Sports & Recreation" },
  { value: "Category16", label: "Technology" },
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
        mismatch: false,
      };

      changeTabs = (tab) => {
        this.setState({ mismatch: false });
        this.setState({ activeTab: tab });
        this.clearfields();
        //event.target.reset();
      };

      clearfields = () => {
        document.getElementById("profile-form").reset();
        document.getElementById("security-form").reset();
      };

      submit = async (event) => {
        event.preventDefault();
        event.target.reset();
      };

      checkPassword = async (pass, confirm) => {
        this.setState({ mismatch: pass !== confirm });
      };

      setPassword = async (e) => {
        const password = e.target.value.trim();
        const { passwordConfirm } = this.state;
        this.setState({ password });
        if (passwordConfirm !== "") {
          this.checkPassword(password, passwordConfirm);
        }
      };

      setPasswordConfirm = async (e) => {
        const { password } = this.state;
        const passwordConfirm = e.target.value.trim();
        this.setState({ passwordConfirm });
        this.checkPassword(password, passwordConfirm);
      };

      render() {
        //console.log(this.props);
        if (!this.props.loggedIn) {
          return null; //<Redirect to="login" />;
        }

        const { t, user } = this.props;
        const { username } = user;
        //const { username, profilePhoto } = user;
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
                  onClick={() => this.changeTabs("profile")}
                >
                  {t("settings.profile")}
                </div>
                <div
                  className={
                    this.state.activeTab === "security" ? "active" : ""
                  }
                  onClick={() => this.changeTabs("security")}
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
                    id="profile-form"
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
                    <Select className="Select"
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
                    <Map className="Map"/>
                    <input
                      type="submit"
                      className="Submit-button"
                      value={t("settings.update.profile")}
                    />
                  </form>
                </div>
                <div className="photo">
                  <img src="/img/fakedata/profilePhoto.png" alt="Avatar" />
                  <ImageUploader
                    withIcon={false}
                    buttonText={t("settings.buttonText")}
                    imgExtension={[".jpg", ".png"]}
                    label={t("settings.label")}
                    maxFileSize={5242880}
                    singleImage={true}
                    withPreview={true}
                  />
                  <span className="buttons">
                    <input
                      type="submit"
                      className="Save-button"
                      value={t("settings.photo.save")}
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
                    id="security-form"
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
