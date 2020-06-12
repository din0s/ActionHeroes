import "./ActionCard.scss";

import React, { Component } from "react";

import { parseDate } from "../../date";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const action = require("./action.json");

export default withTranslation()(
  class ActionCard extends Component {
    render() {
      const { t } = this.props;
      return (
        <Link to="/actions/id">
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
                  {" " + action.location.name} • {parseDate(action.date, t)}
                </h2>
                {/* <h3>{action.organizer.teamId.name}</h3> */}
                <p>{action.description}</p>
              </div>
              <div className="Card_categories">
                <h1>{t("actioncard.categories")}:</h1>
                <ul>
                  {Object.keys(action.categories).map((cKey) => {
                    return (
                      <li key={cKey}>{`${t(
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
        </Link>
      );
    }
  }
);
