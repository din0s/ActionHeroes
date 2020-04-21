import "./TeamsPage.scss";

import React, { Component } from "react";

import FilterList from "../../components/filterlist/FilterList";
import SearchBar from "../../components/searchbar/SearchBar";
import { withTranslation } from "react-i18next";

const categories = require("./categories.json");
const teams = require("./teams.json");

export default withTranslation()(
  class TeamsPage extends Component {
    state = {
      selectedCategories: [],
    };

    onCheckbox = (event, category) => {
      if (event.target.checked) {
        const categories = this.state.selectedCategories.concat(category);
        this.setState({ selectedCategories: categories });
      } else {
        this.removeCategory(category);
      }
    };

    removeCategory = (category) => {
      const filtered = this.state.selectedCategories.filter(
        (c) => c !== category
      );
      this.setState({
        selectedCategories: filtered,
      });
    };

    showTeams = () => {
      return Object.keys(teams)
        .filter((tm) => {
          const selected = this.state.selectedCategories;
          if (selected.length === 0) {
            return true;
          }

          const categories = teams[tm].categories;
          return selected.every((sc) =>
            Object.keys(categories).find((c) => {
              const category = categories[c];
              return sc === category;
            })
          );
        })
        .map((tm) => {
          const team = teams[tm];
          return (
            <li key={tm}>
              <span>
                <img src={team.logo} alt="Team Logo" />
                <h3>{team.name}</h3>
              </span>
              <p>{team.description}</p>
            </li>
          );
        });
    };

    render() {
      // const { t } = this.props;
      return (
        <div className="TeamsPage">
          <SearchBar action="/teams" />
          <span>
            <FilterList
              categories={categories}
              selected={this.state.selectedCategories}
              onCheckbox={this.onCheckbox}
              onClear={() => this.setState({ selectedCategories: [] })}
              onRemove={this.removeCategory}
            />
            <div className="TeamsPage_content">
              <ul className="TeamsPage_content_teams">{this.showTeams()}</ul>
            </div>
          </span>
        </div>
      );
    }
  }
);
