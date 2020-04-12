import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import "./UserProfile.scss";
import { Link } from "react-router-dom";

// user.actionsAttended
const actionsAttended = {
  Action1: {
    name: "ABCDE",
    description:
      "Description Description Description Description Description Description",
    categories: [{ name: "ABC" }, { name: "BCD" }],
    photo: "/img/profilePhoto.jpg"
  },
  Action2: {
    name: "ABCDE",
    description:
      "Description Description Description Description Description Description",
    categories: [{ name: "ABC" }, { name: "BCD" }],
    photo: "/img/profilePhoto.jpg"
  },
  Action3: {
    name: "ABCDE",
    description:
      "Description Description Description Description Description Description",
    categories: [{ name: "ABC" }, { name: "BCD" }],
    photo: "/img/profilePhoto.jpg"
  }
};

const mapState = state => ({
  user: state.auth.user
});

export default connect(
  mapState,
  undefined
)(
  withTranslation()(
    class UserProfile extends Component {
      state = {
        activeTab: "actions"
      };

      render() {
        const { t, user } = this.props;
        const { username, profilePhoto, bio } = user;
        const photo = profilePhoto || "/img/profilePhoto.jpg";
        const info = bio || "Bio bio bio bio bio bio bio";

        return (
          <div className="Container">
            <div className="Bio-panel">
              <img className="Profile-photo" src={photo} alt="Profile Avatar" />
              <p className="Username">{username}</p>
              <p className="Info">{info}</p>
              <Link to="/user/profile/edit">
                <button className="Edit-profile-button">
                  {t("profile.edit")}
                </button>
              </Link>
            </div>
            <div className="Panel">
              <ul className="List">
                <li
                  className={
                    this.state.activeTab === "actions" ? "Active-tab" : ""
                  }
                  onClick={() => this.setState({ activeTab: "actions" })}
                >
                  {t("actions")}
                </li>
                <li
                  className={
                    this.state.activeTab === "teams" ? "Active-tab" : ""
                  }
                  onClick={() => this.setState({ activeTab: "teams" })}
                >
                  {t("teams")}
                </li>
                <li
                  className={
                    this.state.activeTab === "categories" ? "Active-tab" : ""
                  }
                  onClick={() => this.setState({ activeTab: "categories" })}
                >
                  {t("profile.categories")}
                </li>
              </ul>
              <div className="Content">
                <div
                  className={`Actions${
                    this.state.activeTab === "actions" ? " active" : ""
                  }`}
                >
                  <div>
                    <h3>{t("profile.attended")}</h3>
                    <ul>
                      {Object.keys(actionsAttended).map(key => {
                        const action = actionsAttended[key];
                        return (
                          <li>
                            <span className="Action-card">
                              <img
                                className="Action-image"
                                src={action.photo}
                                alt=""
                              />
                              <div className="Action-body">
                                <div>
                                  <h4>{action.name}</h4>
                                  <p>{action.description}</p>
                                </div>
                                <div className="Action-categories">
                                  <h4>{t("profile.categories")}:</h4>
                                  <ul>
                                    {Object.keys(action.categories).map(
                                      cKey => {
                                        const category =
                                          action.categories[cKey];
                                        return <li>{category.name}</li>;
                                      }
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div>
                    <h3>{t("profile.organized")}</h3>
                  </div>
                </div>
                <div
                  className={`Teams${
                    this.state.activeTab === "teams" ? " active" : ""
                  }`}
                ></div>
                <div
                  className={`Categories${
                    this.state.activeTab === "categories" ? " active" : ""
                  }`}
                >
                  456
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  )
);
