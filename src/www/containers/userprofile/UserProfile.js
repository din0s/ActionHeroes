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
  },
  Action4: {
    name: "ABCDE",
    description:
      "Description Description Description Description Description Description",
    categories: [{ name: "ABC" }, { name: "BCD" }],
    photo: "/img/profilePhoto.jpg"
  }
};

const teams = {
  Team1: {
    name: "ABCDE",
    description: "Description Description Description Description Description",
    categories: [{ name: "ABC" }, { name: "BCD" }],
    photo: "/img/teams.jpg"
  },
  Team2: {
    name: "ABCDE",
    description: "Description Description Description Description Description",
    categories: [{ name: "ABC" }, { name: "BCD" }],
    photo: "/img/teams.jpg"
  }
};

const categories = {
  Category1: {
    name: "Hey",
    photo: "/img/categories.jpg"
  },
  Category2: {
    name: "Hey",
    photo: "/img/categories.jpg"
  },
  Category3: {
    name: "Hey",
    photo: "/img/categories.jpg"
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
        activeTab: "actions",
        attendedShown: 3,
        organizedShown: 3,
        teamsShown: 3
      };

      showCards = (cards, count) => {
        const { t } = this.props;
        return Object.keys(cards).map((key, index) => {
          const card = cards[key];
          if (index >= count) {
            return null;
          }
          return (
            <li>
              <span className="Card">
                <img className="Card-image" src={card.photo} alt="" />
                <div className="Card-body">
                  <div>
                    <h4>{card.name}</h4>
                    <p>{card.description}</p>
                  </div>
                  <div className="Card-categories">
                    <h4>{t("profile.categories")}:</h4>
                    <ul>
                      {Object.keys(card.categories).map(cKey => {
                        const category = card.categories[cKey];
                        return <li>{category.name}</li>;
                      })}
                    </ul>
                  </div>
                </div>
              </span>
            </li>
          );
        });
      };

      expandActions = (actions, isAttended, minimum) => {
        const { t } = this.props;
        const count = isAttended
          ? this.state.attendedShown
          : this.state.organizedShown;
        const list = isAttended ? "attendedShown" : "organizedShown";

        if (Object.keys(actions).length < count) {
          return null;
        } else if (count <= minimum) {
          return (
            <p
              onClick={() =>
                this.setState({ [list]: Object.keys(actions).length })
              }
            >
              {t("profile.show-more")}
            </p>
          );
        } else if (count === Object.keys(actions).length) {
          return (
            <p onClick={() => this.setState({ [list]: minimum })}>
              {t("profile.show-less")}
            </p>
          );
        }
      };

      showCategories = categories => {
        return Object.keys(categories).map(key => {
          const category = categories[key];
          return (
            <li>
              <div className="Category">
                <img className="Category-image" src={category.photo} alt="" />
                <p>{category.name}</p>
              </div>
            </li>
          );
        });
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
                      {this.showCards(
                        actionsAttended,
                        this.state.attendedShown
                      )}
                    </ul>
                    <p>{this.expandActions(actionsAttended, true, 3)}</p>
                  </div>
                  <div>
                    <h3>{t("profile.organized")}</h3>
                    <ul>
                      {this.showCards(
                        actionsAttended,
                        this.state.organizedShown
                      )}
                    </ul>
                    {/*TODO: change to actionsOrganized*/}
                    <p>{this.expandActions(actionsAttended, false, 3)}</p>
                  </div>
                </div>
                <div
                  className={`Teams${
                    this.state.activeTab === "teams" ? " active" : ""
                  }`}
                >
                  <div>
                    <ul>{this.showCards(teams, this.state.teamsShown)}</ul>
                    <Link to="/teams" className="Link">
                      <p>{t("profile.join")}</p>
                    </Link>
                  </div>
                </div>
                <div
                  className={`Categories${
                    this.state.activeTab === "categories" ? " active" : ""
                  }`}
                >
                  <div>
                    <ul>{this.showCategories(categories)}</ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  )
);
