/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import i18next from './src/languages/i18n';

LogBox.ignoreLogs(['Require cycle:']);

AppRegistry.registerComponent(appName, () => App);
