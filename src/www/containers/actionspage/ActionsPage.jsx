import "./ActionsPage.scss";

import React, { Component } from "react";

import FilterList from "../../components/filterlist/FilterList";
import Pagination from "../../components/pagination/Pagination";
import SearchBar from "../../components/searchbar/SearchBar";
import queryString from "query-string";
import { withRouter } from "react-router-dom";

const actions = require("./actions.json");
const categories = require("./categories.json");

export default withRouter(
  class ActionsPage extends Component {
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

    showActions = (key, action) => {
      const action_link = "/signup";
      const location_link = "https://goo.gl/maps/JYnmWrgsEzot3Dn86";
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
            <a href={location_link} target="_blank" rel="noopener noreferrer">
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
              categories={categories}
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
);
