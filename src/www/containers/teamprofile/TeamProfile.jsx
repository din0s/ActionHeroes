import "./TeamProfile.scss";

import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";

import ActionCard from "../../components/actioncard/ActionCard";
import SpinnerPage from "../spinner/SpinnerPage";
import TeamPopup from "../../components/popup/TeamPopup";
import axios from "axios";
import { connect } from "react-redux";
import { followTeam } from "../../actions/team";
import { parseDate } from "../../date";
import { withTranslation } from "react-i18next";

const mapState = (state) => ({
  loggedIn: state.auth.loggedIn,
  categories: state.categories.data,
});

export default connect(mapState, { followTeam })(
  withRouter(
    withTranslation()(
      class TeamProfile extends Component {
        state = {
          id: "",
          name: "",
          description: "",
          photo: "",
          followers: 0,
          categories: [],
          allCategories: [],
          dateCreated: undefined,
          upcoming: [],
          past: [],
          isOwner: false,
          followed: false,
          error: false,
          openModal: false,
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
            .get(`/api/teams/${id}`)
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

        handleFollow = () => {
          const url = `/api/teams/${this.state.id}/follow`;
          if (this.state.followed) {
            axios.delete(url).then(() => {
              this.setState({
                followers: this.state.followers - 1,
                followed: false,
              });
            });
          } else {
            axios.post(url).then(() => {
              this.setState({
                followers: this.state.followers + 1,
                followed: true,
              });
            });
          }

          const { id, name, description, categories, photo } = this.state;
          this.props.followTeam(
            { _id: id, name, description, categories, photo },
            !this.state.followed
          );
        };

        followButton = () => {
          const { t } = this.props;
          if (this.props.loggedIn) {
            if (!this.state.followed) {
              return (
                <button
                  className="TopPanel_followbutton"
                  onClick={this.handleFollow}
                  children={t("teaminfo.follow")}
                />
              );
            } else {
              return (
                <button
                  className="TopPanel_unfollowbutton"
                  onClick={this.handleFollow}
                  children={t("teaminfo.unfollow")}
                />
              );
            }
          }
        };

        render() {
          if (this.state.error) {
            return <Redirect to="/teams/" />;
          } else if (this.state.id === "") {
            return <SpinnerPage />;
          }

          const { t } = this.props;
          const {
            name,
            description,
            photo,
            followers,
            upcoming,
            past,
            dateCreated,
            categories,
            allCategories,
            id,
          } = this.state;

          const photoSrc = photo
            ? `/api/images/${photo}`
            : "/img/teaminfo/default.png";

          return (
            <div>
              <TeamPopup
                allCategories={allCategories}
                open={this.state.openModal}
                onClose={() => this.setState({ openModal: false })}
                name={name}
                description={description}
                checkedCategories={categories}
                title={t("teaminfo.title")}
                button={t("teaminfo.button")}
                action={`/api/teams/${id}`}
                isCreate={false}
              />
              <div className={"TeamProfile"}>
                <section className="TopPanel">
                  <span className="TopPanel_info">
                    <img alt="Team Logo" src={photoSrc} />
                    <div>
                      <img alt="Team Logo" src={photoSrc} />
                      <h1>{name}</h1>
                      <h2>{description}</h2>
                    </div>
                  </span>
                  <h3>{description}</h3>
                  {this.state.isOwner ? (
                    <button
                      className="TopPanel_followbutton"
                      children={t("teaminfo.edit")}
                      onClick={() => this.setState({ openModal: true })}
                    />
                  ) : (
                    this.followButton()
                  )}
                </section>
                <section className="MidPanel">
                  <div className="MidPanel_info">
                    <h1>
                      {t("teaminfo.followers")}: {followers}
                    </h1>
                    <h1>
                      {t("teaminfo.actions")}: {upcoming.length + past.length}
                    </h1>
                    <hr />
                    <h1>{t("teaminfo.createdon")}:</h1>
                    <h1>{parseDate(dateCreated, t)}</h1>
                  </div>

                  <div className="MidPanel_categories">
                    <h1>{t("teaminfo.categories")}:</h1>
                    {categories.length > 0 ? (
                      <ul>
                        {categories.map((c) => {
                          return (
                            <li key={c}>
                              {t(`categories.${c.toLowerCase()}`)}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p children={t("teaminfo.none")} />
                    )}
                  </div>
                  <div className="MidPanel_both">
                    <div className="MidPanel_both_center">
                      <h1>
                        {t("teaminfo.followers")}: {followers}
                      </h1>
                      <p> </p>
                      <h1>
                        {t("teaminfo.actions")}: {upcoming.length + past.length}
                      </h1>
                    </div>
                    <h1>
                      {t("teaminfo.createdon")}: {parseDate(dateCreated, t)}
                    </h1>
                    <hr />
                    <h1>{t("teaminfo.categories")}:</h1>
                    {categories.length > 0 ? (
                      <ul>
                        {categories.map((c) => {
                          return (
                            <li key={c}>
                              {t(`categories.${c.toLowerCase()}`)}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p children={t("teaminfo.none")} />
                    )}
                  </div>
                </section>
                <section className="BottomPanel">
                  <div className="LeftSide">
                    <div className="LeftSide_info">
                      <h1>
                        {t("teaminfo.followers")}: {followers}
                      </h1>
                      <h1>
                        {t("teaminfo.actions")}: {upcoming.length + past.length}
                      </h1>
                      <hr />
                      <h1>{t("teaminfo.createdon")}:</h1>
                      <h1>{parseDate(dateCreated, t)}</h1>
                    </div>
                    <div className="LeftSide_categories">
                      <h1>{t("teaminfo.categories")}:</h1>
                      {categories.length > 0 ? (
                        <ul>
                          {categories.map((c) => {
                            return (
                              <li key={c}>
                                {t(`categories.${c.toLowerCase()}`)}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p children={t("teaminfo.none")} />
                      )}
                    </div>
                  </div>
                  <div className="RightSide">
                    <div className="RightSide_events">
                      {upcoming.length + past.length === 0 && (
                        <h1>{t("teaminfo.empty")}</h1>
                      )}
                      {upcoming.length > 0 && (
                        <h1>{t("teaminfo.upcoming")}:</h1>
                      )}
                      <ul>
                        {upcoming.map((action) => {
                          return (
                            <li
                              key={action._id}
                              children={<ActionCard action={action} />}
                            />
                          );
                        })}
                      </ul>
                      {past.length > 0 && <h1>{t("teaminfo.past")}:</h1>}
                      <ul>
                        {past.map((action) => {
                          return (
                            <li
                              key={action._id}
                              children={<ActionCard action={action} />}
                            />
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          );
        }
      }
    )
  )
);
