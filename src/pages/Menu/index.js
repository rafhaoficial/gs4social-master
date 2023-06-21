import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Linking,
  ImageBackground,
  Alert,
  Text,
  BackHandler,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import Icone from 'react-native-vector-icons/MaterialIcons';
import Iconee from 'react-native-vector-icons/MaterialCommunityIcons';
import Iconeee from 'react-native-vector-icons/Ionicons';
import Header from '../../components/header';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';

import Footer from '../../components/Footer';

import man from './../../images/profile.png';

import {TextOption, TextUser, ViewUser, Option, Container} from './styles';

export default function Menu({navigation}) {
  const [modal, setModal] = useState(false);
  const [language, setLanguage] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone_number: '',
    user_type: '',
    address: '',
    photo: '',
  });

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Localização');
      return true;
    });
    loadingUser();
  }, []);

  async function loadingUser() {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    setUser(user);
    let language = await AsyncStorage.getItem('language');
    setLanguage(language);
  }

  function alertLanguage() {
    Alert.alert('', 'Para atualizar a linguagem, reinicie o aplicativo', [
      {
        text: 'Fechar',
      },
    ]);
  }

  const {t, i18n} = useTranslation();

  return (
    <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
      <Header rota="Localização" />
      <ScrollView style={{backgroundColor: '#f0f0f0'}}>
        <Container style={{margin: 25}}>
          <View
            style={{
              alignItems: 'center',
              width: '100%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}>
              <ImageBackground
                source={
                  !user
                    ? man
                    : user.user_type == 'user'
                    ? user.photo_url
                      ? {uri: user.photo_url}
                      : man
                    : user.brand_url
                    ? {uri: user.brand_url}
                    : man
                }
                imageStyle={{
                  width: 120,
                  height: 120,
                  borderRadius: 75,
                }}
                style={{
                  width: 120,
                  height: 120,
                  marginBottom: 10,
                  borderRadius: 75,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}></ImageBackground>
            </View>
            {user ? (
              <>
                <TextUser>{user.name}</TextUser>
                <TextUser>
                  {user.user_type != 'user' ? t('Instituição') : t('Doador')}
                </TextUser>
                {user.user_type != 'user' && !!user.address && (
                  <TextUser>{user.address}</TextUser>
                )}
              </>
            ) : (
              <TextUser
                onPress={() => {
                  navigation.navigate('Cadastro');
                }}>
                {t('Cadastre-se no Aplicativo GS4 Social')}
              </TextUser>
            )}
          </View>
          {user && (
            <Option
              onPress={() => {
                navigation.navigate('Editar');
              }}>
              <Iconee
                name="pencil"
                style={{marginLeft: 12, marginRight: 12}}
                size={25}
                color={'#fff'}
              />
              <TextOption>{t('Alteração Cadastral')}</TextOption>
            </Option>
          )}

          <Option
            onPress={() => {
              if(Platform.OS ==="ios"){
                Linking.openURL(
                  'https://apps.apple.com/us/app/gs4-social/id1599009427',
                );
              }else{
                Linking.openURL(
                  'https://play.google.com/store/apps/details?id=com.gs4social',
                );
              }
            }}>
            <Iconee
              name="star"
              style={{marginLeft: 12, marginRight: 12}}
              size={25}
              color={'#fff'}
            />
            <TextOption>{t('Avaliar Aplicativo')}</TextOption>
          </Option>

          <Option
            onPress={() => {
              Linking.openURL('https://fb.com/gs4social');
            }}>
            <Icone
              name="facebook"
              style={{marginLeft: 12, marginRight: 10}}
              size={26}
              color={'#fff'}
            />
            <TextOption>Facebook</TextOption>
          </Option>

          <Option
            onPress={() => {
              Linking.openURL('https://www.instagram.com/gs4social/');
            }}>
            <Icon
              name="instagram"
              style={{marginLeft: 12, marginRight: 12}}
              size={25}
              color={'#fff'}
            />
            <TextOption>Instagram</TextOption>
          </Option>

          <Option
            onPress={async () => {
              setModal(true);
              // await AsyncStorage.setItem('language', 'pt');
              //navigation.navigate('Localização');
              //Linking.openURL('https://gs4social.com/report');
            }}>
            <Iconeee
              name="language"
              style={{marginLeft: 12, marginRight: 10}}
              size={26}
              color={'#fff'}
            />
            <TextOption>{t('Idioma')}</TextOption>
          </Option>
          <Option
            onPress={() => {
              Linking.openURL('https://gs4social.com/reporta-erro');
            }}>
            <Icone
              name="report"
              style={{marginLeft: 12, marginRight: 10}}
              size={26}
              color={'#fff'}
            />
            <TextOption>{t('Reportar Erro')}</TextOption>
          </Option>
          <Option
            onPress={() => {
              AsyncStorage.clear();
              navigation.navigate('Login');
            }}
            style={{
              marginTop: 25,
              backgroundColor: '#f45745',
            }}>
            <Icon
              name="log-out"
              style={{marginLeft: 12, marginRight: 10}}
              size={25}
              color={'#fff'}
            />
            <TextOption>{t('Sair do Aplicativo')}</TextOption>
          </Option>
        </Container>
      </ScrollView>
      <Modal
        backdropOpacity={0.5}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0,
        }}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onBackdropPress={() => setModal(false)}
        isVisible={modal}>
        <View
          style={{
            backgroundColor: '#fff',
            width: '85%',
            padding: 15,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{marginVertical: 5, fontSize: 15}}>
            {t('Idiomas Disponiveis')}
          </Text>
          <Option
            style={{
              backgroundColor:
                language == 'pt' || !language ? '#7ac5ce' : '#5f5f5f',
              width: '100%',
            }}
            onPress={() => {
              if (language == 'pt') {
                Alert.alert('', t('Linguagem atual do aplicativo'));
              } else {
                Alert.alert(
                  '',
                  t(
                    'Alteração da Linguagem do aplicativo para Português, deseja continuar?',
                  ),
                  [
                    {
                      text: t('Confirmar Alteração'),
                      onPress: async () => {
                        await AsyncStorage.setItem('language', 'pt');
                        setLanguage('pt');
                        alertLanguage();
                      },
                    },
                    {
                      text: t('Cancelar'),
                    },
                  ],
                );
              }
            }}>
            <Iconeee
              name="language"
              style={{marginLeft: 12, marginRight: 10}}
              size={25}
              color={'#fff'}
            />
            <TextOption>{t('Português')}</TextOption>
          </Option>
          <Option
            style={{
              backgroundColor:
                language == 'en' || !language ? '#7ac5ce' : '#5f5f5f',
              width: '100%',
            }}
            onPress={() => {
              if (language == 'en') {
                Alert.alert('', t('Linguagem atual do aplicativo'));
              } else {
                Alert.alert(
                  '',
                  t(
                    'Alteração da Linguagem do aplicativo para Inglês, deseja continuar?',
                  ),
                  [
                    {
                      text: t('Confirmar Alteração'),
                      onPress: async () => {
                        await AsyncStorage.setItem('language', 'en');
                        setLanguage('en');
                        alertLanguage();
                      },
                    },
                    {
                      text: t('Cancelar'),
                    },
                  ],
                );
              }
            }}>
            <Iconeee
              name="language"
              style={{marginLeft: 12, marginRight: 10}}
              size={25}
              color={'#fff'}
            />
            <TextOption>{t('Inglês')}</TextOption>
          </Option>{/*
          <Option
            style={{
              backgroundColor:
                language == 'fr' || !language ? '#7ac5ce' : '#5f5f5f',
              width: '100%',
            }}
            onPress={() => {
              if (language == 'fr') {
                Alert.alert('', t('Linguagem atual do aplicativo'));
              } else {
                Alert.alert(
                  '',
                  t(
                    'Alteração da Linguagem do aplicativo para Francês, deseja continuar?',
                  ),
                  [
                    {
                      text: t('Confirmar Alteração'),
                      onPress: async () => {
                        await AsyncStorage.setItem('language', 'fr');
                        setLanguage('fr');
                        alertLanguage();
                      },
                    },
                    {
                      text: t('Cancelar'),
                    },
                  ],
                );
              }
            }}>
            <Iconeee
              name="language"
              style={{marginLeft: 12, marginRight: 10}}
              size={25}
              color={'#fff'}
            />
            <TextOption>{t('Francês')}</TextOption>
          </Option>*/}
          <Option
            onPress={() => {
              setModal(false);
            }}
            style={{
              marginTop: 40,
              width: '100%',
              backgroundColor: '#f45745',
            }}>
            <Iconee
              name="close-circle"
              style={{marginLeft: 12, marginRight: 10}}
              size={25}
              color={'#fff'}
            />
            <TextOption>{t('Fechar')}</TextOption>
          </Option>
        </View>
      </Modal>
      <Footer />
    </View>
  );
}
