import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";

// --------------------------------------

// 1. Import Resources JSON.
import en from './en.json';
import zh_CN from './zh-CN.json';



// 2. Add an object in `supportedLanguages` that link to the language.
// Rebuild, launch the app, switch to your language in Settings.
export const supportedLanguages = [
  {
    code: "zh-CN",
    label: "简体中文",
    translation: zh_CN
  },
  {
    code: "en",
    label: "English",
    translation: en,
  }
]

function isSupportedLanguage(code: string): boolean {
  return supportedLanguages.findIndex((v) => v.code == code) != -1
}

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)


function getI18nResources() {
  const res: any = {}
  for (const lang of supportedLanguages) {
    const trans = { translation: lang.translation }
    Object.defineProperty(res, lang.code, { value: trans })
    // res[lang.code] = trans
  }
  console.log(res);
  return res
}

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: getI18nResources(),
    fallbackLng: "zh-CN", // use en if detected lng is not available
    // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

const systemLanguage = navigator.language;
console.log("System language code:", systemLanguage);
// i18n.changeLanguage("zh-CN");

// console.log(i18n.language);

export default i18n;