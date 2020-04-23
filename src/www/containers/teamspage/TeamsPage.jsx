import "./TeamsPage.scss";

import React, { Component } from "react";

import FilterList from "../../components/filterlist/FilterList";
import Pagination from "../../components/pagination/Pagination";
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
      const { query } = queryString.parse(this.props.location.search);
      if (query) {
        this.setState({ query });
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

    showTeam = (key, team) => {
      return (
        <li key={key}>
          <span>
            <img src={team.logo} alt="Team Logo" />
            <h3>{team.name}</h3>
          </span>
          <p>{team.description}</p>
        </li>
      );
    };

    render() {
      return (
        <div className="TeamsPage">
          <SearchBar
            action="/teams"
            value={this.state.query}
            onChange={(e) => this.setState({ query: e.target.value })}
          />
          <span>
            <FilterList
              categories={categories}
              selected={this.state.selectedCategories}
              onCheckbox={this.onCheckbox}
              onClear={() => this.setState({ selectedCategories: [] })}
              onRemove={this.removeCategory}
            />
            <Pagination
              baseName="TeamsPage_content"
              collection={teams}
              perPage={6}
              query={this.state.query.toLowerCase().trim()}
              mapFunc={this.showTeam}
              searchFilter={(team, query) =>
                team.name.toLowerCase().includes(query) ||
                team.description.toLowerCase().includes(query)
              }
              selected={this.state.selectedCategories}
            />
          </span>
        </div>
      );
    }
  }
);
