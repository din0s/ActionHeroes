import "./ActionCard.scss";

import React, { Component } from "react";
import { withTranslation } from "react-i18next";

const action = require("./action.json");

export default withTranslation()(
  class ActionCard extends Component {
    parseDate = (date) => {
      const { t } = this.props;
      const d = new Date(date);
      const day = t("date.day." + d.getDay());
      const month = t("date.month." + d.getMonth());

      return `${day}, ${d.getDate()} ${month} ${d.getFullYear()}, 
      ${d.getUTCHours()}:${d.getUTCMinutes()}`;
    };

    render() {
      const { t } = this.props;
      return (
        <li className="Card">
          <img src={action.photo} alt="" />
          <div className="Card_body">
            <img src={action.photo} alt="" />
            <div className="Card_body_container">
              <h1>{action.name}</h1>
              <h2>
                <span role="img" aria-label="pinpoint">
                  📍
                </span>
                {" " + action.location.name} • {this.parseDate(action.date)}
              </h2>
              {/* <h3>{action.organizer.teamId.name}</h3> */}
              <p>{action.description}</p>
            </div>
            <div className="Card_categories">
              <h1>{t("actioncard.categories")}:</h1>
              <ul>
                {Object.keys(action.categories).map((cKey) => {
                  return (
                    <li>{`${t(
                      "categories." + action.categories[cKey].name
                    )}`}</li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="Card_hiddenDesc">
            <p>{action.description}</p>
          </div>
        </li>
      );
    }
  }
);