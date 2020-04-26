import "./TeamProfile.scss";

import React, { Component } from "react";

import ActionCard from "../../components/actioncard/ActionCard";
import { parseDate } from "../../date";
import { withTranslation } from "react-i18next";

const team = require("./team.json");

export default withTranslation()(
  class TeamProfile extends Component {
    state = {
      followed: false,
      totalmembers: team.followers.length,
    };

    render() {
      const { t } = this.props;
      return (
        <div className="TeamProfile">
          <section className="TopPanel">
            <span className="TopPanel_info">
              <img alt="Team Logo" src="/img/fakedata/acm.png" />
              <div>
                <img alt="Team Logo" src="/img/fakedata/acm.png" />
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
              <h1>{parseDate(team.dateCreated, this.props)}</h1>
            </div>

            <div className="MidPanel_categories">
              <h1>{t("teaminfo.categories")}:</h1>
              <ul>
                {Object.keys(team.categories).map((cKey) => {
                  const category = team.categories[cKey].name;
                  return <li key={cKey}>{t(`categories.${category}`)}</li>;
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
                {t("teaminfo.createdon")}:{" "}
                {parseDate(team.dateCreated, this.props)}
              </h1>
              <hr />
              <h1>{t("teaminfo.categories")}:</h1>
              <ul>
                {Object.keys(team.categories).map((cKey) => {
                  return (
                    <li key={cKey}>{`${t(
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
                <h1>{parseDate(team.dateCreated, this.props)}</h1>
              </div>

              <div className="LeftSide_categories">
                <h1>{t("teaminfo.categories")}:</h1>
                <ul>
                  {Object.keys(team.categories).map((cKey) => {
                    return (
                      <li key={cKey}>{`${t(
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
