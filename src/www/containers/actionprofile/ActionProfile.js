import "./ActionProfile.scss";

import React, { Component } from "react";

import { withTranslation } from "react-i18next";
import { Parallax } from "react-parallax";

const action = require("./action.json");
const coordinates = action.location.coordinates;

export default withTranslation()(
  class ActionProfile extends Component {
    state = {
      saved: false,
      toAttend: false,
    };

    parseDate = (date) => {
      const { t } = this.props;
      const d = new Date(date);
      const day = t("actioninfo.date.day." + d.getDay());
      const month = t("actioninfo.date.month." + d.getMonth());

      return `${day}, ${d.getDate()} ${month} ${d.getFullYear()}, 
        ${d.getUTCHours()}:${d.getUTCMinutes()}`;
    };

    render() {
      const { t } = this.props;
      const organizer = action.organizer.userId
        ? action.organizer.userId.name
        : action.organizer.teamId.name;
      const organizerPhoto = action.organizer.userId
        ? action.organizer.userId.photo
        : action.organizer.teamId.photo;

      return (
        <div className="ActionProfile">
          <div className="ActionHeader">
            <Parallax
              blur={{ min: 0, max: 5 }}
              className="ActionHeader_parallax"
              bgImage={action.photo}
              bgClassName="ActionHeader_parallaxPhoto"
              bgImageAlt="Parallax"
              strength={300}
            >
              <div className="ActionHeader_infoDiv">
                <img src={action.photo} alt="" />
                <div>
                  <h1>{action.name}</h1>
                  <p>{this.parseDate(action.date)}</p>
                  <button
                    onClick={() => this.setState({ saved: !this.state.saved })}
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
                    <h3> {organizer}</h3>
                    <p>{t("actioninfo.organizer")}</p>
                  </div>
                </span>
                <div>
                  <p className="ActionDetails_infoDiv_location">
                    {action.location.name}
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
                  <p>{action.description}</p>
                  <p className="Attendees">
                    {action.attendees.length + t("actioninfo.attendees")}
                  </p>
                  <div className="ActionDetails_infoDiv_categories">
                    <h3>{t("actioninfo.tags")}</h3>
                    <ul>
                      {Object.keys(action.categories).map((cKey) => {
                        return <li>{action.categories[cKey].name}</li>;
                      })}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="ActionDetails_organizerDiv">
                <img src={organizerPhoto} alt="Organizer"></img>
                <h3>{t("actioninfo.organizer")}</h3>
                <p> {organizer}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
);
