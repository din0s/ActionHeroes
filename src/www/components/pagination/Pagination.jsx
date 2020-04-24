import "./Pagination.scss";

import React, { useState } from "react";

import Pagination from "material-ui-flat-pagination";

export default ({
  baseName,
  collection,
  query,
  mapFunc,
  perPage,
  searchFilter,
  selected,
}) => {
  const [offset, setOffset] = useState(0);

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

  return (
    <div className={baseName}>
      <ul className={`${baseName}_list`}>
        {filtered.slice(offset, offset + perPage).map((key) => {
          return mapFunc(key, collection[key]);
        })}
      </ul>
      <Pagination
        className="Pagination"
        limit={perPage}
        offset={offset}
        total={Object.keys(filtered).length}
        onClick={(_, o) => setOffset(o)}
        disableRipple={true}
      />
    </div>
  );
};
