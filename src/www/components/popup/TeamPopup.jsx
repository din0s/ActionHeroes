import "./Popup.scss";

import React, { Component } from "react";

import ImageUploader from "react-images-upload";
import Input from "../input/Input";
import Popup from "reactjs-popup";
import { Redirect } from "react-router-dom";
import ScrollArea from "react-scrollbar";
import axios from "axios";
import { withTranslation } from "react-i18next";

class TeamPopup extends Component {
  state = {
    teamName: "",
    description: "",
    teamCategories: [],
    teamPicture: undefined,
    serverResponse: "",
    teamId: "",
  };

  createTeam = (name, description, categories, photo) => {
    axios
      .post("/api/teams/create", {
        name,
        description,
        categories,
      })
      .then((res) => this.handleSuccess(res.data, photo))
      .catch((err) => this.handleError(err.response.data));
  };

  handleSuccess = (data, photo) => {
    const id = data._id;

    if (photo) {
      axios
        .put(`/api/teams/${id}/photo`)
        .then(() =>
          this.setState({
            teamId: id,
          })
        )
        .catch((err) => this.handleError(err.response.data));
    } else {
      this.setState({
        teamId: id,
      });
    }
  };

  handleError = (data) => {
    const { t } = this.props;

    if (data.error.includes("Team name")) {
      this.setState({
        serverResponse: t("createteam.nameerror"),
      });
    } else if (data.error.includes("Authentication")) {
      this.setState({
        serverResponse: t("createteam.authentication"),
      });
    } else {
      this.setState({
        serverResponse: data.error,
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

  onCheckbox = (event, name) => {
    if (event.target.checked) {
      const categories = this.state.teamCategories.concat(name);
      this.setState({
        teamCategories: categories,
      });
    } else {
      const filtered = this.state.teamCategories.filter((c) => c !== name);

      this.setState({
        teamCategories: filtered,
      });
    }
  };

  reset = () => {
    this.props.onClose();
    this.setState({
      teamName: "",
      description: "",
      teamCategories: [],
      teamPicture: undefined,
    });
  };

  render() {
    const { t, categories } = this.props;
    const { teamId } = this.state;

    if (teamId !== "") {
      return <Redirect to={`/teams/${teamId}`} />;
    }

    return (
      <Popup
        open={this.props.open}
        onClose={this.reset}
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
                  imgExtension={[".jpg", ".jpeg", ".png"]}
                  maxFileSize={5242880}
                  singleImage={true}
                  withPreview={true}
                  label={t("createteam.maxfile")}
                  onChange={(pic) => {
                    this.setState({
                      teamPicture: pic,
                    });
                  }}
                />
                <div className="FormArea_content_categories">
                  <p>{t("filterlist.categories")}</p>
                  <div className="FormArea_content_categories-list">
                    {categories.map((name) => {
                      return (
                        <label key={name}>
                          {t(`categories.${name.toLowerCase()}`)}
                          <input type="checkbox" onChange={(event) => this.onCheckbox(event, name)} />
                          <span className="checkmark"></span>
                        </label>
                      );
                    })}
                  </div>
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

export default withTranslation()(TeamPopup);
