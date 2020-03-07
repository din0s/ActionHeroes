import "./Footer.scss";

import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <div className="Footer">
      <hr className="Divider" />
      <p>(C) ActionHeroes 2020</p>
      <p>{t("footer.icons", { site: "flaticon.com" })}</p>
    </div>
  );
}
