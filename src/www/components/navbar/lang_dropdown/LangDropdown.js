import "./LangDropdown.scss";

import React, { Component } from "react";

import i18next from "i18next";

export default class LangDropdown extends Component {
  changeLang = async lang => {
    if (i18next.language !== lang) {
      i18next.changeLanguage(lang);
    }
  };

  render() {
    return (
      <ul className={`Dropdown ${this.props.modifier}`}>
        {Object.entries(this.props.langs).map(k => {
          const flag = k[1].flag;
          const lang = k[1].name;

          return (
            <li
              key={k[0]}
              className="Language"
              onClick={() => this.changeLang(k[0])}
              children={`${flag} ${lang}`}
            />
          );
        })}
      </ul>
    );
  }
}
