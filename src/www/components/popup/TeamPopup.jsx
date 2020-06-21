import "./Popup.scss";

import React, { Component } from "react";

import ImageUploader from "react-images-upload";
import Popup from "reactjs-popup";
import { Redirect } from "react-router-dom";
import ScrollArea from "react-scrollbar";
import axios from "axios";
import { connect } from "react-redux";
import { modifyTeam } from "../../actions/team";
import { withTranslation } from "react-i18next";

class TeamPopup extends Component {
  state = {
    teamName: "",
    description: "",
    teamCategories: [],
    checkedCategories: this.props.categories,
    teamPicture: undefined,
    serverResponse: "",
    teamId: "",
    redirect: false,
  };

  createTeam = (name, description, categories, photo) => {
    const fd = new FormData();
    fd.set("name", name);
    fd.set("description", description);
    fd.set("categories", JSON.stringify(categories));
    if (photo) {
      fd.set("photo", photo);
    }
    axios
      .post("/api/teams/create", fd)
      .then((res) => this.handleSuccess(res.data))
      .catch((err) => this.handleError(err.response.data));
  };

  updateTeam = (name, description, categories, photo) => {
    const fd = new FormData();
    console.log(this.props.action)
    fd.set("name", name);
    fd.set("description", description);
    fd.set("categories", JSON.stringify(categories));
    if (photo) {
      fd.set("photo", photo);
    }
    axios
      .patch(this.props.action, fd)
      .then((res) => window.location.reload(false))
      .catch((err) => this.handleError(err.response.data));
  };

  handleSuccess = (data) => {
    this.setState({
      teamId: data._id,
    });

    const isCreate = true; // change for edit
    const { _id, name, description, categories, photo } = data;
    this.props.modifyTeam(
      { _id, name, description, categories, photo },
      isCreate
    );
  };

  handleError = (data) => {
    const { t } = this.props;

    if (!data.error) {
      this.setState({
        serverResponse: t("somethingwrong"),
      });
    } else if (data.error.includes("Team name")) {
      this.setState({
        serverResponse: t("createteam.nameerror"),
      });
    } else if (data.error.includes("Authentication")) {
      this.setState({
        serverResponse: t("createteam.authentication"),
      });
    } else if (data.error.includes("depends on")) {
      this.setState({
        serverResponse: t("createteam.dependson"),
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
      
    } else {
      if (!this.props.isCreate) {
        console.log(teamName);
        console.log(description);
        console.log(teamCategories);
        this.updateTeam(teamName, description, teamCategories, teamPicture);
      }
    }
  };

  deleteTeam = () => {
    axios
      .delete(this.props.action)
      .then((res) => this.setState({ redirect: true }))
      .catch((err) => this.handleError(err.response.data));
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
      checkedCategories: this.props.categories,
      teamPicture: undefined,
    });
  };

  render() {
    const { t, categories, checkedCategories } = this.props;
    const { teamId, redirect } = this.state;

    if (teamId !== "") {
      return <Redirect to={`/teams/${teamId}`} />;
    }

    if (redirect) {
      return <Redirect to={`/teams/`} />;
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
            <h2>{this.props.title}</h2>
            <p children={this.state.serverResponse} />
            <form
              method={this.props.method}
              action={this.props.action}
              onSubmit={this.handleSubmit}
            >
              <ScrollArea
                className="FormArea"
                contentClassName="FormArea_content"
              >
                <input
                  name="teamName"
                  type="text"
                  placeholder={t("createteam.teamname")}
                  defaultValue={this.props.name}
                  onChange={(e) =>
                    this.setState({ teamName: e.target.value.trim() })
                  }
                />
                <textarea
                  name="description"
                  required
                  type="text"
                  placeholder={t("createteam.description")}
                  defaultValue={this.props.description}
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
                      teamPicture: pic[0],
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
                          <input
                            type="checkbox"
                            onChange={(event) => this.onCheckbox(event, name)}
                            defaultChecked={checkedCategories.includes(name)}
                          />
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
                value={this.props.button}
              />
            </form>
            {!this.props.isCreate && (
              <button
                className="DeleteButton"
                onClick={this.deleteTeam}
                children={t("createteam.delete")}
              />
            )}
          </div>
        )}
      </Popup>
    );
  }
}

export default connect(undefined, { modifyTeam })(withTranslation()(TeamPopup));
