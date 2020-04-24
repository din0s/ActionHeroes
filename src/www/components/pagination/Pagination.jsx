import "./Pagination.scss";

import React, { useState } from "react";

import Pagination from "material-ui-flat-pagination";
import { useTranslation } from "react-i18next";

export default ({
  baseName,
  collection,
  query,
  mapFunc,
  perPage,
  searchFilter,
  selected,
}) => {
  const { t } = useTranslation();
  const [offset, setOffset] = useState(0);
  const [prevQuery, setPrevQuery] = useState("");
  const [prevSelected, setPrevSelected] = useState([]);

  const filtered = Object.keys(collection)
    .filter((key) => {
      // Search filtering
      if (query === "") {
        return true;
      }
      return searchFilter(collection[key], query);
    })
    .filter((key) => {
      // Category filtering
      if (selected.length === 0) {
        return true;
      }

      const categories = collection[key].categories;
      return selected.every((sc) =>
        Object.keys(categories).find((c) => {
          const category = categories[c];
          return sc === category;
        })
      );
    });

  const contentLength = Object.keys(filtered).length;
  if (prevQuery !== query) {
    setOffset(0);
    setPrevQuery(query);
  }
  if (prevSelected !== selected) {
    setOffset(0);
    setPrevSelected(selected);
  }

  return (
    <div className={baseName}>
      <ul className={`${baseName}_list`}>
        {contentLength === 0 && <p children={t("noresults")} />}
        {filtered.slice(offset, offset + perPage).map((key) => {
          return mapFunc(key, collection[key]);
        })}
      </ul>
      <Pagination
        className="Pagination"
        limit={perPage}
        offset={offset}
        total={contentLength}
        onClick={(_, o) => setOffset(o)}
        disableRipple={true}
      />
    </div>
  );
};
