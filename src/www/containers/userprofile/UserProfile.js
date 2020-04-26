import "./UserProfile.scss";

import { Link, Redirect } from "react-router-dom";
import React, { Component } from "react";

import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

const minCardsShown = 3;

// user.actionsAttended
const actionsAttended = require("./actionsAttended.json");
const actionsOrganized = require("./actionsOrganized.json");
const teamsOwned = require("./teamsOwned.json");
const teamsFollow = require("./teamsFollow.json");

const mapState = (state) => ({
  user: state.auth.user,
  loggedIn: state.auth.loggedIn,
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
        teamsOwnedShown: 3,
        teamsMemberShown: 3,
      };

      showCards = (cards, count, link) => {
        const { t } = this.props;
        return Object.keys(cards).map((key, index) => {
          const card = cards[key];
          if (index >= count) {
            return null;
          }
          return (
            <li key={key} className="Card">
              <a href={link}>
                <img src={card.photo} alt="" />
              </a>
              <div className="Card_body">
                <a href={link}>
                  <h4>{card.name}</h4>
                </a>
                <p>{card.description}</p>
                <div className="Card_categories">
                  <h4>{t("profile.categories")}:</h4>
                  <ul>
                    {Object.keys(card.categories).map((cKey) => {
                      const category = card.categories[cKey].name.toLowerCase();
                      return <li key={cKey}>{t(`categories.${category}`)}</li>;
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
        if (!this.props.loggedIn) {
          return <Redirect to="/login" />;
        }

        const { t, user } = this.props;
        const { username, profilePhoto } = user;
        const photo = profilePhoto || "/img/fakedata/profilePhoto.png";
        const action_link = "/actions/id";
        const team_link = "/teams/id";

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
                        this.state.actionsAttended.shown,
                        action_link
                      )}
                    </ul>
                    {this.expandActions("actionsAttended")}
                  </section>
                  <section>
                    <h3>{t("profile.organized")}</h3>
                    <ul>
                      {this.showCards(
                        actionsOrganized,
                        this.state.actionsOrganized.shown,
                        action_link
                      )}
                    </ul>
                    {this.expandActions("actionsOrganized")}
                  </section>
                </div>
                <div
                  className={this.state.activeTab === "teams" ? " active" : ""}
                >
                  <section>
                    <h3>{t("profile.teams-owned")}</h3>
                    <ul>
                      {this.showCards(
                        teamsOwned,
                        this.state.teamsOwnedShown,
                        team_link
                      )}
                    </ul>
                  </section>
                  <section>
                    <h3>{t("profile.teams-member")}</h3>
                    <ul>
                      {this.showCards(
                        teamsFollow,
                        this.state.teamsMemberShown,
                        team_link
                      )}
                    </ul>
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
