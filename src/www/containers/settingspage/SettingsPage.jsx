import "./SettingsPage.scss";

import React, { Component } from "react";

import ImageUploader from "react-images-upload";
import Map from "../../components/map/Map";
import Select from "react-select";
import axios from "axios";
import { connect } from "react-redux";
import makeAnimated from "react-select/animated";
import { withAlert } from "react-alert";
import { withTranslation } from "react-i18next";

//import { Link, Redirect } from "react-router-dom";
//const favoutite = require("./favourite.json");
//const categories = require("./categories.json");

const options = [
  { value: "Category1", label: "" },
  { value: "Category2", label: "" },
  { value: "Category3", label: "" },
  { value: "Category4", label: "" },
  { value: "Category5", label: "" },
  { value: "Category6", label: "" },
  { value: "Category7", label: "" },
  { value: "Category8", label: "" },
  { value: "Category9", label: "" },
  { value: "Category10", label: "" },
  { value: "Categorυ11", label: "" },
  { value: "Category12", label: "" },
  { value: "Category13", label: "" },
  { value: "Category14", label: "" },
  { value: "Category15", label: "" },
  { value: "Category16", label: "" },
  { value: "Category17", label: "" },
  { value: "Category18", label: "" },
  { value: "Category19", label: "" },
  { value: "Category20", label: "" },
];

const categoriesList = require("./categories.json");

const favourite_categories = [
  { value: "Category1", label: "Animals" },
  { value: "Category2", label: "Children" },
];

const coordinates = { lat: 40.63666412, lng: 22.942162898 };

const animatedComponents = makeAnimated();

const mapState = (state) => ({
  user: state.auth.user,
  loggedIn: state.auth.loggedIn,
});

