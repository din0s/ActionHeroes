import "./ActionsPage.scss";

import React, { Component } from "react";

import FilterList from "../../components/filterlist/FilterList";
import Pagination from "../../components/pagination/Pagination";
import SearchBar from "../../components/searchbar/SearchBar";
import { connect } from "react-redux";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";

const actions = require("./actions.json");

const mapState = (state) => ({
  categories: state.categories.data,
});

export default connect(
  mapState,
  undefined
)(
  withRouter(
    withTranslation()(
      class ActionsPage extends Component {
        state = {
          categories: [],
          selectedCategories: [],
          query: "",
        };

        componentDidMount = () => {
          const { query } = queryString.parse(this.props.location.search);
          if (query) {
            this.setState({ query });
          }
          this.setState({
            categories: this.props.categories.map((c) => c.name),
          });
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

        showActions = (key, action) => {
          const action_link = "/actions/id";
          const location_link = "https://www.google.com/maps";
          return (
            <li key={key}>
              <a href={action_link}>
                <img alt="Card icon" src={action.logo} />
              </a>
              <div>
                <a href={action_link}>
                  <h3>{action.name}</h3>
                </a>
                <div className="date">
                  <span>{action.date}</span>
                </div>
                <a
                  href={location_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{action.location}</span>
                </a>
                <div className="description">
                  <p>{action.description}</p>
                </div>
              </div>
              <div className="hidden_desc">
                <p>{action.description}</p>
              </div>
            </li>
          );
        };

        render() {
          return (
            <div className="ActionsPage">
              <SearchBar
                action="/actions"
                value={this.state.query}
                onChange={(e) => this.setState({ query: e.target.value })}
              />
              <span>
                <FilterList
                  categories={this.state.categories}
                  selected={this.state.selectedCategories}
                  onCheckbox={this.onCheckbox}
                  onClear={() => this.setState({ selectedCategories: [] })}
                  onRemove={this.removeCategory}
                />
                <Pagination
                  baseName="ActionsPage_content"
                  collection={actions}
                  perPage={6}
                  query={this.state.query.toLowerCase().trim()}
                  mapFunc={this.showActions}
                  searchFilter={(actions, query) =>
                    actions.name.toLowerCase().includes(query) ||
                    actions.description.toLowerCase().includes(query)
                  }
                  selected={this.state.selectedCategories}
                />
              </span>
            </div>
          );
        }
      }
    )
  )
);
