import "./TeamProfile.scss";

import React, { Component } from "react";
//import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import ActionCard from "../../components/actioncard/ActionCard";

const team = require("./team.json");

export default withTranslation()(
  class TeamProfile extends Component {
    state = {
      followed: false,
      totalmembers: team.followers.length,
    };

    parseDate = (date) => {
      const { t } = this.props;
      const d = new Date(date);
      const month = t("date.month." + d.getMonth());

      return `${d.getDate()} ${month} ${d.getFullYear()}`;
    };
    render() {
      const { t } = this.props;
      return (
        <div className="TeamProfile">
          <section className="TopPanel">
            <span className="TopPanel_info">
              <img alt="Team Logo" src="/img/teaminfo/acm.jpg" />
              <div>
                <img alt="Team Logo" src="/img/teaminfo/acm.jpg" />
                <h1>{team.name}</h1>
                <h2>{team.description}</h2>
              </div>
            </span>
            <h3>{team.description}</h3>
            {!this.state.followed && (
              <button
                className="TopPanel_followbutton"
                onClick={() =>
                  this.setState({
                    followed: !this.state.followed,
                    totalmembers: this.state.totalmembers + 1,
                  })
                }
                children={t("teaminfo.follow")}
              />
            )}
            {this.state.followed && (
              <button
                className="TopPanel_unfollowbutton"
                onClick={() =>
                  this.setState({
                    followed: !this.state.followed,
                    totalmembers: this.state.totalmembers - 1,
                  })
                }
                children={t("teaminfo.unfollow")}
              />
            )}
          </section>
          <section className="MidPanel">
            <div className="MidPanel_info">
              <h1>
                {t("teaminfo.members")}: {this.state.totalmembers}
              </h1>
              <h1>
                {t("teaminfo.actions")}: {Object.keys(team.actionList).length}
              </h1>
              <hr />
              <h1>{t("teaminfo.createdon")}:</h1>
              <h1>{this.parseDate(team.dateCreated)}</h1>
            </div>

            <div className="MidPanel_categories">
              <h1>{t("teaminfo.categories")}:</h1>
              <ul>
                {Object.keys(team.categories).map((cKey) => {
                  return (
                    <li>{`${t(
                      "categories." + team.categories[cKey].name
                    )}`}</li>
                  );
                })}
              </ul>
            </div>
            <div className="MidPanel_both">
              <div className="MidPanel_both_center">
                <h1>
                  {t("teaminfo.members")}: {this.state.totalmembers}
                </h1>
                <p> </p>
                <h1>
                  {t("teaminfo.actions")}: {Object.keys(team.actionList).length}
                </h1>
              </div>
              <h1>
                {t("teaminfo.createdon")}: {this.parseDate(team.dateCreated)}
              </h1>
              <hr />
              <h1>{t("teaminfo.categories")}:</h1>
              <ul>
                {Object.keys(team.categories).map((cKey) => {
                  return (
                    <li>{`${t(
                      "categories." + team.categories[cKey].name
                    )}`}</li>
                  );
                })}
              </ul>
            </div>
          </section>
          <section className="BottomPanel">
            <div className="LeftSide">
              <div className="LeftSide_info">
                <h1>
                  {t("teaminfo.members")}: {this.state.totalmembers}
                </h1>
                <h1>
                  {t("teaminfo.actions")}: {Object.keys(team.actionList).length}
                </h1>
                <hr />
                <h1>{t("teaminfo.createdon")}:</h1>
                <h1>{this.parseDate(team.dateCreated)}</h1>
              </div>

              <div className="LeftSide_categories">
                <h1>{t("teaminfo.categories")}:</h1>
                <ul>
                  {Object.keys(team.categories).map((cKey) => {
                    return (
                      <li>{`${t(
                        "categories." + team.categories[cKey].name
                      )}`}</li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="RightSide">
              <div className="RightSide_events">
                <h1>{t("teaminfo.upcoming")}:</h1>
                <ActionCard />
                <ActionCard />
                <h1>{t("teaminfo.past")}:</h1>
                <ActionCard />
                <ActionCard />
              </div>
            </div>
          </section>
        </div>
      );
    }
  }
);
