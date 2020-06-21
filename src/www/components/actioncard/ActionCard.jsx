import "./ActionCard.scss";

import { Link } from "react-router-dom";
import React from "react";
import { parseDate } from "../../date";
import { useTranslation } from "react-i18next";

export default ({ action }) => {
  const { t } = useTranslation();
  const { _id, name, description, categories, location, date, photo } = action;

  const photoSrc = photo
    ? `/api/images/${photo}`
    : "/img/actionprofile/default.jpg";

  return (
    <div className="ActionCard">
      <Link to={`/actions/${_id}`}>
        <img src={photoSrc} alt="" />
        <div className="ActionCard_body">
          <img src={photoSrc} alt="" />
          <div className="ActionCard_body_container">
            <h1>{name}</h1>
            <h2>
              <span role="img" aria-label="pinpoint">
                📍
              </span>
              {" " + location.name} • {parseDate(date, t)}
            </h2>
            <p>{description}</p>
          </div>
          <div className="ActionCard_categories">
            <h1>{t("actioncard.categories")}:</h1>
            <ul>
              {categories.map((name) => (
                <li key={name}>{t(`categories.${name.toLowerCase()}`)}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="ActionCard_hiddenDesc">
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
};
