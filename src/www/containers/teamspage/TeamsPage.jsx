import "./TeamsPage.scss";

import React, { Component } from "react";

import SearchBar from "../../components/searchbar/SearchBar";
import { withTranslation } from "react-i18next";

const teams = require("./teams.json");

export default withTranslation()(
  class TeamsPage extends Component {
    state = {
      selectedCategories: ["a", "b", "b", "b", "b"],
    };

    removeCategory = (category) => {
      const filtered = this.state.selectedCategories.filter(
        (c) => c !== category
      );
      this.setState({
        selectedCategories: filtered,
      });
    };

    render() {
      const { t } = this.props;
      return (
        <div className="TeamsPage">
          <div className="TeamsPage_filters">
            <div className="TeamsPage_filters_list">
              <span>
                <h2>{t("filters")}</h2>
                <p onClick={() => this.setState({ selectedCategories: [] })}>
                  {t("clear")}
                </p>
              </span>
              <ul>
                {this.state.selectedCategories.map((c) => (
                  <li>
                    <p children={c} />
                    <p onClick={() => this.removeCategory(c)} children="x" />
                  </li>
                ))}
              </ul>
            </div>
            <div className="FilterMenu">
              <h4>{t("categories")}</h4>
              {"WIP" /* TODO: make a reusable component for this */}
            </div>
          </div>
          <div className="TeamsPage_content">
            <SearchBar action="/teams" />
            <ul className="TeamsPage_content_teams">
              {Object.keys(teams).map((t) => {
                const team = teams[t];
                return (
                  <li>
                    <img src={team.logo} alt="Team Logo" />
                    <h3>{team.name}</h3>
                    <p>{team.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }
  }
);
