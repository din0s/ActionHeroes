import "./TeamsPage.scss";

import React, { Component } from "react";
import Popup from "reactjs-popup";
import Input from "../../components/input/Input";
import { withAlert } from "react-alert";
import axios from "axios";
import { withTranslation } from "react-i18next";

import FilterList from "../../components/filterlist/FilterList";
import Pagination from "../../components/pagination/Pagination";
import SearchBar from "../../components/searchbar/SearchBar";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import ScrollArea from "react-scrollbar";
import ImageUploader from "react-images-upload";

const categories = require("./categories.json");
const teams = require("./teams.json");

export default withRouter(
  withAlert()(
    withTranslation()(
      class TeamsPage extends Component {
        state = {
          selectedCategories: [],
          query: "",
          teamName: "",
          description: "",
          teamNameHighlight: false,
          teamCategories: [],
          teamPicture: "",
        };

        createTeam = (name, description, categories, photo) => {
          axios
            .post("/api/teams/create", {
              name,
              description,
              categories,
              photo,
            })
            .then((res) => this.handleResponse(res.data))
            .catch((err) => this.handleResponse(err.response.data));
        };

        componentDidMount = () => {
          const { query } = queryString.parse(this.props.location.search);
          if (query) {
            this.setState({ query });
          }
        };

        handleResponse = (data) => {
          const { t, alert } = this.props;
          if (data.error) {
            if (data.error.includes("Team name")) {
              alert.error(t("createteam.nameerror"));
            } else if (data.error.includes("Authentication")) {
              alert.error(t("createteam.authentication"));
            }
          } else {
            alert.success(t("createteam.created"));
          }
        };

        handleSubmit = (event) => {
          event.preventDefault();
          const {
            teamName,
            description,
            teamCategories,
            teamPicture,
          } = this.state;

          if (teamName !== "" && description !== "") {
            this.setState({
              teamNameHighlight: false,
            });
            this.createTeam(teamName, description, teamCategories, teamPicture);
          } else {
            this.setState({
              teamΝameHighlight: true,
            });
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
          return (
            <div className="TeamsPage">
              <div>
                <SearchBar
                  action="/teams"
                  value={this.state.query}
                  onChange={(e) => this.setState({ query: e.target.value })}
                />
                <Popup
                  trigger={<button>{t("createteam.createteam")}</button>}
                  modal
                >
                  <h2>{t("createteam.createteam")}</h2>
                  <form
                    method="post"
                    action="api/teams/create"
                    onSubmit={this.handleSubmit}
                  >
                    <Input
                      name="teamName"
                      onChange={(e) =>
                        this.setState({ teamName: e.target.value.trim() })
                      }
                      shouldHighlight={this.state.teamNameHighlight}
                      type="text"
                      placeholder={t("createteam.teamname")}
                    ></Input>
                    <textarea
                      name="description"
                      onChange={(e) =>
                        this.setState({ description: e.target.value.trim() })
                      }
                      required
                      type="text"
                      placeholder={t("createteam.description")}
                    ></textarea>
                    <div>
                      <p>{t("filterlist.categories")}</p>
                      <ScrollArea>
                        {Object.keys(categories).map((c) => {
                          const category = categories[c];
                          return (
                            <label key={c}>
                              {t(`categories.${category.name.toLowerCase()}`)}
                              <input
                                type="checkbox"
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    const categories = this.state.teamCategories.concat(
                                      category.name
                                    );
                                    this.setState({
                                      teamCategories: categories,
                                    });
                                  } else {
                                    const filtered = this.state.teamCategories.filter(
                                      (c) => c !== category.name
                                    );

                                    this.setState({
                                      teamCategories: filtered,
                                    });
                                  }
                                }}
                              />
                              <span className="checkmark"></span>
                            </label>
                          );
                        })}
                      </ScrollArea>
                    </div>
                    <ImageUploader
                      withIcon={true}
                      buttonText="Choose image"
                      onChange={(pic) => {
                        this.setState({
                          teamPicture: pic,
                        });
                      }}
                      imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                      maxFileSize={5242880}
                      singleImage={true}
                      withPreview={true}
                    />
                    <input
                      className="SubmitButton"
                      type="submit"
                      value={t("submit")}
                    />
                  </form>
                </Popup>
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
          );
        }
      }
    )
  )
);
