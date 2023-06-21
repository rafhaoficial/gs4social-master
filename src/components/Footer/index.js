import React, {useState, useEffect} from 'react';
import {TextFooter, ViewFooter, ButtonFooter} from './styles';
import {Alert} from 'react-native';
import {withNavigation} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

function Footer({navigation}) {
  const [rota, setRota] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadingUser();
  }, []);

  async function loadingUser() {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    if (user) {
      setUser(user);
    }
  }

  const {t, i18n} = useTranslation();

  return (
    <ViewFooter>
      <ButtonFooter
        onPress={() => {
          if (user) {
            navigation.navigate('MinhasDoacoes');
          } else {
            Alert.alert(
              '',
              'Faça o login ou cadastro para visualizar suas doações',
              [
                {
                  text: 'Cadastre-se',
                  onPress: () => {
                    navigation.navigate('Cadastro');
                  },
                },
                {
                  text: 'Fazer Login',
                  onPress: () => {
                    navigation.navigate('Login');
                  },
                },
                {
                  text: 'Fechar',
                },
              ],
            );
          }
        }}>
        <Icon size={24} name={'hand-heart'} style={{color: '#fff'}} />
        <TextFooter>{t('Doações')}</TextFooter>
      </ButtonFooter>

      <ButtonFooter
        onPress={() => {
          navigation.navigate('Localização');
        }}>
        <Icon size={24} name={'map-search'} style={{color: '#fff'}} />
        <TextFooter>{t('Localização')}</TextFooter>
      </ButtonFooter>

      <ButtonFooter
        onPress={() => {
          navigation.navigate('Menu');
        }}>
        <Icon size={24} name={'menu'} style={{color: '#fff'}} />
        <TextFooter>{t('Menu')}</TextFooter>
      </ButtonFooter>
    </ViewFooter>
  );
}

export default withNavigation(Footer);
