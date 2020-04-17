import "./NavBar.scss";

import { Link, NavLink } from "react-router-dom";
import React, { Component } from "react";

import GuestNav from "./guest_nav/GuestNav";
import LanguageSelector from "./language_selector/LanguageSelector";
import MemberNav from "./member_nav/MemberNav";
import SearchBar from "../searchbar/SearchBar";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

class NavBar extends Component {
  state = {
    hiddenMenu: true,
  };

  toggleMenu = async () => {
    this.setState({
      hiddenMenu: !this.state.hiddenMenu,
    });
  };

  hideMenu = async () => {
    if (!this.state.hiddenMenu) {
      this.setState({ hiddenMenu: true });
    }
  };

  render() {
    const { t } = this.props;
    return (
      <nav>
        <span className="Top">
          <img
            src="/img/icons/hamburger.svg"
            alt="Hamburger Menu"
            className="Hamburger"
            onClick={this.toggleMenu}
          />
          <Link to="/" onClick={this.hideMenu}>
            <img src="/img/logo.png" alt="Logo" className="Logo" />
          </Link>
        </span>
        <div className={`Menu${this.state.hiddenMenu ? " Menu-hidden" : ""}`}>
          <SearchBar />
          <ul className="Pages" onClick={this.hideMenu}>
            <li className="Page-link">
              <NavLink to="/actions" children={t("nav.actions")} />
            </li>
            <li className="Page-link">
              <NavLink to="/teams" children={t("nav.teams")} />
            </li>
            <li className="Page-link">
              <NavLink to="/contact" children={t("nav.contact")} />
            </li>
          </ul>
          <div className="Right-sticky" onClick={this.hideMenu}>
            <span className="User-nav">
              {this.props.loggedIn ? (
                <MemberNav user={this.props.user} />
              ) : (
                <GuestNav />
              )}
            </span>
            <LanguageSelector onClick={this.hideMenu} />
          </div>
        </div>
      </nav>
    );
  }
}

const mapping = (state) => {
  return {
    loggedIn: state.auth.loggedIn,
    user: state.auth.user,
  };
};

export default connect(mapping)(withTranslation()(NavBar));
