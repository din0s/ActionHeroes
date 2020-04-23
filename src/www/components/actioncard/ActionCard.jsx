import "./ActionCard.scss";

import React, { Component } from "react";
import { withTranslation } from "react-i18next";

const action = require("./action.json");

function add3Dots(string, limit) {
  var dots = "...";
  if (string.length > limit) {
    string = string.substring(0, limit) + dots;
  }

  return string;
}

export default withTranslation()(
  class ActionCard extends Component {
    render() {
      const { t } = this.props;
      return (
        <li className="Card">
          <img src={action.photo} alt="" />
          <div className="Card_body">
            <h1>{action.name}</h1>
            <h2>📍 Thessaloniki, Greece</h2>
            <h3>ACM AUTH Student Chapter</h3>
            <p>{add3Dots(action.description, 100)}</p>
            <div className="Card_categories">
              <h1>{t("actioncard.categories")}:</h1>
              <ul>
                {Object.keys(action.categories).map((cKey) => {
                  return <li>{action.categories[cKey].name}</li>;
                })}
              </ul>
            </div>
          </div>
        </li>
      );
    }
  }
);
