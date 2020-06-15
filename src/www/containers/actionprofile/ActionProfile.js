import "./ActionProfile.scss";

import React, { Component } from "react";

import { Parallax } from "react-parallax";
import { parseDate } from "../../date";
import { withTranslation } from "react-i18next";
import axios from "axios";
import { withRouter, Redirect } from "react-router-dom";

export default withTranslation()(
  withRouter(
    class ActionProfile extends Component {
      state = {
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
        axios
          .get(`/api/actions/${this.props.match.params.id}`)
          .then((res) => {
            this.setState({
              ...res.data,
            });
          })
          .catch(() => {
            this.setState({ error: true });
          });
      };

      render() {
        if (this.state.error) {
          return <Redirect to="/actions/" />;
        }

        const { t } = this.props;
        const {
          name,
          date,
          photo,
          location,
          description,
          saves,
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
                    <button
                      onClick={() =>
                        this.setState({ saved: !this.state.saved })
                      }
                      children={
                        this.state.saved
                          ? t("actioninfo.unsave")
                          : t("actioninfo.save")
                      }
                    />
                    <button
                      onClick={() =>
                        this.setState({ toAttend: !this.state.toAttend })
                      }
                      children={
                        this.state.toAttend
                          ? t("actioninfo.cancel")
                          : t("actioninfo.attend")
                      }
                    />
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
                      {attendees + saves + t("actioninfo.attendees")}
                    </p>
                    <div className="ActionDetails_infoDiv_categories">
                      <h3>{t("actioninfo.tags")}</h3>
                      <ul>
                        {categories.map((c) => {
                          const category = c.toLowerCase();
                          return <li key={c}>{t(`categories.${category}`)}</li>;
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
);
