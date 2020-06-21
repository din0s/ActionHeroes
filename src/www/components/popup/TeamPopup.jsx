import "./Popup.scss";

import React, { Component } from "react";
import { deleteTeam, modifyTeam } from "../../actions/team";

import ImageUploader from "react-images-upload";
import Popup from "reactjs-popup";
import { Redirect } from "react-router-dom";
import ScrollArea from "react-scrollbar";
import axios from "axios";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

class TeamPopup extends Component {
  state = {
    teamName: this.props.name || "",
    description: this.props.description || "",
    checkedCategories: this.props.checkedCategories || [],
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
    if (name !== this.props.name) {
      fd.set("name", name);
    }
    if (description !== this.props.description) {
      fd.set("description", description);
    }
    if (categories !== this.props.checkedCategories) {
      fd.set("categories", JSON.stringify(categories));
    }
    if (photo) {
      fd.set("photo", photo);
    }
    axios
      .patch(this.props.action, fd)
      .then(() => window.location.reload())
      .catch((err) => this.handleError(err.response.data));
  };

  handleSuccess = (data) => {
    this.setState({
      teamId: data._id,
    });

    const { _id, name, description, categories, photo } = data;
    this.props.modifyTeam(
      { _id, name, description, categories, photo },
      this.props.isCreate
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
    const {
      teamName,
      description,
      checkedCategories,
      teamPicture,
    } = this.state;
    const apiCall = this.props.isCreate ? this.createTeam : this.updateTeam;
    apiCall(teamName, description, checkedCategories, teamPicture);
  };

  deleteTeam = () => {
    const { action } = this.props;
    // action := /api/teams/:id
    const id = action.substring(action.lastIndexOf("/") + 1);
    axios
      .delete(action)
      .then(() => {
        this.props.deleteTeam(id);
        this.setState({ redirect: true });
      })
      .catch((err) => this.handleError(err.response.data));
  };

  onCheckbox = (event, name) => {
    if (event.target.checked) {
      this.setState({
        checkedCategories: this.state.checkedCategories.concat(name),
      });
    } else {
      this.setState({
        checkedCategories: this.state.checkedCategories.filter(
          (c) => c !== name
        ),
      });
    }
  };

  reset = () => {
    this.props.onClose();
    this.setState({
      teamName: this.props.name || "",
      description: this.props.description || "",
      checkedCategories: this.props.checkedCategories || [],
      teamPicture: undefined,
      serverResponse: "",
    });
  };

  render() {
    const { teamId, redirect } = this.state;
    if (teamId !== "") {
      return <Redirect to={`/teams/${teamId}`} />;
    } else if (redirect) {
      return <Redirect to={`/teams/`} />;
    }

    const {
      t,
      isCreate,
      action,
      title,
      button,
      open,
      allCategories,
    } = this.props;

    const {
      teamName,
      description,
      checkedCategories,
      serverResponse,
    } = this.state;

    return (
      <Popup
        open={open}
        onClose={this.reset}
        closeOnDocumentClick={false}
        modal
      >
        {(close) => (
          <div>
            <button className="close" onClick={close}>
              &times;
            </button>
            <h2>{title}</h2>
            <p children={serverResponse} />
            <form
              method={isCreate ? "post" : "patch"}
              action={action}
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
                  defaultValue={teamName}
                  required
                  onChange={(e) =>
                    this.setState({ teamName: e.target.value.trim() })
                  }
                />
                <textarea
                  name="description"
                  required
                  type="text"
                  placeholder={t("createteam.description")}
                  defaultValue={description}
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
                    {allCategories.map((name) => {
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
              <input className="SubmitButton" type="submit" value={button} />
            </form>
            {!isCreate && (
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

const mapState = {
  modifyTeam,
  deleteTeam,
};

export default connect(undefined, mapState)(withTranslation()(TeamPopup));
