import "./UserProfile.scss";

import React, { Component } from "react";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

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
        bio: "",
        editMode: false,
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
            <li className="Card">
              <img src={card.photo} alt="" />
              <div className="Card_body">
                <h4>{card.name}</h4>
                <p>{card.description}</p>
                <div className="Card_categories">
                  <h4>{t("profile.categories")}:</h4>
                  <ul>
                    {Object.keys(card.categories).map((cKey) => {
                      const category = card.categories[cKey];
                      return <li>{category.name}</li>;
                    })}
                  </ul>
                </div>
              </div>
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

      showBio = () => {
        const { t, user } = this.props;
        if (this.state.editMode) {
          return (
            <div>
              {/*TODO: should send request to server */}
              <textarea
                placeholder={t("profile.add-bio")}
                defaultValue={user.bio}
                onChange={(e) => this.setState({ bio: e.target.value.trim() })}
                type="text"
              />
              <button
                className="UserPanel_btn-save"
                onClick={() => {
                  user.bio = this.state.bio;
                  this.setState({ editMode: false });
                }}
              >
                {t("profile.save")}
              </button>
              <button
                className="UserPanel_btn-cancel"
                onClick={() => {
                  this.setState({ editMode: false });
                }}
              >
                {t("profile.cancel")}
              </button>
            </div>
          );
        } else {
          return <p>{user.bio || t("profile.add-bio")}</p>;
        }
      };

      render() {
        const { t, user } = this.props;
        const { username, profilePhoto } = user;
        const photo = profilePhoto || "/img/profile/profilePhoto.jpg";

        return (
          <div className="ProfilePage">
            <div className="UserPanel">
              <div
                className={`UserPanel_avatarDiv${
                  this.state.editMode ? "-edit" : ""
                }`}
              >
                <img src={photo} alt="Avatar" />
                <button className="UserPanel_btn-file">
                  {t("profile.edit-avatar")}
                </button>
              </div>
              <div
                className={`UserPanel_infoDiv${
                  this.state.editMode ? "-edit" : ""
                }`}
              >
                <h2>{username}</h2>
                {this.showBio()}
                <button
                  className="UserPanel_btn-edit"
                  onClick={() =>
                    this.setState({
                      editMode: !this.state.editMode,
                    })
                  }
                >
                  {t("profile.edit")}
                </button>
              </div>
            </div>
            <div className="Container">
              <ul className="Container_tabs">
                <li
                  className={this.state.activeTab === "actions" ? "active" : ""}
                  onClick={() => this.setState({ activeTab: "actions" })}
                >
                  {t("actions")}
                </li>
                <li
                  className={this.state.activeTab === "teams" ? "active" : ""}
                  onClick={() => this.setState({ activeTab: "teams" })}
                >
                  {t("teams")}
                </li>
              </ul>
              <div className="Container_content">
                <div
                  className={
                    this.state.activeTab === "actions" ? " active" : ""
                  }
                >
                  <section>
                    <h3>{t("profile.attended")}</h3>
                    <ul>
                      {this.showCards(
                        actionsAttended,
                        this.state.actionsAttended.shown
                      )}
                    </ul>
                    {this.expandActions("actionsAttended")}
                  </section>
                  <section>
                    <h3>{t("profile.organized")}</h3>
                    <ul>
                      {this.showCards(
                        actionsAttended,
                        this.state.actionsOrganized.shown
                      )}
                    </ul>
                    {this.expandActions("actionsOrganized")}
                  </section>
                </div>
                <div
                  className={this.state.activeTab === "teams" ? " active" : ""}
                >
                  <section>
                    <ul>{this.showCards(teams, this.state.teamsShown)}</ul>
                    <Link to="/teams">
                      <p>{t("profile.join")}</p>
                    </Link>
                  </section>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  )
);
