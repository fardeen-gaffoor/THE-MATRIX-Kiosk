import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "AskAI": "AI Research Assistant",
      "SearchPlaceholder": "Search concepts, articles, or dates...",
      "Search": "Search",
      "Translate": "Translate",
      "Listen": "Listen"
    }
  },
  hi: {
    translation: {
      "AskAI": "एआई अनुसंधान सहायक",
      "SearchPlaceholder": "अवधारणाओं, लेखों या तिथियों को खोजें...",
      "Search": "खोज",
      "Translate": "अनुवाद करें",
      "Listen": "सुनें"
    }
  },
  mr: {
    translation: {
      "AskAI": "एआय संशोधन सहाय्यक",
      "SearchPlaceholder": "संकल्पना, लेख किंवा तारखा शोधा...",
      "Search": "शोध",
      "Translate": "भाषांतर करा",
      "Listen": "ऐका"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
