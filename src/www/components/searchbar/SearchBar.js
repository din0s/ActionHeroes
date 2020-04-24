import "./SearchBar.scss";

import React from "react";
import { useTranslation } from "react-i18next";

export default ({ action, value, onChange }) => {
  const { t } = useTranslation();
  return (
    <form action={action} method="get" className="SearchBar">
      <input
        type="text"
        name="q"
        placeholder={t("search")}
        defaultValue={value}
        onChange={onChange}
      />
    </form>
  );
};
