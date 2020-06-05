import "./Dashboard.scss";

import { Link, Redirect } from "react-router-dom";
import React, { Component } from "react";

import ActionCard from "../../components/actioncard/ActionCard";
import Pagination from "material-ui-flat-pagination";
import Selector from "../../components/selector/Selector";
import { connect } from "react-redux";
import { parseDate } from "../../date";
import { withTranslation } from "react-i18next";

const jsonFile = require("./dashboard.json");
const r_page = 5;

const mapState = (state) => ({
  loggedIn: state.auth.loggedIn,
});

export default connect(
  mapState,
  undefined
)(
  withTranslation()(
    class Dashboard extends Component {
      state = {
        r_offset: 0, // recommended actions offset
        t_select: jsonFile.teams[0], // team selection
      };

      showNextActions = () => {
        const { t } = this.props;
        if (jsonFile.next.length !== 0) {
          return jsonFile.next.map((action, index) => {
            return (
              <li key={index}>
                <h5>{parseDate(action.date, t)}</h5>
                <Link to="/actions/id">
                  <div className="NextCard">
                    <span>
                      <img src={action.photo} alt="" />
                      <h4 className="clamped">{action.name}</h4>
                    </span>
                    <p className="clamped">{action.description}</p>
                  </div>
                </Link>
              </li>
            );
          });
        } else {
          return <p>{t("dashboard.nonext")}</p>;
        }
      };

      showRecommend = () => {
        const { t } = this.props;
        const o = this.state.r_offset;
        if (jsonFile.recommend.length !== 0) {
          return jsonFile.recommend.slice(o, o + r_page).map((action) => {
            return <ActionCard />;
          });
        } else {
          return <p>{t("dashboard.norecommend")}</p>;
        }
      };

      showTeamCard = () => {
        const { t } = this.props;
        const team = this.state.t_select;
        if (team) {
          return (
            <div className="TeamCard">
              <span className="TeamCard-top">
                <img src={team.photo} alt="" />
                <div>
                  <Link to="/teams/id">
                    <h4 className="clamped">{team.name}</h4>
                  </Link>
                  <p>
                    {t("dashboard.members")}: {team.members}
                  </p>
                </div>
              </span>
              <span className="TeamCard-bot">
                <h5>{t("dashboard.recent")}</h5>
                <Link to="/actions/id">
                  <div>
                    <h4>{team.recent.name}</h4>
                    <p>{parseDate(team.recent.date, t)}</p>
                  </div>
                </Link>
              </span>
            </div>
          );
        } else {
          return <p>{t("dashboard.noteam")}</p>;
        }
      };

      showSavedActions = () => {
        const { t } = this.props;
        if (jsonFile.saved.length !== 0) {
          return jsonFile.saved.map((action, index) => {
            return (
              <li key={index}>
                <Link to="/actions/id">
                  <img src={action.photo} alt="" />
                  <h4 className="clamped">{action.name}</h4>
                </Link>
              </li>
            );
          });
        } else {
          return <p>{t("dashboard.nosaved")}</p>;
        }
      };

      render() {
        console.log(this.props.loggedIn);
        if (!this.props.loggedIn) {
          return <Redirect to="/" />;
        }

        const { t } = this.props;
        return (
          <div className="Dashboard">
            <div className="Dashboard_main">
              <div className="Dashboard_main_next">
                <h2>{t("dashboard.next")}</h2>
                <ul>{this.showNextActions()}</ul>
              </div>
              <div className="Dashboard_main_recommend">
                <h2>{t("dashboard.recommend")}</h2>
                <ul>{this.showRecommend()}</ul>
                <Pagination
                  limit={r_page}
                  offset={this.state.r_offset}
                  total={jsonFile.recommend.length}
                  onClick={(_, o) => this.setState({ r_offset: o })}
                  disableRipple={true}
                />
              </div>
            </div>
            <div className="Dashboard_side">
              <div className="Dashboard_side_teams">
                <Selector
                  value={<h3>{t("dashboard.teams")}</h3>}
                  onChange={(opt) => this.setState({ t_select: opt.value })}
                  options={jsonFile.teams.map((t) => ({
                    value: t,
                    label: t.name,
                  }))}
                />
                {this.showTeamCard()}
              </div>
              <div className="Dashboard_side_saved">
                <h3>{t("dashboard.saved")}</h3>
                <ul>{this.showSavedActions()}</ul>
              </div>
            </div>
          </div>
        );
      }
    }
  )
);
