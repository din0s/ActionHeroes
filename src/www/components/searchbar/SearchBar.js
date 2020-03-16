import "./SearchBar.scss";

import React from "react";

import { useTranslation } from "react-i18next";

export default function() {
  const { t } = useTranslation();
  return (
    <form action="/search" method="get" className="SearchBar">
      <input type="text" name="q" placeholder={t("search")} />
    </form>
  );
}
