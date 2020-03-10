import "./LanguageSelector.scss";

import React, { Component } from "react";
import ReactDOM from "react-dom";

import i18next from "i18next";

const languages = {
  el: { flag: "🇬🇷", name: "Ελληνικά" },
  en: { flag: "🇬🇧", name: "English" }
};

export default class LanguageSelector extends Component {
  state = {
    hideDropdown: true
  };

  toggleDropdown = async () => {
    this.setState({
      hideDropdown: !this.state.hideDropdown
    });
  };

  hideMenu = async () => {
    this.setState({
      hideDropdown: true
    });
  };

  changeLang = async lang => {
    if (i18next.language !== lang) {
      i18next.changeLanguage(lang);
    }
    this.hideMenu();
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
    const currFlag = languages[i18next.language];
    return (
      <div className="Lang-selector">
        <span className="Picker" onClick={this.toggleDropdown}>
          <span className="Flag" children={currFlag.name} />
          <img className="Arrow" src="/img/arrow.svg" alt="Arrow" />
        </span>
        <ul className={`Dropdown${this.state.hideDropdown ? " hidden" : ""}`}>
          {Object.entries(languages).map(k => {
            const flag = k[1].flag;
            const lang = k[1].name;

            return (
              <li key={k[0]} onClick={() => this.changeLang(k[0])}>
                <span className="Flag" children={flag} />
                <span className="Language" children={lang} />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
