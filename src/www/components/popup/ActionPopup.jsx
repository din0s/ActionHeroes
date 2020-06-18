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
//import { DateTimePicker } from "react-widgets"; // should uninstall
import DateTimePicker from "date-time-picker-react";

const jsonFile = require("./data.json");
const initPosition = { lat: 40.63666412, lng: 22.942162898 };
var defDate = new Date();

//https://stackoverflow.com/questions/822452/strip-html-from-text-javascript

function stripHtml(html) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

class ActionPopup extends Component {
  state = {
    actionName: "",
    description: "",
    actionDate: defDate,
    actionCategories: [],
    actionPicture: undefined,
    serverResponse: "",
    actionId: "",
    actionLocation: { name: "", coordinates: initPosition },
    actionTeam: jsonFile.teams[0], // Since implementing the API this should change
  };

  // componentDidMount = () => {                                             // This is copy paste from Dashboard
  //   axios.get("/api/users/me/getprofile").then((res) => {
  //     const { next, saved, teams, recommend } = res.data;
  //     this.setState({ next, saved, teams, recommend, t_select: teams[0] });
  //   });
  // };

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
    fd.set("date", date); // Like that?
    fd.set("description", description);
    fd.set("categories", JSON.stringify(categories));
    fd.set("organizer", organizer);
    fd.set("location", location); // Like that?
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
      actionTeam !== undefined //Should also add a condition for actionDate to be > than current Date (hours,mins)
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
    defDate = new Date();
    this.setState({
      actionName: "",
      description: "",
      actionDate: new Date(),
      actionCategories: [],
      actionPicture: undefined,
      actionLocation: { name: "", coordinates: initPosition },
      actionTeam: jsonFile.teams[0], // Since implementing the API this should change
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
                {console.log(this.state)}
                <Input
                  name="actionName"
                  type="text"
                  placeholder={t("createaction.actionname")}
                  onChange={(e) =>
                    this.setState({ actionName: e.target.value.trim() })
                  }
                />
                {/* <input
                  name="actionDate"
                  type="datetime-local"
                  placeholder={t("createaction.actiondate")} // This works only on not supporting browsers
                  required
                  onChange={
                    (e) => this.setState({ actionDate: e.target.value.trim() }) //Not sure if correct
                  }
                /> */}
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
                    center={this.state.actionLocation.coordinates}
                    zoom={15}
                    onClick={(center, html) =>
                      this.setState({
                        actionLocation: {
                          name: stripHtml(html),
                          coordinates: center,
                        },
                      })
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
