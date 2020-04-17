import "./LandingPage.scss";

import React, { Component } from "react";

import { Link } from "react-router-dom";
import { Parallax } from "react-parallax";
import ScrollUpButton from "react-scroll-up-button";
import { withTranslation } from "react-i18next";

const categoriesList = require("./categories.json");

export default withTranslation()(
  class LandingPage extends Component {
    showCategories = (categoriesList) => {
      return Object.keys(categoriesList).map((key, index) => {
        if (index >= 6) return null;

        let cardModifier = "";
        if (index >= 3) {
          if (index < 4) {
            cardModifier = " show-4";
          } else {
            cardModifier = " show-6";
          }
        }

        return (
          <div className={`Categories_card${cardModifier}`}>
            <div className="Categories_card_title">
              <img alt="Category icon" src={categoriesList[key].image} />
              <h5>{categoriesList[key].name}</h5>
            </div>
            <p>{categoriesList[key].desc}</p>
          </div>
        );
      });
    };

    render() {
      const { t } = this.props;
      return (
        <div className="LandingPage">
          <section className="Intro">
            <Parallax
              blur={{ min: 0, max: 5 }}
              className="Intro_parallax"
              bgImage="/img/landing/parallax1.jpg"
              bgImageAlt="Intro Parallax"
              strength={250}
            >
              <div className="Intro_panel">
                <span className="Intro_panel-top">
                  <img alt="" src="/img/landing/intro_icon.svg" />
                  <div>
                    <h1>{t("landingpage.catchphrase")}</h1>
                    <h2>{t("landingpage.desc")}</h2>
                  </div>
                </span>
                <span className="Intro_panel-bot">
                  <Link to="/signup">
                    <button>{t("landingpage.join")}</button>
                  </Link>
                </span>
              </div>
            </Parallax>
          </section>
          <section className="Actions">
            <h3>{t("landingpage.become")}</h3>
            <Parallax
              blur={5}
              className="Actions_parallax"
              bgImage="/img/landing/parallax2.jpg"
              bgImageAlt="Actions Parallax"
              strength={150}
            >
              <div className="Actions_panel">
                <div className="Actions_card">
                  <h4>{t("landingpage.volunteer")}</h4>
                  <img alt="Volunteer" src={"/img/landing/volunteer.svg"} />
                  <p>{t("landingpage.volunteerdesc")}</p>
                </div>
                <div className="Actions_card">
                  <h4>{t("landingpage.organize")}</h4>
                  <img alt="Organizer" src={"/img/landing/organizer.svg"} />
                  <p>{t("landingpage.organizedesc")}</p>
                </div>
              </div>
            </Parallax>
          </section>
          <section className="Categories">
            <h3>{t("landingpage.findactions")}</h3>
            <Parallax
              blur={5}
              className="Categories_parallax"
              bgImage="/img/landing/parallax3.jpg"
              bgImageAlt="Categories Parallax"
              strength={150}
            >
              <div className="Categories_panel">
                {this.showCategories(categoriesList)}
              </div>
            </Parallax>
          </section>
          <ScrollUpButton
            ContainerClassName="ScrollButton"
            AnimationDuration={1200}
            EasingType="easeInOutCubic"
            ShowAtPosition={150}
          />
        </div>
      );
    }
  }
);
