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
  const [page, setPage] = useState(0);

  return (
    <div className={baseName}>
      <ul className={`${baseName}_list`}>
        {Object.keys(collection)
          .slice(page, page + perPage)
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
          })
          .map((key) => {
            return mapFunc(key, collection[key]);
          })}
      </ul>
      <Pagination
        className="Pagination"
        limit={perPage}
        offset={page}
        total={Object.keys(collection).length}
        onClick={(_, o) => setPage(o)}
        disableRipple={true}
      />
    </div>
  );
};
