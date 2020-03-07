import "./SearchBar.scss";

import React, { Component } from "react";

import { useTranslation } from "react-i18next";

function SearchInput() {
  const { t } = useTranslation();
  return (
    <input
      type="text"
      name="q"
      placeholder={t("search")}
      className="SearchBar"
    />
  );
}

export default class SearchBar extends Component {
  render() {
    return (
      <form action="/search" method="get">
        <SearchInput />
      </form>
    );
  }
}
