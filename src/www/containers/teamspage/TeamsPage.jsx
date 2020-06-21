import "./TeamsPage.scss";

import { Link, withRouter } from "react-router-dom";
import React, { Component } from "react";

import FilterList from "../../components/filterlist/FilterList";
import Loader from "../../components/loader/Loader";
import Pagination from "../../components/pagination/Pagination";
import SearchBar from "../../components/searchbar/SearchBar";
import TeamPopup from "../../components/popup/TeamPopup";
import axios from "axios";
import { connect } from "react-redux";
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
      class TeamsPage extends Component {
        state = {
          categories: [],
          selectedCategories: [],
          query: "",
          openModal: false,
          loaded: false,
          teams: [],
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

          axios.get("/api/teams/").then((res) => {
            this.setState({ teams: res.data, loaded: true });
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

        showTeam = (team) => {
          const { _id, name, description, photo } = team;
          const photoSrc = photo
            ? `/api/images/${photo}`
            : "/img/teaminfo/default.png";

          return (
            <li key={team._id}>
              <span>
                <Link to={`/teams/${_id}`}>
                  <img src={photoSrc} alt="Team Logo" />
                </Link>
                <Link to={`/teams/${_id}`}>
                  <h3 className="clamped">{name}</h3>
                </Link>
              </span>
              <p className="clamped">{description}</p>
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
                open={this.state.openModal}
                onClose={() => this.setState({ openModal: false })}
                checkedCategories={[]}
                title={t("createteam.createteam")}
                button={t("submit")}
                method={"post"}
                action={"/api/teams/create"}
                isCreate={true}
              />
              <div className={"TeamsPage"}>
                <div>
                  <SearchBar
                    action="/teams"
                    value={this.state.query}
                    onChange={(e) => this.setState({ query: e.target.value })}
                  />
                  <button
                    className="PopupTrigger"
                    children={t("createteam.create")}
                    onClick={() => this.setState({ openModal: true })}
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
                  {this.state.loaded ? (
                    <Pagination
                      baseName="TeamsPage_content"
                      collection={this.state.teams}
                      perPage={6}
                      query={this.state.query.toLowerCase().trim()}
                      mapFunc={this.showTeam}
                      searchFilter={(team, query) =>
                        team.name.toLowerCase().includes(query) ||
                        team.description.toLowerCase().includes(query)
                      }
                      selected={this.state.selectedCategories}
                    />
                  ) : (
                    <span className="TeamsPage_content" children={<Loader />} />
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
