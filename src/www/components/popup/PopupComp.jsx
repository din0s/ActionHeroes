import "./PopupComp.scss";
import React, { Component } from "react";

import Input from "../../components/input/Input";
import axios from "axios";
import Popup from "reactjs-popup";
import ImageUploader from "react-images-upload";
import ScrollArea from "react-scrollbar";
import { Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";

class PopupComp extends Component {
  state = {
    teamName: "",
    description: "",
    teamCategories: [],
    teamPicture: "",
    serverResponse: "",
    redirect: false,
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

  handleResponse = (data) => {
    const { t } = this.props;
    if (data.error) {
      if (data.error.includes("Team name")) {
        this.setState({
          serverResponse: t("createteam.nameerror"),
        });
      } else if (data.error.includes("Authentication")) {
        this.setState({
          serverResponse: t("createteam.authentication"),
        });
      }
    } else {
      this.setState({
        redirect: true,
      });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { teamName, description, teamCategories, teamPicture } = this.state;

    if (teamName !== "" && description !== "") {
      this.setState({
        teamNameHighlight: false,
      });
      this.createTeam(teamName, description, teamCategories, teamPicture);
    }
  };

  render() {
    const { t, categories } = this.props;

    if (this.state.redirect) {
      // TODO change `id` to the _id sent from server
      return <Redirect to="/teams/id" />;
    }
    return (
      <Popup
        open={this.props.open}
        onClose={this.props.onClose}
        closeOnDocumentClick={false}
        modal
      >
        {(close) => (
          <div>
            <button
              className="close"
              onClick={() => {
                close();
                this.setState({
                  serverResponse: "",
                });
              }}
            >
              &times;
            </button>
            <h2>{t("createteam.createteam")}</h2>
            <p children={this.state.serverResponse} />
            <form
              method="post"
              action="api/teams/create"
              onSubmit={this.handleSubmit}
            >
              <ScrollArea
                className="FormArea"
                contentClassName="FormArea_content"
              >
                <Input
                  name="teamName"
                  type="text"
                  placeholder={t("createteam.teamname")}
                  onChange={(e) =>
                    this.setState({ teamName: e.target.value.trim() })
                  }
                />
                <textarea
                  name="description"
                  required
                  type="text"
                  placeholder={t("createteam.description")}
                  onChange={(e) =>
                    this.setState({ description: e.target.value.trim() })
                  }
                ></textarea>
                <ImageUploader
                  withIcon={true}
                  buttonText={t("createteam.image")}
                  imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                  maxFileSize={5242880}
                  singleImage={true}
                  withPreview={true}
                  label="Max file size: 5mb, accepted: jpg, gif, png, jpeg"
                  onChange={(pic) => {
                    this.setState({
                      teamPicture: pic,
                    });
                  }}
                />
                <div className="FormArea_content_categories">
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
              </ScrollArea>
              <input
                className="SubmitButton"
                type="submit"
                value={t("submit")}
              />
            </form>
          </div>
        )}
      </Popup>
    );
  }
}

export default withTranslation()(PopupComp);
