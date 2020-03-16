import "./Footer.scss";

import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer>
      <hr className="Divider" />
      <p>&copy; ActionHeroes 2020</p>
      <p>{t("footer.icons", { site: "flaticon.com" })}</p>
    </footer>
  );
}
