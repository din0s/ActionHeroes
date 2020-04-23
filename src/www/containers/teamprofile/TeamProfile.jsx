import "./TeamProfile.scss";

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import ActionCard from "../../components/actioncard/ActionCard";

const team = require("./teamobject.json");

export default withTranslation()(
  class LandingPage extends Component {
    render() {
      const { t } = this.props;
      return (
        <div className="TeamProfile">
          <section className="TopPanel">
            <span className="TopPanel_info">
              <img alt="Team Logo" src="/img/teaminfo/acm.jpg" />
              <div>
                <h1>ACM AUTH Student Chapter</h1>
                <h2>
                  The Chapter's mission is to inform its members and students of
                  Aristotle University of Thessaloniki (AUTh) about the latest
                  cutting-edge achievements in Computer Science and Engineering,
                  to create a group of dedicated people who are interested to
                  explore all possibilities of computer science.
                </h2>
              </div>
            </span>
            <span className="TopPanel_button">
              <Link to="/signup">
                <button>{"Follow"}</button>
              </Link>
            </span>
          </section>
          <section className="BottomPanel">
            <div className="LeftSide">
              <div className="LeftSide_info">
                <h1>Members: 75</h1>
                <h1>Actions: 40</h1>
                <hr />
                <h1>Created on:</h1>
                <h1>September 14th 2019</h1>
              </div>

              <div className="LeftSide_categories">
                <h1>Relevant Categories:</h1>
                <ul>
                  {Object.keys(team.categories).map((cKey) => {
                    return <li>{team.categories[cKey].name}</li>;
                  })}
                </ul>
              </div>
            </div>
            <div className="RightSide">
              <div className="RightSide_events">
                <h1>Upcoming Events:</h1>
                <ActionCard />
                <ActionCard />
                <h1>Past Events:</h1>
                <ActionCard />
                <ActionCard />
              </div>
            </div>
          </section>
        </div>
      );
    }
  }
);
