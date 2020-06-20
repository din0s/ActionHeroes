import "./UserProfile.scss";

import React, { Component } from "react";

import { Link } from "react-router-dom";
import SpinnerPage from "../spinner/SpinnerPage";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

const minCardsShown = 3;

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
        actionsAttended: minCardsShown,
        actionsSaved: minCardsShown,
        teamsOwned: minCardsShown,
        teamsFollow: minCardsShown,
      };

      showCards = (cards, count, isAction) => {
        const { t } = this.props;
        return Object.keys(cards).map((key, index) => {
          const card = cards[key];
          if (index >= count) {
            return null;
          }
          const link = `/${isAction ? "actions" : "teams"}/${card._id}`;
          const photo = card.photo
            ? `/api/images/${card.photo}`
            : isAction
            ? "/img/actionprofile/default.jpg"
            : "/img/teaminfo/default.png";

          return (
            <li key={key} className="Card">
              <Link to={link}>
                <img src={photo} alt="" />
                <div className="Card_body">
                  <h4>{card.name}</h4>
                  <p>{card.description}</p>
                  {card.categories.length > 0 && (
                    <div className="Card_categories">
                      <h4>{t("profile.categories")}:</h4>
                      <ul>
                        {card.categories.map((name) => {
                          return (
                            <li key={name}>
                              {t(`categories.${name.toLowerCase()}`)}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </Link>
            </li>
          );
        });
      };

      expandCards = (actions) => {
        const { t } = this.props;
        const actionsShown = this.state[actions];
        const available = this.props.user[actions].length;

        if (available <= minCardsShown) {
          return null;
        } else if (actionsShown > minCardsShown) {
          return (
            <p
              onClick={() =>
                this.setState({
                  [actions]: minCardsShown,
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
                  [actions]: available,
                })
              }
            >
              {t("profile.show-more")}
            </p>
          );
        }
      };

      render() {
        if (this.props.user === {}) {
          return <SpinnerPage />;
        }

        const { t, user } = this.props;
        const {
          username,
          photo,
          actionsAttended,
          actionsSaved,
          teamsFollow,
          teamsOwned,
        } = user;
        const photoSrc = photo
          ? `/api/images/${photo}`
          : "/img/profile/default.png";

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
                        this.state.actionsAttended,
                        true
                      )}
                    </ul>
                    {this.expandCards("actionsAttended")}
                    <Link to="/actions">
                      <p>{t("profile.attend")}</p>
                    </Link>
                  </section>
                  {actionsSaved.length !== 0 && (
                    <section>
                      <h3>{t("profile.saved")}</h3>
                      <ul>
                        {this.showCards(
                          actionsSaved,
                          this.state.actionsSaved,
                          true
                        )}
                      </ul>
                      {this.expandCards("actionsSaved")}
                    </section>
                  )}
                </div>
                <div
                  className={this.state.activeTab === "teams" ? "active" : ""}
                >
                  <section>
                    <h3>{t("profile.teams-member")}</h3>
                    <ul>
                      {this.showCards(
                        teamsFollow,
                        this.state.teamsFollow,
                        false
                      )}
                    </ul>
                    {this.expandCards("teamsFollow")}
                    <Link to="/teams">
                      <p>{t("profile.join")}</p>
                    </Link>
                  </section>
                  {teamsOwned.length !== 0 && (
                    <section>
                      <h3>{t("profile.teams-owned")}</h3>
                      <ul>
                        {this.showCards(
                          teamsOwned,
                          this.state.teamsOwned,
                          false
                        )}
                      </ul>
                      {this.expandCards("teamsOwned")}
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  )
);
