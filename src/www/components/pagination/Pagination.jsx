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

  const filtered = collection
    .filter((item) => {
      // Search filtering
      if (query === "") {
        return true;
      }
      return searchFilter(item, query);
    })
    .filter((item) => {
      // Category filtering
      if (selected.length === 0) {
        return true;
      }

      const categories = item.categories;
      return selected.every((sc) =>
        categories.find((c) => {
          return sc === c;
        })
      );
    });

  const contentLength = filtered.length;
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
        {filtered.slice(offset, offset + perPage).map((item) => {
          return mapFunc(item);
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
