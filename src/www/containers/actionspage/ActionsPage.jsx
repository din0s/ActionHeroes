import "./ActionsPage.scss";

import React, { Component } from "react";

import FilterList from "../../components/filterlist/FilterList";
import Pagination from "../../components/pagination/Pagination";
import SearchBar from "../../components/searchbar/SearchBar";
import { connect } from "react-redux";
import queryString from "query-string";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import axios from "axios";
import { parseDate } from "../../date";

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
          actions: [],
          categories: [],
          selectedCategories: [],
          query: "",
        };

        setCategories = async () => {
          this.setState({
            categories: this.props.categories.map((c) => c.name),
          });
        };

        componentDidMount = () => {
          const { query } = queryString.parse(this.props.location.search);
          if (query) {
            this.setState({ query });
          }
          this.setCategories();

          axios.get("/api/actions/").then((res) => {
            this.setState({ actions: res.data });
          });
        };

        componentDidUpdate = (prevProps) => {
          if (prevProps.categories !== this.props.categories) {
            this.setCategories();
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

        showActions = (action) => {
          const { t } = this.props;
          const { _id, name, date, description, photo, location } = action;

          const photoSrc = photo
            ? `/api/images/${photo}`
            : "/img/actionprofile/default.jpg";

          const coords = location.coordinates;
          const location_link = `https://maps.google.com?q=${coords[0]},${coords[1]}`;

          return (
            <li key={_id}>
              <Link to={`/actions/${_id}`}>
                <img alt="Card icon" src={photoSrc} />
              </Link>
              <div>
                <Link to={`/actions/${_id}`}>
                  <h3>{name}</h3>
                </Link>
                <div className="date">
                  <span>{parseDate(date, t)}</span>
                </div>
                <a
                  href={location_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{location.name}</span>
                </a>
                <div className="description">
                  <p>{description}</p>
                </div>
              </div>
              <div className="hidden_desc">
                <p>{description}</p>
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
                  collection={this.state.actions}
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
