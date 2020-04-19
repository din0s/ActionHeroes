import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./UserProfile.scss";

const minCardsShown = 3;

// user.actionsAttended
const actionsAttended = require("./actions.json");
const actionsOrganized = require("./actions.json");
const teams = require("./teams.json");

const mapState = (state) => ({
  user: state.auth.user,
});

export default connect(
  mapState,
  undefined
)(
  withTranslation()(
    class UserProfile extends Component {
      state = {
        activeTab: "actions",
        actionsAttended: {
          list: actionsAttended,
          shown: 3,
        },
        actionsOrganized: {
          list: actionsOrganized,
          shown: 3,
        },
        edcountitMode: "off",
        teamsShown: 3,
      };

      showCards = (cards, count) => {
        const { t } = this.props;
        return Object.keys(cards).map((key, index) => {
          const card = cards[key];
          if (index >= count) {
            return null;
          }
          return (
            <li>
              <span className="Card">
                <img className="Card-image" src={card.photo} alt="" />
                <div className="Card-body">
                  <h4>{card.name}</h4>
                  <p>{card.description}</p>
                  <div className="Card-categories">
                    <h4>{t("profile.categories")}:</h4>
                    <ul>
                      {Object.keys(card.categories).map((cKey) => {
                        const category = card.categories[cKey];
                        return <li>{category.name}</li>;
                      })}
                    </ul>
                  </div>
                </div>
              </span>
            </li>
          );
        });
      };

      expandActions = (actions) => {
        const { t } = this.props;
        const actionsShown = this.state[actions].shown;
        const available = Object.keys(this.state[actions].list).length;

        if (available <= minCardsShown) {
          return null;
        } else if (actionsShown > minCardsShown) {
          return (
            <p
              onClick={() =>
                this.setState({
                  [actions]: { ...this.state[actions], shown: minCardsShown },
                })
              }
            >
              {t("profile.show-less")}
            </p>
          );
        } else {
          return (
            <p
              onClick={() =>
                this.setState({
                  [actions]: { ...this.state[actions], shown: available },
                })
              }
            >
              {t("profile.show-more")}
            </p>
          );
        }
      };

      showCategories = (categories) => {
        return Object.keys(categories).map((key) => {
          const category = categories[key];
          return (
            <li>
              <div className="Category">
                <img className="Category-image" src={category.photo} alt="" />
                <p>{category.name}</p>
              </div>
            </li>
          );
        });
      };

      showBio = (initialBio) => {
        const { user, t } = this.props;
        if (this.state.editMode) {
          return (
            <div>
              {/*TODO: should send request to server */}
              <textarea
                className="Edit-bio-input"
                defaultValue={initialBio}
                onChange={(e) => (user.bio = e.target.value)}
                type="text"
              />
              <button
                className="Save-button"
                onClick={() => {
                  this.setState({ editMode: false });
                }}
              >
                {t("profile.save")}
              </button>
              <button
                className="Cancel-button"
                onClick={() => {
                  user.bio = initialBio;
                  this.setState({ editMode: false });
                }}
              >
                {t("profile.cancel")}
              </button>
            </div>
          );
        } else return <p>{initialBio}</p>;
      };

      showProfilePhoto = (photo) => {
        const { t } = this.props;
        return (
          <div>
            <img className="Photo" src={photo} alt="Profile Avatar" />
            <button className="Edit-photo-button">
              {t("profile.edit-avatar")}
            </button>
          </div>
        );
      };

      render() {
        const { t, user } = this.props;
        const { username, profilePhoto, bio } = user;
        const photo = profilePhoto || "/img/profile/profilePhoto.jpg";
        const info = bio || t("profile.add-bio");

        return (
          <div className="Profile-page">
            <div className="Bio-panel">
              <div
                className={`Profile-photo${this.state.editMode ? "-edit" : ""}`}
              >
                {this.showProfilePhoto(photo)}
              </div>
              <div>
                <p className="Username">{username}</p>
                <div className={`Info${this.state.editMode ? "-edit" : ""}`}>
                  {this.showBio(info)}
                </div>
                <button
                  className={`Edit-profile-button${
                    this.state.editMode ? "-edit" : ""
                  }`}
                  onClick={() =>
                    this.setState({
                      editMode: this.state.editMode ? false : true,
                    })
                  }
                >
                  {t("profile.edit")}
                </button>
              </div>
            </div>
            <div className="Panel">
              <ul className="List">
                <li
                  className={
                    this.state.activeTab === "actions" ? "Active-tab" : ""
                  }
                  onClick={() => this.setState({ activeTab: "actions" })}
                >
                  {t("actions")}
                </li>
                <li
                  className={
                    this.state.activeTab === "teams" ? "Active-tab" : ""
                  }
                  onClick={() => this.setState({ activeTab: "teams" })}
                >
                  {t("teams")}
                </li>
              </ul>
              <div className="Content">
                <div
                  className={`Actions${
                    this.state.activeTab === "actions" ? " active" : ""
                  }`}
                >
                  <div>
                    <h3>{t("profile.attended")}</h3>
                    <ul>
                      {this.showCards(
                        actionsAttended,
                        this.state.actionsAttended.shown
                      )}
                    </ul>
                    {this.expandActions("actionsAttended")}
                  </div>
                  <div>
                    <h3>{t("profile.organized")}</h3>
                    <ul>
                      {this.showCards(
                        actionsAttended,
                        this.state.actionsOrganized.shown
                      )}
                    </ul>
                    {this.expandActions("actionsOrganized")}
                  </div>
                </div>
                <div
                  className={`Teams${
                    this.state.activeTab === "teams" ? " active" : ""
                  }`}
                >
                  <div>
                    <ul>{this.showCards(teams, this.state.teamsShown)}</ul>
                    <Link to="/teams" className="Link">
                      <p>{t("profile.join")}</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  )
);
