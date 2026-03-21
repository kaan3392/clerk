import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import tr from "./locales/tr";

export const lng = getLocales()[0].languageCode ?? "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
  lng,
  fallbackLng: "en",
  supportedLngs: ["en", "tr"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
