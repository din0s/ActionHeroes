import "./ActionProfile.scss";

import React, { Component } from "react";

import { Parallax } from "react-parallax";
import { parseDate } from "../../date";
import { withTranslation } from "react-i18next";
import axios from "axios";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import SpinnerPage from "../spinner/SpinnerPage";

const mapState = (state) => ({
  loggedIn: state.auth.loggedIn,
});

export default connect(
  mapState,
  undefined
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
          saves: 0,
          saved: false,
          toAttend: false,
          error: false,
        };

        componentDidMount = () => {
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
        };

        handleAttend = () => {
          this.handleSubmit("attend", "toAttend");
        };

        render() {
          if (this.state.error) {
            return <Redirect to="/actions/" />;
          } else if (this.state.id === "") {
            return <SpinnerPage />;
          }

          const { t } = this.props;
          const {
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
                      <h1>{name}</h1>
                      <p>{parseDate(date, t)}</p>
                      {this.props.loggedIn && (
                        <div>
                          <button
                            onClick={this.handleSave}
                            children={
                              this.state.saved
                                ? t("actioninfo.unsave")
                                : t("actioninfo.save")
                            }
                          />
                          <button
                            onClick={this.handleAttend}
                            children={
                              this.state.toAttend
                                ? t("actioninfo.cancel")
                                : t("actioninfo.attend")
                            }
                          />
                        </div>
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
                      <p className="ActionDetails_infoDiv_location">
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
                      <p>{description}</p>
                      <p className="Attendees">
                        {attendees + t("actioninfo.attendees")}
                      </p>
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
                    </div>
                  </div>
                  <div className="ActionDetails_organizerDiv">
                    <img src={organizerPhoto} alt="Organizer"></img>
                    <h3> {organizer.name}</h3>
                    <p>{t("actioninfo.organizer")}</p>
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
