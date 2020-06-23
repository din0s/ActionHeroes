import "./ActionProfile.scss";

import { Link, Redirect, withRouter } from "react-router-dom";
import React, { Component } from "react";
import { attendAction, saveAction } from "../../actions/action";

import ActionPopup from "../../components/popup/ActionPopup";
import { Parallax } from "react-parallax";
import SpinnerPage from "../spinner/SpinnerPage";
import axios from "axios";
import { connect } from "react-redux";
import { parseDate } from "../../date";
import { withTranslation } from "react-i18next";

const mapState = (state) => ({
  loggedIn: state.auth.loggedIn,
  categories: state.categories.data,
});

const mapDispatch = {
  attendAction,
  saveAction,
};

export default connect(
  mapState,
  mapDispatch
)(
  withTranslation()(
    withRouter(
      class ActionProfile extends Component {
        state = {
          id: "",
          attendees: 0,
          categories: [],
          date: undefined,
          isHost: false,
          location: {},
          name: "",
          organizer: "",
          allCategories: [],
          saves: 0,
          openModal: false,
          isHost: false,
          saved: false,
          toAttend: false,
          error: false,
        };

        setCategories = async () => {
          this.setState({
            allCategories: this.props.categories.map((c) => c.name),
          });
        };

        componentDidMount = () => {
          this.setCategories();

          const { id } = this.props.match.params;
          axios
            .get(`/api/actions/${id}`)
            .then((res) => {
              this.setState({
                ...res.data,
                id,
              });
            })
            .catch(() => {
              this.setState({ error: true });
            });
        };

        componentDidUpdate = (prevProps) => {
          if (prevProps.categories !== this.props.categories) {
            this.setCategories();
          }
        };

        handleSubmit = (endpoint, field) => {
          const url = `/api/actions/${this.state.id}/${endpoint}`;
          if (this.state[field]) {
            axios.delete(url).then(() => {
              this.setState({ [field]: false });
            });
          } else {
            axios.post(url).then(() => {
              this.setState({ [field]: true });
            });
          }
        };

        handleSave = () => {
          this.handleSubmit("save", "saved");
          this.props.saveAction(this.getActionObject(), !this.state.saved);
        };

        handleAttend = () => {
          this.handleSubmit("attend", "toAttend");
          this.props.attendAction(this.getActionObject(), !this.state.toAttend);
        };

        getActionObject = () => {
          const { id, name, description, categories, photo } = this.state;
          return { _id: id, name, description, categories, photo };
        };

        userButtons = () => {
          const { t } = this.props;
          if (this.props.loggedIn) {
            if (!this.state.toAttend) {
              return (
                <div classname="twoButtons">
                  <button
                    className="attendButton"
                    onClick={this.handleAttend}
                    children={
                      this.state.toAttend
                        ? t("actioninfo.cancel")
                        : t("actioninfo.attend")
                    }
                  />
                  <button
                    className="saveButton"
                    onClick={this.handleSave}
                    children={
                      this.state.saved
                        ? t("actioninfo.unsave")
                        : t("actioninfo.save")
                    }
                  />
                </div>
              );
            } else {
              return (
                <div classname="twoButtons">
                  <button
                    className="cancelButton"
                    onClick={this.handleAttend}
                    children={
                      this.state.toAttend
                        ? t("actioninfo.cancel")
                        : t("actioninfo.attend")
                    }
                  />
                  <button
                    className="saveButton"
                    onClick={this.handleSave}
                    children={
                      this.state.saved
                        ? t("actioninfo.unsave")
                        : t("actioninfo.save")
                    }
                  />
                </div>
              );
            }
          }
        };

        render() {
          if (this.state.error) {
            return <Redirect to="/actions/" />;
          } else if (this.state.id === "") {
            return <SpinnerPage />;
          }

          const { t } = this.props;
          const {
            id,
            allCategories,
            name,
            date,
            photo,
            location,
            description,
            attendees,
            categories,
            organizer,
          } = this.state;

          const actionPhoto = photo
            ? `/api/images/${photo}`
            : "/img/actionprofile/default.jpg";

          const organizerPhoto = organizer.photo
            ? `/api/images/${organizer.photo}`
            : "/img/teaminfo/default.png";

          const coordinates = this.state.location.coordinates;

          return (
            <div>
              <ActionPopup
                allCategories={allCategories}
                open={this.state.openModal}
                onClose={() => this.setState({ openModal: false })}
                name={name}
                description={description}
                action={`/api/actions/${id}`}
                date={date}
                location={location}
                organizer={organizer}
                checkedCategories={categories}
                title={t("actioninfo.title")}
                button={t("actioninfo.button")}
                isCreate={false}
              />
              <div className="ActionProfile">
                <div className="ActionHeader">
                  <Parallax
                    blur={{ min: 0, max: 5 }}
                    className="ActionHeader_parallax"
                    bgImage={actionPhoto}
                    bgClassName="ActionHeader_parallaxPhoto"
                    bgImageAlt="Parallax"
                    strength={300}
                  >
                    <div className="ActionHeader_infoDiv">
                      <img src={actionPhoto} alt="" />
                      <div>
                        <h1 className="clamped">{name}</h1>
                        <p>{parseDate(date, t)}</p>
                        {this.state.isHost ? (
                          <button
                            children={t("actioninfo.edit")}
                            onClick={() => this.setState({ openModal: true })}
                          />
                        ) : (
                          this.userButtons()
                        )}
                      </div>
                    </div>
                  </Parallax>
                </div>
                <div className="ActionDetails">
                  <h3>{t("actioninfo.about")}</h3>
                  <div className="ActionDetails_panel">
                    <div className="ActionDetails_infoDiv">
                      <span>
                        <img src={organizerPhoto} alt="Organizer"></img>
                        <div>
                          <h3> {organizer.name}</h3>
                          <p>{t("actioninfo.organizer")}</p>
                        </div>
                      </span>
                      <div>
                        <p className="ActionDetails_infoDiv_location clamped">
                          {location.name}
                        </p>
                        <p
                          className="ActionDetails_infoDiv_map"
                          onClick={() => {
                            window.open(
                              "https://maps.google.com?q=" +
                                `${coordinates[0]}` +
                                "," +
                                `${coordinates[1]}`
                            );
                          }}
                        >
                          {"📍  " + t("actioninfo.map")}
                        </p>
                        <p className="clamped">{description}</p>
                        <p className="Attendees">
                          {attendees + t("actioninfo.attendees")}
                        </p>
                        {categories.length > 0 && (
                          <div className="ActionDetails_infoDiv_categories">
                            <h3>{t("actioninfo.tags")}</h3>
                            <ul>
                              {categories.map((c) => {
                                const category = c.toLowerCase();
                                return (
                                  <li key={c}>{t(`categories.${category}`)}</li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/teams/${organizer._id}`}
                      className="ActionDetails_organizerDiv"
                    >
                      <img src={organizerPhoto} alt="Organizer"></img>
                      <h3 className="clamped"> {organizer.name}</h3>
                      <p>{t("actioninfo.organizer")}</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      }
    )
  )
);
