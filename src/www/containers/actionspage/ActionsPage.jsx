import "./ActionsPage.scss";

import { Link, withRouter } from "react-router-dom";
import React, { Component } from "react";

import ActionPopup from "../../components/popup/ActionPopup";
import FilterList from "../../components/filterlist/FilterList";
import Loader from "../../components/loader/Loader";
import Pagination from "../../components/pagination/Pagination";
import SearchBar from "../../components/searchbar/SearchBar";
import axios from "axios";
import { connect } from "react-redux";
import { parseDate } from "../../date";
import queryString from "query-string";
import { withTranslation } from "react-i18next";

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
          openModal: false,
          loaded: false,
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
            this.setState({ actions: res.data, loaded: true });
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
                  <h3 className="clamped">{name}</h3>
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
                  <p className="clamped">{description}</p>
                </div>
              </div>
              <div className="hidden_desc">
                <p className="clamped">{description}</p>
              </div>
            </li>
          );
        };

        render() {
          const { t } = this.props;
          return (
            <div>
              <ActionPopup
                allCategories={this.state.categories}
                open={this.state.openModal}
                onClose={() => this.setState({ openModal: false })}
                action={"/api/actions/create"}
                title={t("createaction.createaction")}
                button={t("submit")}
                isCreate={true}
              />
              <div className={"ActionsPage"}>
                <div>
                  <SearchBar
                    action="/actions"
                    value={this.state.query}
                    onChange={(e) => this.setState({ query: e.target.value })}
                  />
                  <button
                    className="PopupTrigger"
                    children={t("createaction.create")}
                    onClick={() => this.setState({ openModal: true })}
                  />
                </div>
                <span>
                  <FilterList
                    categories={this.state.categories}
                    selected={this.state.selectedCategories}
                    onCheckbox={this.onCheckbox}
                    onClear={() => this.setState({ selectedCategories: [] })}
                    onRemove={this.removeCategory}
                  />
                  {this.state.loaded ? (
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
                  ) : (
                    <span
                      className="ActionsPage_content"
                      children={<Loader />}
                    />
                  )}
                </span>
              </div>
            </div>
          );
        }
      }
    )
  )
);
