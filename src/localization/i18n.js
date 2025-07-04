import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import en from './translations/en.json';
import ur from './translations/ur.json';
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart'; //used to restart app 
const LANG_KEY = 'user-language';

// A dictionary where the keys are languages and the values are objects
// containing the translation for that language. The translation is itself an
// object where the keys are the string IDs and the values are the translated
// strings.
const resources = {
  en: { translation: en },
  ur: { translation: ur },
};

/**
 * Detect the language that the user prefers. This is done by looking at
 * the languages that the user has chosen in their device settings, and
 * then finding the best match from the languages that we support.
 *
 * If the user has chosen a language in their device settings that we
 * don't support, we fall back to English.

 * If the user has chosen a language in their device settings that we do
 * support, we use that language. If the user has never chosen a language
 * in their device settings, we use the first language in the list of
 * supported languages.
 */
const detectLanguage = async () => {
  const savedLang = await AsyncStorage.getItem(LANG_KEY);
  if (savedLang) return savedLang;

  const bestLang = RNLocalize.findBestAvailableLanguage(Object.keys(resources));
  if (bestLang && resources[bestLang.languageTag]) {
    return bestLang.languageTag;
  } else {
    return 'en';
  }
};


/**
 * Initializes localization settings for the app.
 * 
 * This function detects the user's preferred language and configures the app's
 * internationalization settings accordingly. It adjusts the text direction 
 * (RTL or LTR) based on the language and initializes the i18n library with 
 * the appropriate translations. If the user's preferred language is not 
 * supported, it defaults to English.
 * 
 * The function does not restart the app but sets the text direction before 
 * the UI starts rendering to ensure proper layout.
 */

export const initLocalization = async () => {
  const language = await detectLanguage();
  const isRTL = language === 'ur';

  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(isRTL);
  }
  await i18n
    .use(initReactI18next)
    .init({
      resources, //defined above 
      lng: language,
      fallbackLng: 'en',
      compatibilityJSON: 'v3',
      interpolation: { escapeValue: false },
    });
};

/**
 * This function is used to change the language of the app.
 * 
 * It does this by:
 * 1. Changing the language of the i18n library.
 * 2. Saving the new language to AsyncStorage so that it persists even after the app is closed.
 * 
 * @param {string} lang The new language to use
 */
export const changeAppLanguage = async (lang) => {
  const isRTL = lang === 'ur';
  await i18n.changeLanguage(lang); //change the language in i18n 
  await AsyncStorage.setItem(LANG_KEY, lang); //persist language 

  //apply RTL if needed 
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(isRTL);
    RNRestart.Restart(); // Reload app to apply RTL
  }
};

export default i18n;
