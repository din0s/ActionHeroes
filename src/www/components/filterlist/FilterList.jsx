import "./FilterList.scss";

import React from "react";
import { useTranslation } from "react-i18next";

const isChecked = (item, list) =>
  Object.keys(list).find((k) => list[k] === item);

export default ({ categories, selected, onCheckbox, onClear, onRemove }) => {
  const { t } = useTranslation();
  return (
    <div className="FilterList">
      <div className="FilterList_display">
        <span>
          <h2>{t("filters")}</h2>
          <p onClick={onClear}>{t("clear")}</p>
        </span>
        <ul>
          {selected.map((c) => (
            <li key={c}>
              <p children={c} />
              <p onClick={() => onRemove(c)} children="x" />
            </li>
          ))}
        </ul>
      </div>
      <div className="FilterList_menu">
        <h4>{t("categories")}</h4>
        {Object.keys(categories).map((c) => {
          const category = categories[c];
          const name = category.name;
          return (
            <label key={c}>
              {name}
              <input
                type="checkbox"
                checked={isChecked(name, selected)}
                onChange={(event) => onCheckbox(event, name)}
              />
              <span className="checkmark"></span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
