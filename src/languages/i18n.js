import i18next from 'i18next';
import en from './en.json';
import pt from './pt.json';
import fr from './fr.json';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    AsyncStorage.getItem('language', (err, language) => {
      if (err || !language) {
        if (err) {
          return callback(RNLocalize.getLocales()[0].languageCode);
        } else {
          AsyncStorage.setItem(
            'language',
            RNLocalize.getLocales()[0].languageCode,
          );
          return callback(RNLocalize.getLocales()[0].languageCode);
        }
      } else {
        return callback(language);
      }
    });
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    resources: {
      en,
      pt,
      fr,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18next;
