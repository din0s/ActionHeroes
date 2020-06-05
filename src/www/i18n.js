import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// more info: https://react.i18next.com/latest/using-with-hooks
i18n
  .use(Backend) // https://github.com/i18next/i18next-http-backend
  .use(LanguageDetector) // https://github.com/i18next/i18next-browser-languageDetector
  .use(initReactI18next)
  .init({
    // all options: https://www.i18next.com/overview/configuration-options
    fallbackLng: "en",
    whitelist: ["el", "en"]
  });

export default i18n;
