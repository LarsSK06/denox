import i18next from "i18next";
import en from "./resources/en.json";

import { initReactI18next } from "react-i18next";

i18next
    .use(initReactI18next)
    .init({
        resources: { en },
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });