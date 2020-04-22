import "./ActionProfile.scss";

import React, { Component } from "react";

import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Parallax } from "react-parallax";

const action = require("./action.json");

export default connect(
  undefined,
  undefined
)(
  withTranslation()(
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
        ${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()}${d.getUTCMilliseconds()}`;
      };

      render() {
        const { t } = this.props;
        return (
          <div className="ActionProfile">
            <div className="ActionHeader">
              <Parallax
                blur={{ min: 0, max: 5 }}
                className="ActionHeader_parallax"
                bgImage={action.photo}
                bgImageAlt="Parallax"
                strength={250}
              >
                <div className="ActionHeader_infoDiv">
                  <img src={action.photo} alt="" />
                  <div>
                    <h1>{action.name}</h1>
                    <p>{this.parseDate(action.date)}</p>
                    <button
                      onClick={() =>
                        this.setState({ saved: !this.state.saved })
                      }
                      children={
                        this.state.saved
                          ? t("actioninfo.save")
                          : t("actioninfo.unsave")
                      }
                    />
                    <button
                      onClick={() =>
                        this.setState({ toAttend: !this.state.toAttend })
                      }
                      children={
                        this.state.toAttend
                          ? t("actioninfo.attend")
                          : t("actioninfo.cancel")
                      }
                    />
                  </div>
                </div>
              </Parallax>
            </div>
            <div className="ActionDetails">
              <h3>{t("actioninfo.about")}</h3>
              <p>{action.location.name}</p>
              <p>View on map</p>
              <p>{action.description}</p>
              <div className="ActionDetails_categories">
                <h3>{t("actioninfo.tags")}</h3>
                <ul>
                  {Object.keys(action.categories).map((cKey) => {
                    return <li>{action.categories[cKey]}</li>;
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      }
    }
  )
);
