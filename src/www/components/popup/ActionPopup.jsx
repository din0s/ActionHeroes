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
import DateTimePicker from "date-time-picker-react";

const jsonFile = require("./data.json");
const initPosition = {
  name: "Σχολή Θετικών Επιστημών (ΦΜΣ) Εθνικής Αμύνης 546 35 Θεσσαλονίκη",
  coordinates: [40.6336563, 22.956871945706702],
};
var defDate = new Date();

class ActionPopup extends Component {
  state = {
    actionName: "",
    description: "",
    actionDate: defDate,
    actionCategories: [],
    actionPicture: undefined,
    serverResponse: "",
    actionId: "",
    actionLocation: initPosition,
    actionTeam: jsonFile.teams[0], // Since implementing the API this should change
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
    const fd = new FormData();
    fd.set("name", name);
    fd.set("date", date.toISOString());
    fd.set("description", description);
    fd.set("categories", JSON.stringify(categories));
    fd.set("organizer", organizer._id);
    fd.set("location", JSON.stringify(location));
    if (photo) {
      fd.set("photo", photo);
    }
    axios
      .post("/api/actions/create", fd)
      .then((res) => this.handleSuccess(res.data))
      .catch((err) => this.handleError(err.response.data));
  };

  handleSuccess = (data) => {
    this.setState({
      actionId: data._id,
    });
  };

  handleError = (data) => {
    const { t } = this.props;

    if (data.error.includes("Action name")) {
      this.setState({
        serverResponse: t("createaction.nameerror"),
      });
    } else if (data.error.includes("Authentication")) {
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
    const { t } = this.props;
    const {
      actionName,
      actionDate,
      description,
      actionCategories,
      actionTeam,
      actionLocation,
      actionPicture,
    } = this.state;
    if (actionTeam === undefined) {
      this.setState({
        serverResponse: t("createaction.noteamerror"),
      });
    }
    if (actionName !== "" && description !== "" && actionTeam !== undefined) {
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

  onCheckbox = (event, name) => {
    if (event.target.checked) {
      const categories = this.state.actionCategories.concat(name);
      this.setState({
        actionCategories: categories,
      });
    } else {
      const filtered = this.state.actionCategories.filter((c) => c !== name);
      this.setState({
        actionCategories: filtered,
      });
    }
  };

  reset = () => {
    this.props.onClose();
    this.setState({
      actionName: "",
      description: "",
      actionDate: defDate,
      actionCategories: [],
      actionPicture: undefined,
      actionLocation: initPosition,
      actionTeam: jsonFile.teams[0], // Since implementing the API this should change
      serverResponse: "",
    });
  };

  render() {
    const { t, categories } = this.props;
    const { actionId } = this.state;

    if (actionId !== "") {
      return <Redirect to={`/actions/${actionId}`} />;
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
                    // Since implementing the API this should change
                    value: t,
                    label: t.name,
                  }))}
                />
                {this.showTeamImg()}
                <hr />
                <p>{t("createaction.date")}</p>
                <div className="FormArea_content_dateTime">
                  <DateTimePicker
                    className="Date"
                    min={defDate}
                    onChange={
                      (e) => this.setState({ actionDate: e }) //Not sure if correct
                    }
                  />
                </div>
                <Input
                  name="actionName"
                  type="text"
                  placeholder={t("createaction.actionname")}
                  onChange={(e) =>
                    this.setState({ actionName: e.target.value.trim() })
                  }
                />

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
                    center={this.state.actionLocation.coordinates}
                    zoom={15}
                    onClick={(center, address) =>
                      this.setState(
                        {
                          actionLocation: {
                            name: address,
                            coordinates: center,
                          },
                        },
                        console.log(this.state)
                      )
                    }
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
                            onChange={(event) => this.onCheckbox(event, name)}
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
