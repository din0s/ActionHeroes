import "./GuestNav.scss";
import { useTranslation } from "react-i18next";
import React from "react";
import { Link } from "react-router-dom";

export default function() {
  const { t } = useTranslation();
  return (
    <ul className="Buttons">
      <li className="Login-button">
        <Link to="/login" children={t("nav.login")} />
      </li>
      <li className="Signup-button">
        <Link to="/signup" children={t("nav.signup")} />
      </li>
    </ul>
  );
}
