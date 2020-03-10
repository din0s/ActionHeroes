import "./NavBar.scss";

import React, { Component } from "react";

import { Link } from "react-router-dom";
import SearchBar from "../searchbar/SearchBar";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import GuestNav from "./guest_nav/GuestNav";
import MemberNav from "./member_nav/MemberNav";
import LanguageSelector from "./language_selector/LanguageSelector";

class NavBar extends Component {
  state = {
    hiddenMenu: true
  };

  toggleMenu = async () => {
    this.setState({
      hiddenMenu: !this.state.hiddenMenu
    });
  };

  render() {
    const { t } = this.props;
    return (
      <nav>
        <span className="Top">
          <img
            src="/img/hamburger.svg"
            alt="Menu"
            className="Hamburger"
            onClick={this.toggleMenu}
          />
          <Link to="/">
            <img src="/img/logo.png" alt="Logo" className="Logo" />
          </Link>
        </span>
        <div className={`Menu${this.state.hiddenMenu ? " Menu-hidden" : ""}`}>
          <SearchBar />
          <ul className="Pages">
            <li className="Page-link">
              <Link to="/actions" children={t("nav.actions")} />
            </li>
            <li className="Page-link">
              <Link to="/teams" children={t("nav.teams")} />
            </li>
            <li className="Page-link">
              <Link to="/contact" children={t("nav.contact")} />
            </li>
          </ul>
          <div className="Right-sticky">
            <span className="User-nav">
              {this.props.loggedIn ? <MemberNav /> : <GuestNav />}
            </span>
            <LanguageSelector />
          </div>
        </div>
      </nav>
    );
  }
}

const mapping = state => {
  return {
    loggedIn: state.auth.loggedIn,
    user: state.auth.user
  };
};

export default connect(mapping)(withTranslation()(NavBar));
