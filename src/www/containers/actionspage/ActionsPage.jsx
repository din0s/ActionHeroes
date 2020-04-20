import "./ActionsPage.scss";

import React, { Component } from "react";

import SearchBar from "../../components/searchbar/SearchBar";
import { withTranslation } from "react-i18next";

const cardList = require("./cards.json");
const categoriesList = require("./categories.json");
const teamsList = require("./teams.json")

export default withTranslation()(
  class ContactPage extends Component {
    showCards = (cardList) => {
      return Object.keys(cardList).map((key, index) => {
        return (
          <li>
            <a className="action_pic" href="/signup">
              <img className="pic" alt="Card icon" src={cardList[key].image} />
            </a>
            <div className="details">
              <a className="action_title" href="/signup">
                <h3>{cardList[key].name}</h3>
              </a>
              <h5>{cardList[key].desc}</h5>
            </div>
          </li>
        );
      });
    };

    showFilters = (filtersList) => {
      return Object.keys(filtersList).map((key, index) => {
        return (
          <label className="container">
            {filtersList[key].name}
            <input type="checkbox" />
            <span className="checkmark"></span>
          </label>
        );
      });
    };

    render() {
      const { t } = this.props;
      return (
        <div className="ActionsPage">
          <div className="ActionsPage_sidePanel">
            <div className="filter_panel_title">
              <h2>{t("actionspage.filters")}</h2>
            </div>
            <div className="filter_panel">
              <div className="checkbox_container">
                <h3>{t("actionspage.categories")}</h3>
                {this.showFilters(categoriesList)}
              </div>
              <div className="checkbox_container">
                <h3>{t("actionspage.teams")}</h3>
                {this.showFilters(teamsList)}
              </div>
            </div>
          </div>
          <div className="ActionsPage_mainPanel">
            <div>
              <SearchBar />
            </div>
            <div className="Cards_panel">
              {this.showCards(cardList)}
              </div>
          </div>
        </div>
      );
    }
  }
);
