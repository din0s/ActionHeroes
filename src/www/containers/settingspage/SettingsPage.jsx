import "./SettingsPage.scss";

import React, { Component } from "react";
import {
  clearErrors,
  idle,
  updatePassword,
  updateProfile,
} from "../../actions/profile";

import ImageUploader from "react-images-upload";
import Map from "../../components/map/Map";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import { connect } from "react-redux";
import { withAlert } from "react-alert";
import { withTranslation } from "react-i18next";

const coordinates = { lat: 40.63666412, lng: 22.942162898 };

const mapState = (state) => ({
  updated: state.auth.updated,
  user: state.auth.user,
  error: state.auth.error,
  categories: state.categories.data,
});

const mapDispatch = {
  updatePassword,
  updateProfile,
  clearErrors,
  idle,
};

export default withAlert()(
  connect(
    mapState,
    mapDispatch
  )(
    withTranslation()(
      class SettingsPage extends Component {
        state = {
          activeTab: "profile",
          username: "",
          selectedCategories: [],
          categoriesList: [],
          bio: "",
          position: coordinates,
          profilePicture: undefined,
          previousPassword: "",
          newPassword: "",
          passwordConfirm: "",
          mismatch: false,
          redirect: false,
        };

        sorted = (categories) => {
          if (!categories) {
            return [];
          }
          return categories.sort((c1, c2) => c1.label.localeCompare(c2.label));
        }

        mapCategories = (categories) => {
          const { t } = this.props;
          if (!categories) {
            return [];
          }
          return categories.map((category) => {
            const value = category.name;
            const label = t(`categories.${value.toLowerCase()}`);
            return { label, value };
          });
        };

        remapCategories = (categories) => {
          const { t } = this.props;
          if (!categories) {
            return [];
          }
          return categories.map((category) => {
            const { value } = category;
            const label = t(`categories.${value.toLowerCase()}`);
            return { label, value };
          });
        };

        changeTab = (tab) => {
          this.setState({ mismatch: false, activeTab: tab });
          document.getElementById("profile-form").reset();
          document.getElementById("security-form").reset();
        };

        checkPassword = async (pass, confirm) => {
          this.setState({ mismatch: pass !== confirm });
        };

        setPassword = async (e) => {
          const newPassword = e.target.value.trim();
          const { passwordConfirm } = this.state;
          this.setState({ newPassword });
          if (passwordConfirm !== "") {
            this.checkPassword(newPassword, passwordConfirm);
          }
        };

        setPasswordConfirm = async (e) => {
          const { newPassword } = this.state;
          const passwordConfirm = e.target.value.trim();
          this.setState({ passwordConfirm });
          this.checkPassword(newPassword, passwordConfirm);
        };

        handleError = (error) => {
          const { alert } = this.props;
          setTimeout(() => {
            // TODO: translate error?
            alert.error(error);
            this.props.clearErrors();
          }, 0);
        };

        handleSuccess = () => {
          const { t, alert } = this.props;
          setTimeout(() => {
            // setTimeout with 0 delay seems to fix an error
            // with setting the state too fast after rendering
            this.props.idle();
            alert.success(t("settings.success"));
            this.setState({ redirect: true });
          }, 0);
        };

        submitProfile = async (event) => {
          event.preventDefault();
          if (this.state.mismatch) {
            return;
          }

          const {
            username,
            selectedCategories,
            bio,
            position,
            profilePicture,
          } = this.state;
          const coordinates = [position.lat, position.lng];
          const categories = selectedCategories.map((cat) => cat.value);

          this.props.updateProfile(
            username || this.props.user.username,
            categories,
            bio,
            coordinates,
            profilePicture
          );
        };

        submitPassword = async (event) => {
          event.preventDefault();
          if (!this.state.mismatch) {
            const { previousPassword, newPassword } = this.state;
            this.props.updatePassword(previousPassword, newPassword);
          }
        };

        componentDidMount = () => {
          this.setState({
            categoriesList: this.mapCategories(this.props.categories),
            selectedCategories: this.mapCategories(this.props.user.favoriteCategories),
          });
        };

        componentDidUpdate = (prevProps, prevState) => {
          if (this.props.t !== prevProps.t) {
            // language changed, remap categories
            this.setState({
              categoriesList: this.mapCategories(this.props.categories),
              selectedCategories: this.remapCategories(prevState.selectedCategories),
            });
          }
        };

        render() {
          if (this.state.redirect) {
            return <Redirect to="/profile" />;
          }

          if (this.props.updated) {
            this.handleSuccess();
          } else if (this.props.error) {
            this.handleError(this.props.error);
          }

          const { t, user } = this.props;
          const { username, bio, photo } = user;
          const photoSrc = photo ? `/api/img/${photo}` : "/img/profile/default.png";

          const {
            activeTab,
            categoriesList,
            selectedCategories,
            position,
            mismatch,
          } = this.state;

          return (
            <div className="SettingsPage">
              <div className="SettingsPage_navigation">
                <div className="SettingsPage_navigation_header">
                  <h2>{username}</h2>
                  <h5>{t("settings.personal_settings")}</h5>
                </div>
                <ul className="SettingsPage_navigation_tabs">
                  <li
                    className={activeTab === "profile" ? "active" : ""}
                    onClick={() => this.changeTab("profile")}
                  >
                    {t("settings.profile")}
                  </li>
                  <li
                    className={activeTab === "security" ? "active" : ""}
                    onClick={() => this.changeTab("security")}
                  >
                    {t("settings.security")}
                  </li>
                </ul>
              </div>
              <div className="SettingsPage_content">
                <div className={activeTab === "profile" ? "active" : ""}>
                  <h2>{t("settings.profile")}</h2>
                  <form
                    id="profile-form"
                    method="patch"
                    target="/api/me/profile"
                    onSubmit={this.submitProfile}
                  >
                    <span>
                      <div className="FormPanel">
                        <label>{t("settings.username")}</label>
                        <input
                          type="text"
                          name="username"
                          defaultValue={username}
                          onChange={(e) =>
                            this.setState({ username: e.target.value.trim() })
                          }
                        />
                        <label>{t("settings.favourite_categories")}</label>
                        <Select
                          className="Select"
                          closeMenuOnSelect={false}
                          isMulti
                          options={this.sorted(categoriesList)}
                          value={this.sorted(selectedCategories)}
                          onChange={(selectedCategories) => {
                            this.setState({ selectedCategories });
                          }}
                        />
                        <label>{t("settings.bio")}</label>
                        <textarea
                          type="text"
                          name="bio"
                          defaultValue={bio}
                          placeholder={t("profile.add-bio")}
                          onChange={(e) =>
                            this.setState({ bio: e.target.value.trim() })
                          }
                        />
                        <label>{t("settings.location")}</label>
                        <Map
                          className="Map"
                          position={position}
                          zoom={13}
                          onClick={(e) => this.setState({ position: e.latlng })}
                        />
                      </div>
                      <div className="PhotoPanel">
                        <img src={photoSrc} alt="Avatar" />
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
                      </div>
                    </span>
                    <input
                      type="submit"
                      className="Submit-button"
                      value={t("settings.update.profile")}
                    />
                  </form>
                </div>
                <div className={activeTab === "security" ? " active" : ""}>
                  <h2>{t("settings.security")}</h2>
                  <form
                    id="security-form"
                    method="patch"
                    target="/api/me/change_password"
                    onSubmit={this.submitPassword}
                  >
                    <label>{t("settings.password.old")}</label>
                    <input
                      type="password"
                      name="previous_password"
                      onChange={(e) =>
                        this.setState({
                          previousPassword: e.target.value.trim(),
                        })
                      }
                      required
                    />
                    <label>{t("settings.password.new")}</label>
                    <input
                      type="password"
                      name="new_password"
                      onChange={this.setPassword}
                      required
                    />
                    <label>{t("settings.password.confirm_new")}</label>
                    <input
                      type="password"
                      name="confirm_new_password"
                      onChange={this.setPasswordConfirm}
                      required
                    />
                    <p
                      className={`Password-mismatch${
                        mismatch ? "" : " hidden"
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
              </div>
            </div>
          );
        }
      }
    )
  )
);
