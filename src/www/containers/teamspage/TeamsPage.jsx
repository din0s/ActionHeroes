import "./TeamsPage.scss";

import React, { Component } from "react";

import FilterList from "../../components/filterlist/FilterList";
import Pagination from "../../components/pagination/Pagination";
import SearchBar from "../../components/searchbar/SearchBar";
import TeamPopup from "../../components/popup/TeamPopup";
import { connect } from "react-redux";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";

const teams = require("./teams.json");

const mapState = (state) => ({
  categories: state.categories.data,
});

export default connect(
  mapState,
  undefined
)(
  withRouter(
    withTranslation()(
      class TeamsPage extends Component {
        state = {
          categories: [],
          selectedCategories: [],
          query: "",
          isBlurred: false,
        };

        componentDidMount = () => {
          const { query } = queryString.parse(this.props.location.search);
          if (query) {
            this.setState({ query });
          }
          this.setState({
            categories: this.props.categories.map(c => c.name)
          })
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
          const team_link = "/teams/id";
          return (
            <li key={key}>
              <span>
                <a href={team_link}>
                  <img src={team.logo} alt="Team Logo" />
                </a>
                <a href={team_link}>
                  <h3>{team.name}</h3>
                </a>
              </span>
              <p>{team.description}</p>
            </li>
          );
        };

        render() {
          const { t } = this.props;
          const { categories } = this.state;
          return (
            <div>
              <TeamPopup
                categories={categories}
                open={this.state.isBlurred}
                onClose={() => this.setState({ isBlurred: false })}
              />
              <div
                className={`TeamsPage${this.state.isBlurred ? " blurred" : ""}`}
              >
                <div>
                  <SearchBar
                    action="/teams"
                    value={this.state.query}
                    onChange={(e) => this.setState({ query: e.target.value })}
                  />
                  <button
                    className="PopupTrigger"
                    children={t("createteam.create")}
                    onClick={() => this.setState({ isBlurred: true })}
                  />
                </div>
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
            </div>
          );
        }
      }
    )
  )
);
