import "./UserProfile.scss";

import React, { Component } from "react";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

const minCardsShown = 3;

const actionsAttended = require("./actionsAttended.json");
const actionsOrganized = require("./actionsOrganized.json");
const teamsOwned = require("./teamsOwned.json");
const teamsFollow = require("./teamsFollow.json");

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

      render() {
        const { t, user } = this.props;
        const { username, photo } = user;
        const photoSrc = photo
          ? `/api/images/${photo}`
          : "/img/profile/default.png";
        const action_link = "/actions/id";
        const team_link = "/teams/id";

        return (
          <div className="ProfilePage">
            <div className="UserPanel">
              <img src={photoSrc} alt="Avatar" />
              <div className={"UserPanel_infoDiv"}>
                <h2>{username}</h2>
                <p>{user.bio || t("profile.add-bio")}</p>
                <Link to="/settings">
                  <button children={t("profile.settings")} />
                </Link>
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
                  className={this.state.activeTab === "actions" ? "active" : ""}
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
                  className={this.state.activeTab === "teams" ? "active" : ""}
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
