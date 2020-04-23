import "./TeamsPage.scss";

import React, { Component } from "react";

import FilterList from "../../components/filterlist/FilterList";
import SearchBar from "../../components/searchbar/SearchBar";
import queryString from "query-string";
import { withRouter } from "react-router-dom";

const categories = require("./categories.json");
const teams = require("./teams.json");

export default withRouter(
  class TeamsPage extends Component {
    state = {
      selectedCategories: [],
      query: "",
    };

    componentDidMount = () => {
      const { q } = queryString.parse(this.props.location.search);
      if (q) {
        this.setState({ query: q.toLowerCase().trim() });
      }
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
      const q = this.state.query;
      return Object.keys(teams)
        .filter((tm) => {
          if (q === "") {
            return true;
          }
          const team = teams[tm];
          return (
            team.name.toLowerCase().includes(q) ||
            team.description.toLowerCase().includes(q)
          );
        })
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
      return (
        <div className="TeamsPage">
          <SearchBar
            action="/teams"
            value={this.state.query}
            onChange={(e) =>
              this.setState({ query: e.target.value.toLowerCase().trim() })
            }
          />
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
