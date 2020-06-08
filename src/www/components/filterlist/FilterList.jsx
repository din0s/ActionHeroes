import "./FilterList.scss";

import React from "react";
import { useTranslation } from "react-i18next";

export default ({ categories, selected, onCheckbox, onClear, onRemove }) => {
  const { t } = useTranslation();

  const sort = (categories) => {
    if (!categories) {
      return [];
    }
    return categories.sort((c1, c2) => {
      const t1 = t(`categories.${c1.toLowerCase()}`);
      const t2 = t(`categories.${c2.toLowerCase()}`);
      return t1.localeCompare(t2);
    });
  };

  const isChecked = (item, list) => {
    return Object.keys(list).find((k) => list[k] === item);
  };

  const listFilters = (selected, onRemove) => {
    if (selected.length === 0) {
      return <p children={t("filterlist.none")} />;
    }

    return sort(selected).map((c) => (
      <li key={c}>
        <p children={t(`categories.${c.toLowerCase()}`)} />
        <p onClick={() => onRemove(c)} children="x" />
      </li>
    ));
  };

  return (
    <div className="FilterList">
      <div className="FilterList_display">
        <span>
          <h2>{t("filterlist.filters")}</h2>
          <p onClick={onClear}>{t("filterlist.clear")}</p>
        </span>
        <ul children={listFilters(selected, onRemove)} />
      </div>
      <div className="FilterList_menu">
        <h4>{t("filterlist.categories")}</h4>
        <div>
          {sort(categories).map((name) => {
            return (
              <label key={name}>
                {t(`categories.${name.toLowerCase()}`)}
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
    </div>
  );
};
