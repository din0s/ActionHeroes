import "./SearchBar.scss";

import React from "react";
import { useTranslation } from "react-i18next";

export default (props) => {
  const { t } = useTranslation();
  return (
    <form action={props.action} method="get" className="SearchBar">
      <input type="text" name="q" placeholder={t("search")} />
    </form>
  );
};
