import React from 'react';
import {createAppContainer} from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {Transition} from 'react-native-reanimated';

import Login from './pages/Login';
import Menu from './pages/Menu';
import Localização from './pages/Localização';
import Cadastro from './pages/Cadastro';
import Navegacao from './pages/Navegacao';

import Profile from './pages/profile';
import Campanha from './pages/Campanha';
import Data from './pages/Data';
import Editar from './pages/editar';
import Listagem from './pages/Listagem';
import Doacao from './pages/Doacao';
import MinhasDoacoes from './pages/MinhasDoacoes';
import ResetPassword from './pages/ResetPassword';
import AddAlert from './pages/AddAlert';

const Router = createAppContainer(
  createAnimatedSwitchNavigator(
    {
      Login,
      Profile,
      Cadastro,
      Localização,
      Menu,
      MinhasDoacoes,
      Doacao,
      Listagem,
      Editar,
      Data,
      Navegacao,
      Campanha,
      ResetPassword,
      AddAlert,
    },
    {
      transition: (
        <Transition.Together>
          <Transition.Out type="fade" durationMs={200} />
          <Transition.Change tinterpolation="easeInOut" />
          <Transition.In type="fade" durationMs={400} />
        </Transition.Together>
      ),
      initialRouteName: 'Localização',
      backBehavior: 'initialRoute',
    },
  ),
);

export default Router;
