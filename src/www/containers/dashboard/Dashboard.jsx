import "./Dashboard.scss";

import React, { Component } from "react";

import ActionCard from "../../components/actioncard/ActionCard";
import { Link } from "react-router-dom";
import Pagination from "material-ui-flat-pagination";
import Selector from "../../components/selector/Selector";
import axios from "axios";
import { parseDate } from "../../date";
import { withTranslation } from "react-i18next";

const r_page = 5;

export default withTranslation()(
  class Dashboard extends Component {
    state = {
      r_offset: 0, // recommended actions offset
      t_select: undefined, // team selection
      next: [],
      saved: [],
      teams: [],
      recommend: [],
    };

    componentDidMount = () => {
      axios.get("/api/users/me/dashboard").then((res) => {
        const { next, saved, teams, recommend } = res.data;
        this.setState({ next, saved, teams, recommend, t_select: teams[0] });
      });
    };

    showNextActions = () => {
      const { t } = this.props;
      const { next } = this.state;
      if (next.length !== 0) {
        return (
          <ul>
            {next.map((action, index) => {
              const { _id, name, description, photo, date } = action;
              const photoSrc = photo
                ? `/api/images/${photo}`
                : "/img/actionprofile/default.jpg";
              return (
                <li key={index}>
                  <h5>{parseDate(date, t)}</h5>
                  <Link to={`/actions/${_id}`}>
                    <div className="NextCard">
                      <span>
                        <img src={photoSrc} alt="" />
                        <h4 className="clamped">{name}</h4>
                      </span>
                      <p className="clamped">{description}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        );
      } else {
        return (
          <ul className="vertical">
            <li>
              <p children={t("dashboard.nonext")} />
            </li>
            <li>
              <Link to="/actions" children={t("dashboard.action_prompt")} />
            </li>
          </ul>
        );
      }
    };

    showRecommend = () => {
      const { t } = this.props;
      const { r_offset, recommend } = this.state;
      if (recommend.length !== 0) {
        return (
          <ul>
            {recommend.slice(r_offset, r_offset + r_page).map((action) => {
              return <li key={action._id} children={<ActionCard action={action} />} />;
            })}
          </ul>
        );
      } else {
        return (
          <ul className="vertical">
            <li>
              <p children={t("dashboard.norecommend")} />
            </li>
            <li>
              <Link to="/teams" children={t("dashboard.team_prompt")} />
            </li>
          </ul>
        );
      }
    };

    showTeamCard = () => {
      const { t } = this.props;
      const team = this.state.t_select;
      if (team) {
        const { _id, name, photo, followers, recent } = team;
        const photoSrc = photo
          ? `/api/images/${photo}`
          : "/img/teaminfo/default.png";
        return (
          <div className="TeamCard">
            <span className="TeamCard-top">
              <img src={photoSrc} alt="" />
              <div>
                <Link to={`teams/${_id}`}>
                  <h4 className="clamped">{name}</h4>
                </Link>
                <p>
                  {t("dashboard.followers")}: {followers}
                </p>
              </div>
            </span>
            {recent && (
              <span className="TeamCard-bot">
                <h5>{t("dashboard.recent")}</h5>
                <Link to={`/actions/${recent._id}`}>
                  <div>
                    <h4>{recent.name}</h4>
                    <p>{parseDate(recent.date, t)}</p>
                  </div>
                </Link>
              </span>
            )}
          </div>
        );
      } else {
        return <p>{t("dashboard.noteam")}</p>;
      }
    };

    showSavedActions = () => {
      const { t } = this.props;
      const { saved } = this.state;
      if (saved.length !== 0) {
        return (
          <ul>
            {saved.map((action, index) => {
              const { _id, photo, name } = action;
              const photoSrc = photo
                ? `/api/images/${photo}`
                : "/img/actionprofile/default.jpg";
              return (
                <li key={index}>
                  <Link to={`/actions/${_id}`}>
                    <img src={photoSrc} alt="" />
                    <h4 className="clamped">{name}</h4>
                  </Link>
                </li>
              );
            })}
          </ul>
        );
      } else {
        return (
          <span className="vertical">
            <p children={t("dashboard.nosaved")} />
          </span>
        );
      }
    };

    render() {
      const { t } = this.props;
      return (
        <div className="Dashboard">
          <div className="Dashboard_main">
            <div className="Dashboard_main_next">
              <h2>{t("dashboard.next")}</h2>
              {this.showNextActions()}
            </div>
            <div className="Dashboard_main_recommend">
              <h2>{t("dashboard.recommend")}</h2>
              {this.showRecommend()}
              <Pagination
                limit={r_page}
                offset={this.state.r_offset}
                total={this.state.recommend.length}
                onClick={(_, o) => this.setState({ r_offset: o })}
                disableRipple={true}
              />
            </div>
          </div>
          <div className="Dashboard_side">
            {this.state.teams.length > 0 && (
              <div className="Dashboard_side_teams">
                <Selector
                  value={<h3>{t("dashboard.teams")}</h3>}
                  onChange={(opt) => this.setState({ t_select: opt.value })}
                  options={this.state.teams.map((t) => ({
                    value: t,
                    label: t.name,
                  }))}
                />
                {this.showTeamCard()}
              </div>
            )}
            <div className="Dashboard_side_saved">
              <h3>{t("dashboard.saved")}</h3>
              {this.showSavedActions()}
            </div>
          </div>
        </div>
      );
    }
  }
);
