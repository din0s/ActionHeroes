import "./Navbar.scss";

import React, { Component } from "react";

import LangDropdown from "./lang_dropdown/LangDropdown";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import SearchBar from "../searchbar/SearchBar";
import { withTranslation } from "react-i18next";

const languages = {
  el: { flag: "🇬🇷", name: "Ελληνικά" },
  en: { flag: "🇬🇧", name: "English" }
};

export default withTranslation()(
  class Navbar extends Component {
    state = {
      lang_dropdown: "hidden"
    };

    toggleMenu = async () => {
      this.setState({
        lang_dropdown: this.state.lang_dropdown === "" ? "hidden" : ""
      });
    };

    hideMenu = async () => {
      if (this.state.lang_dropdown === "") {
        this.setState({
          lang_dropdown: "hidden"
        });
      }
    };

    componentDidMount() {
      document.addEventListener("click", this.onClickOut, true);
    }

    componentWillUnmount() {
      document.removeEventListener("click", this.onClickOut, true);
    }

    // https://stackoverflow.com/a/45323523/7412859
    onClickOut = event => {
      const domNode = ReactDOM.findDOMNode(this);

      if (!domNode || !domNode.contains(event.target)) {
        this.hideMenu();
      }
    };

    render() {
      const { t, i18n } = this.props;
      const flag = languages[i18n.language].flag;
      return (
        <nav className="navbar" onClick={this.hideMenu}>
          <Link to="/">
            <img src="/img/logo.png" alt="Logo" className="Nav-logo" />
          </Link>
          <SearchBar />
          <div className="Links">
            <ul>
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
            <ul>
              <li className="Button-link">
                <Link
                  to="/login"
                  children={<button children={t("nav.login")} />}
                />
              </li>
              <li className="Button-link">
                <Link
                  to="/signup"
                  children={<button children={t("nav.signup")} />}
                />
              </li>
              <li className="Lang-selector" onClick={this.toggleMenu}>
                <div>
                  {flag}
                  <img
                    src="./img/arrow.svg"
                    alt=""
                    className="dropdown-arrow"
                  />
                </div>
              </li>
            </ul>
          </div>
          <LangDropdown modifier={this.state.lang_dropdown} langs={languages} />
        </nav>
      );
    }
  }
);