export default withAlert()(
  connect(
    mapState,
    undefined
  )(
    withTranslation()(
      class SettingsPage extends Component {
        state = {
          // Need to give user's backend profile settings if not first time
          activeTab: "profile",
          selectedOption: [],
          mismatch: false,
          position: coordinates,
          fc: favourite_categories, // this.formatCategories(categoriesList, favourite_categories),
          old_password: "",
          new_password: "",
          passwordConfirm: "",
          username: "",
          bio: "",
          profilePicture: "",
        };

        formatCategories = (categoriesList, options) => {
          const { t } = this.props;
          let i;
          for (i = 0; i < options.length; i++) {
            options[i].label = t(
              "categories." + Object.values(categoriesList)[i].name
            );
          }
          return options;
        };

        changeFavourites = (selectedOption) => {
          this.setState({ selectedOption });
        };

        changeTabs = (tab) => {
          this.setState({ mismatch: false });
          this.setState({ activeTab: tab });
          this.clearfields();
        };

        clearfields = () => {
          document.getElementById("profile-form").reset();
          document.getElementById("security-form").reset();
        };

        checkPassword = async (pass, confirm) => {
          this.setState({ mismatch: pass !== confirm });
        };

        setPassword = async (e) => {
          const new_password = e.target.value.trim();
          const { passwordConfirm } = this.state;
          this.setState({ new_password });
          if (passwordConfirm !== "") {
            this.checkPassword(new_password, passwordConfirm);
          }
        };

        setPasswordConfirm = async (e) => {
          const { new_password } = this.state;
          const passwordConfirm = e.target.value.trim();
          this.setState({ passwordConfirm });
          this.checkPassword(new_password, passwordConfirm);
        };

        handleResponse = (data, target) => {
          const { t, alert } = this.props;
          if (data.error) {
            alert.error(data.error);
          } else {
            alert.success(t("settings.success"));
            target.reset();
          }
        };

        updateProfile = (username, bio, coordinates, categories, target) => {
          axios
            .patch("api/users/me/profile", {
              username,
              bio,
              coordinates,
              categories,
            })
            .then((res) => this.handleResponse(res.data, target))
            .catch((err) => this.handleResponse(err.response.data, target));
        };

        submitProfile = async (event) => {
          event.preventDefault();
          const { username, bio, position, selectedOption } = this.state;
          // Parsing data
          const coordinates = [position.lat, position.lng];
          const categories = [];
          selectedOption.forEach((element) => categories.push(element.label));
          if (!this.state.mismatch) {
            event.target.reset();
            console.log(username);
            console.log(bio);
            console.log(coordinates);
            console.log(categories);
            this.updateProfile(
              username,
              bio,
              coordinates,
              categories,
              event.target
            );
          } else {
            console.log("Fail submitProfile");
          }
        };

        updatePassword = (old_password, new_password, target) => {
          axios
            .patch("api/users/me/change_password", {
              old_password,
              new_password,
            })
            .then((res) => this.handleResponse(res.data, target))
            .catch((err) => this.handleResponse(err.response.data, target));
        };

        submitPassword = async (event) => {
          event.preventDefault();
          const { old_password, new_password } = this.state;
          if (!this.state.mismatch) {
            //event.target.reset();
            console.log(old_password);
            console.log(new_password);
            this.updatePassword(old_password, new_password, event.target);
          } else {
            console.log("Fail submitPassword");
          }
        };

        updatePicture = (profilePicture, target) => {
          axios
            .put("api/users/me/photo", {
              profilePicture,
            })
            .then((res) => this.handleResponse(res.data, target))
            .catch((err) => this.handleResponse(err.response.data, target));
        };

        removePicture = async (event) => {
          event.preventDefault();
          this.updatePicture("", event.target);
          console.log("Fail removePicture");
        };

        submitPicture = async (event) => {
          event.preventDefault();
          const { profilePicture } = this.state;
          if (this.state.profilePicture !== "") {
            console.log(profilePicture);
            this.updatePicture(profilePicture, event.target);
          } else {
            console.log("Fail submitPicture");
          }
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
                    className={
                      this.state.activeTab === "profile" ? "active" : ""
                    }
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
                  className={
                    this.state.activeTab === "profile" ? " active" : ""
                  }
                >
                  <div className="first_panel">
                    <h2 className="header">{t("settings.profile")}</h2>
                    <form
                      id="profile-form"
                      method="post"
                      action="/settings/submit"
                      onSubmit={this.submitProfile}
                    >
                      <span>{t("settings.username")}</span>
                      <input
                        type="text"
                        name="username"
                        className="Username-field"
                        onChange={(e) =>
                          this.setState({ username: e.target.value.trim() })
                        }
                      />
                      <span>{t("settings.favourite_categories")}</span>
                      <Select
                        className="Select"
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={this.formatCategories(categoriesList, options)}
                        defaultValue={this.state.fc}
                        onChange={this.changeFavourites}
                      />
                      <span className="bio">{t("settings.bio")}</span>
                      <textarea
                        type="text"
                        name="bio"
                        className="Bio-field"
                        defaultValue="Hello World"
                        onChange={(e) =>
                          this.setState({ bio: e.target.value.trim() })
                        }
                      />
                      <span>{t("settings.location")}</span>
                      <Map
                        className="Map"
                        center={this.state.position}
                        zoom={13}
                        onClick={(e) => this.setState({ position: e.latlng })}
                      />
                      <input
                        type="submit"
                        className="Submit-button"
                        value={t("settings.update.profile")}
                      />
                    </form>
                  </div>
                  <div className="photo">
                    <img src="/img/fakedata/profilePhoto.png" alt="Avatar" />
                    <form
                      id="profile-picture"
                      method="post"
                      action="/settings/submit"
                      onSubmit={this.submitPicture.bind(this)}
                    >
                      <ImageUploader
                        withIcon={false}
                        buttonText={t("settings.buttonText")}
                        imgExtension={[".jpg", ".png"]}
                        label={t("settings.label")}
                        maxFileSize={5242880}
                        singleImage={true}
                        withPreview={true}
                        onChange={(pic) => {
                          this.setState({
                            profilePicture: pic,
                          });
                        }}
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
                          onClick={this.removePicture.bind(this)}
                        />
                      </span>
                    </form>
                  </div>
                  <h2 className="hidden_header">{t("settings.profile")}</h2>
                </div>
                <div
                  className={
                    this.state.activeTab === "security" ? " active" : ""
                  }
                >
                  <div className="first_panel">
                    <h2 className="header">{t("settings.security")}</h2>
                    <form
                      id="security-form"
                      method="post"
                      action="/settings/submit"
                      onSubmit={this.submitPassword}
                    >
                      <span>{t("settings.password.old")}</span>
                      <input
                        type="password"
                        name="old_password"
                        className="Password-field"
                        onChange={(e) =>
                          this.setState({ old_password: e.target.value.trim() })
                        }
                        required
                      />
                      <span>{t("settings.password.new")}</span>
                      <input
                        type="password"
                        name="new_password"
                        className="Password-field"
                        onChange={this.setPassword}
                        required
                      />
                      <span>{t("settings.password.confirm_new")}</span>
                      <input
                        type="password"
                        name="confirm_new_password"
                        className="Password-field"
                        onChange={this.setPasswordConfirm}
                        required
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
                        value={t("settings.update.password")}
                      />
                    </form>
                  </div>
                  <h2 className="hidden_header">{t("settings.security")}</h2>
                </div>
              </div>
            </div>
          );
        }
      }
    )
  )
);
