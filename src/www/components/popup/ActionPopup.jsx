import "./Popup.scss";

import React, { Component } from "react";

import ImageUploader from "react-images-upload";
import Input from "../input/Input";
import Map from "../../components/map/Map";
import Popup from "reactjs-popup";
import { Redirect } from "react-router-dom";
import ScrollArea from "react-scrollbar";
import Selector from "../../components/selector/Selector";
import axios from "axios";
import { withTranslation } from "react-i18next";
import { DateTimePicker } from "react-widgets"; // should uninstall

const jsonFile = require("./data.json");
const coordinates = { lat: 40.63666412, lng: 22.942162898 };
class ActionPopup extends Component {
  state = {
    actionName: "",
    description: "",
    actionDate: undefined, // How can i initialize Date Object?
    actionCategories: [],
    actionPicture: undefined,
    serverResponse: "",
    actionId: "",
    actionLocation: "", // Not used yet
    position: coordinates,
    actionTeam: jsonFile.teams[0], // team selection
  };

  createAction = (
    name,
    date,
    description,
    categories,
    organizer,
    location,
    photo
  ) => {
    //location(name,coordinates)
    axios
      .post("/api/actions/create", {
        name,
        date,
        description,
        categories,
        organizer,
        location,
        photo,
      })
      .then((res) => this.handleSuccess(res.data, photo))
      .catch((err) => this.handleError(err.response.data));
  };

  handleSuccess = (data, photo) => {
    const id = data._id;

    if (photo) {
      axios
        .put(`/api/actions/${id}/photo`) //Not sure about that
        .then(() =>
          this.setState({
            actionId: id,
          })
        )
        .catch((err) => this.handleError(err.response.data));
    } else {
      this.setState({
        actionId: id,
      });
    }
  };

  handleError = (data) => {
    const { t } = this.props;

    if (data.error.includes("Action name")) {
      // Should i place "Action Name"?
      this.setState({
        serverResponse: t("createaction.nameerror"),
      });
    } else if (data.error.includes("Authentication")) {
      // Do I need this authentication?
      this.setState({
        serverResponse: t("createaction.authentication"),
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
      actionName,
      actionDate,
      description,
      actionCategories,
      actionTeam,
      actionLocation, // The location is initialized in the beginning, so it can't be empty. We can either
      // remove it from here (can we really?), or force the user to input coordinates different of our initials.
      actionPicture,
    } = this.state;

    if (
      //Not sure about all these conditions
      actionName !== "" &&
      description !== "" &&
      actionDate !== "" &&
      actionTeam !== ""
    ) {
      this.setState({
        actionNameHighlight: false, //What is this?
      });
      this.createAction(
        actionName,
        actionDate,
        description,
        actionCategories,
        actionTeam,
        actionLocation,
        actionPicture
      );
    }
  };

  showTeamImg = () => {
    const { t } = this.props;
    const team = this.state.actionTeam;
    if (team) {
      return (
        <div className="TeamSelected">
          <img src={team.photo} alt="" />
          <h4 className="clamped">{team.name}</h4>
        </div>
      );
    } else {
      return <p>{t("createaction.noteam")}</p>;
    }
  };

  render() {
    const { t, categories } = this.props;
    const { actionId, position } = this.state;

    if (actionId !== "") {
      return <Redirect to={`/actions/${actionId}`} />;
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
            <h2>{t("createaction.createaction")}</h2>
            <p children={this.state.serverResponse} />
            <form
              method="post"
              action="api/actions/create"
              onSubmit={this.handleSubmit}
            >
              <ScrollArea
                className="FormArea"
                contentClassName="FormArea_content"
              >
                <Selector
                  centered="center"
                  value={<h3>{t("createaction.teams")}</h3>}
                  onChange={(opt) => this.setState({ actionTeam: opt.value })}
                  options={jsonFile.teams.map((t) => ({
                    value: t,
                    label: t.name,
                  }))}
                />
                {this.showTeamImg()}
                <Input
                  name="actionName"
                  type="text"
                  placeholder={t("createaction.actionname")}
                  onChange={(e) =>
                    this.setState({ actionName: e.target.value.trim() })
                  }
                />
                <input
                  name="actionDate"
                  type="datetime-local"
                  placeholder={t("createaction.actiondate")} // This doesn't work??
                  required
                  onChange={
                    (e) => this.setState({ actionDate: e.target.value.trim() }) //Not sure if correct
                  }
                />
                {/* this is temporary, Firefox, Safari not supported. Need to add backend things*/}

                <textarea
                  name="description"
                  required
                  type="text"
                  placeholder={t("createaction.description")}
                  onChange={(e) =>
                    this.setState({ description: e.target.value.trim() })
                  }
                ></textarea>
                <ImageUploader
                  withIcon={true}
                  buttonText={t("createaction.image")}
                  imgExtension={[".jpg", ".jpeg", ".png"]}
                  maxFileSize={5242880}
                  singleImage={true}
                  withPreview={true}
                  label={t("createaction.maxfile")}
                  onChange={(pic) => {
                    this.setState({
                      actionPicture: pic,
                    });
                  }}
                />
                <hr />
                <p>{t("createaction.location")}</p>
                <div className="FormArea_content_map">
                  <Map
                    className="Map"
                    position={position}
                    zoom={13}
                    onClick={(e) => this.setState({ position: e.latlng })}
                  />
                </div>
                <div className="FormArea_content_categories">
                  <p>{t("filterlist.categories")}</p>
                  <div className="FormArea_content_categories-list">
                    {categories.map((name) => {
                      return (
                        <label key={name}>
                          {t(`categories.${name.toLowerCase()}`)}
                          <input
                            type="checkbox"
                            onChange={(event) => {
                              if (event.target.checked) {
                                const newCategories = this.state.actionCategories.concat(
                                  name
                                );
                                this.setState({
                                  actionCategories: newCategories,
                                });
                              } else {
                                const filtered = this.state.actionCategories.filter(
                                  (c) => c !== name
                                );

                                this.setState({
                                  actionCategories: filtered,
                                });
                              }
                            }}
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
                value={t("submit")}
              />
            </form>
          </div>
        )}
      </Popup>
    );
  }
}

export default withTranslation()(ActionPopup);
