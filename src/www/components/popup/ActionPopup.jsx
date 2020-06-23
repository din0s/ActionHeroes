import "./Popup.scss";

import React, { Component } from "react";
import { deleteAction, editAction } from "../../actions/action";

import DateTimePicker from "date-time-picker-react";
import ImageUploader from "react-images-upload";
import Map from "../../components/map/Map";
import Popup from "reactjs-popup";
import { Redirect } from "react-router-dom";
import ScrollArea from "react-scrollbar";
import Selector from "../../components/selector/Selector";
import axios from "axios";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

const defDate = new Date();
const initPosition = {
  name:
    "Department of Biology and Informatics\n" +
    "Αγίου Δημητρίου\n" +
    "Thessaloniki, 546 35",
  coordinates: [40.6332769, 22.9573108],
};

class ActionPopup extends Component {
  state = {
    teams: [],
    actionName: this.props.name || "",
    description: this.props.description || "",
    checkedCategories: this.props.checkedCategories || [],
    actionDate: this.props.date || defDate,
    actionPicture: undefined,
    serverResponse: "",
    actionId: "",
    actionLocation: this.props.location || initPosition,
    actionTeam: this.props.organizer,
    redirect: false,
  };

  setTeams = () => {
    if (this.props.isCreate) {
      const { teamsOwned } = this.props.user;
      if (!teamsOwned || teamsOwned.length === 0) {
        return;
      }

      this.setState({
        teams: teamsOwned,
        actionTeam: teamsOwned[0],
      });
    }
  };

  componentDidMount = () => {
    this.setTeams();
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.user !== this.props.user) {
      this.setTeams();
    }
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
    fd.set(
      "location",
      JSON.stringify({
        ...location,
        name: location.name.replace(/\n/g, ", "),
      })
    );
    if (photo) {
      fd.set("photo", photo);
    }
    axios
      .post("/api/actions/create", fd)
      .then((res) => this.handleSuccess(res.data))
      .catch((err) => this.handleError(err.response.data));
  };

  updateAction = (
    name,
    date,
    description,
    categories,
    organizer,
    location,
    photo
  ) => {
    const fd = new FormData();
    if (date !== this.props.date) {
      fd.set("date", date.toISOString());
    }
    if (name !== this.props.name) {
      fd.set("name", name);
    }
    if (description !== this.props.description) {
      fd.set("description", description);
    }
    if (categories !== this.props.checkedCategories) {
      fd.set("categories", JSON.stringify(categories));
    }
    if (location !== this.props.location) {
      fd.set(
        "location",
        JSON.stringify({
          ...location,
          name: location.name.replace(/\n/g, ", "),
        })
      );
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
      actionId: data._id,
    });

    if (!this.props.isCreate) {
      const { _id, name, description, categories, photo } = data;
      this.props.editAction({ _id, name, description, categories, photo });
    }
  };

  handleError = (data) => {
    const { t } = this.props;

    if (!data.error) {
      this.setState({
        serverResponse: t("somethingwrong"),
      });
    } else if (data.error.includes("Action name")) {
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
      checkedCategories,
      actionTeam,
      actionLocation,
      actionPicture,
    } = this.state;
    if (actionTeam === undefined) {
      this.setState({
        serverResponse: t("createaction.noteamerror"),
      });
    }
    const apiCall = this.props.isCreate ? this.createAction : this.updateAction;
    apiCall(
      actionName,
      actionDate,
      description,
      checkedCategories,
      actionTeam,
      actionLocation,
      actionPicture
    );
  };

  deleteAction = () => {
    const { action } = this.props;
    const id = action.substring(action.lastIndexOf("/") + 1);
    axios
      .delete(action)
      .then(() => {
        this.props.deleteAction(id);
        this.setState({ redirect: true });
      })
      .catch((err) => this.handleError(err.response.data));
  };

  showTeamImg = () => {
    const { t } = this.props;
    const team = this.state.actionTeam;
    if (team) {
      const photo = team.photo
        ? `/api/images/${team.photo}`
        : "/img/teaminfo/default.png";
      return (
        <div className="TeamSelected">
          <img src={photo} alt="" />
          <h4 className="clamped">{team.name}</h4>
        </div>
      );
    } else {
      return <p>{t("createaction.noteam")}</p>;
    }
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
    const { teams } = this.state;
    this.setState({
      actionName: this.props.name || "",
      description: this.props.description || "",
      checkedCategories: this.props.checkedCategories || [],
      actionDate: this.props.date || defDate,
      actionPicture: undefined,
      actionTeam:
        this.props.organizer || teams.length > 0 ? teams[0] : undefined,
      actionId: "",
      actionLocation: this.props.location || initPosition,
      serverResponse: "",
    });
  };

  render() {
    const { actionId, redirect } = this.state;

    if (actionId !== "") {
      return <Redirect to={`/actions/${actionId}`} />;
    } else if (redirect) {
      return <Redirect to={`/actions/`} />;
    }

    const {
      t,
      isCreate,
      action,
      title,
      button,
      date,
      open,
      allCategories,
    } = this.props;

    const {
      actionName,
      description,
      checkedCategories,
      serverResponse,
      actionLocation,
      teams,
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
                  name="actionName"
                  type="text"
                  placeholder={t("createaction.actionname")}
                  defaultValue={actionName}
                  required
                  onChange={(e) =>
                    this.setState({ actionName: e.target.value.trim() })
                  }
                />

                <textarea
                  name="description"
                  required
                  type="text"
                  placeholder={t("createaction.description")}
                  defaultValue={description}
                  onChange={(e) =>
                    this.setState({ description: e.target.value.trim() })
                  }
                ></textarea>
                <div className="bigBoxNo1">
                  <div className="smallBoxLeft">
                    <Selector
                      isDisabled={!isCreate}
                      centered="center"
                      value={<h3>{t("createaction.teams")}</h3>}
                      onChange={(opt) =>
                        this.setState({ actionTeam: opt.value })
                      }
                      options={teams.map((t) => ({
                        value: t,
                        label: t.name,
                      }))}
                    />
                    {this.showTeamImg()}
                  </div>
                  <div className="smallBoxRight">
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
                          actionPicture: pic[0],
                        });
                      }}
                    />
                  </div>
                </div>
                <hr />
                <div className="bigBoxNo2">
                  <div className="smallBoxLeft">
                    <p>{t("createaction.date")}</p>
                    <div className="FormArea_content_dateTime">
                      <DateTimePicker
                        initialValue={date}
                        min={defDate}
                        onChange={(actionDate) => this.setState({ actionDate })}
                      />
                    </div>
                  </div>
                  <div className="smallBoxRight">
                    <p>{t("createaction.location")}</p>
                    <div className="FormArea_content_map">
                      <Map
                        className="Map"
                        center={actionLocation.coordinates}
                        zoom={15}
                        onClick={(center, address) =>
                          this.setState({
                            actionLocation: {
                              name: address,
                              coordinates: Object.values(center),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

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
                onClick={this.deleteAction}
                children={t("createaction.delete")}
              />
            )}
          </div>
        )}
      </Popup>
    );
  }
}

const mapState = (state) => ({
  user: state.auth.user,
});

const mapDispatch = {
  editAction,
  deleteAction,
};

export default connect(mapState, mapDispatch)(withTranslation()(ActionPopup));
