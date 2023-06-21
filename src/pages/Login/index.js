import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Alert,
  ActivityIndicator,
  Keyboard,
  Animated,
} from 'react-native';

import {
  Container,
  Logo,
  InputView,
  Input,
  FooterView,
  ButtonRegister,
  TextRegister,
  ButtonLogin,
  TextLogin,
  TextPassword,
} from './styled';

import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from './../../images/logo.png';
import ou from './../../images/ou.png';
import Icone from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { screenWidth } from '../../Const';
import apigs4 from '../../services/apigs4';

const erros = {
  'auth/wrong-password': 'A senha é invalida para este usuário',
  'auth/user-not-found': 'Usuário não cadastrado ou incorreto',
  'auth/invalid-email': 'Email digitado é invalido',
  'auth/network-request-failed': 'Não há conexão com internet',
};

export default function Login({ navigation }) {
  const heightImage = useRef(new Animated.Value(120)).current;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visibilityPassword, setVisibilityPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        Animated.timing(heightImage, {
          toValue: 60,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        Animated.timing(heightImage, {
          toValue: 120,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const { t, i18n } = useTranslation();

  async function login() {
    setIsLoading(true);
    if (email && password) {
      await apigs4
        .post('/sessions', {
          email: email.toLowerCase().replace(/ /g, ''),
          password,
        })
        .then(async (response) => {
          let { token, user, user_type } = response.data;
          user.token = token;
          user.user_type = user_type;
          console.log(user);
          await AsyncStorage.setItem('user', JSON.stringify(user));
          navigation.navigate('Localização');
        })
        .catch((error) => {
          if (error.response.data.message) {
            if (error.response.data.validation) {
              if (
                error.response.data.validation.body.message ==
                '"email" must be a valid email'
              ) {
                Alert.alert('', 'Email inserido é inválido');
              } else {
                Alert.alert('', error.response.data.message);
              }
            } else {
              Alert.alert('', error.response.data.message);
            }
          } else {
            Alert.alert(
              '',
              'Erro interno ao fazer o login, verifique sua conexão ou entre em contato conosco.',
            );
          }
        });
    } else {
      Alert.alert('', t('Preencha o email e senha para efetuar o login'));
    }
    setIsLoading(false);
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <Container
        style={{ justifyContent: isKeyboardVisible ? 'flex-start' : 'center' }}>
        <Logo
          source={logo}
          style={{
            height: heightImage,
            width: 200,
            marginTop: isKeyboardVisible ? 100 : 0,
          }}
          resizeMode="contain"
        />
        <InputView style={{ height: 45 }}>
          <Icone
            name="person"
            style={{ marginLeft: 14, marginRight: 7 }}
            size={22}
            color={'#fff'}
          />
          <Input
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
            autoCapitalize="none"
            placeholderTextColor="#FFF"
            placeholder={t('Email')}
          />
        </InputView>
        <InputView style={{ height: 45 }}>
          <Icone
            name="lock"
            style={{ marginLeft: 14, marginRight: 7 }}
            size={22}
            color={'#fff'}
          />

          <Input
            secureTextEntry={!visibilityPassword}
            placeholderTextColor="#FFF"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
            }}
            placeholder={t('Senha')}
          />

          <Icone
            onPress={() => {
              setVisibilityPassword(!visibilityPassword);
            }}
            name={!visibilityPassword ? 'visibility' : 'visibility-off'}
            style={{ marginRight: 15 }}
            size={23}
            color={'#fff'}
          />
        </InputView>
        <ButtonLogin
          style={{ height: 45 }}
          disabled={isLoading}
          onPress={async () => {
            login();
          }}>
          {isLoading ? (
            <ActivityIndicator color="#fff"></ActivityIndicator>
          ) : (
            <TextLogin>{t('Entrar')}</TextLogin>
          )}
        </ButtonLogin>
        <TextPassword
          onPress={() => {
            navigation.navigate('ResetPassword');
          }}>
          {t('Esqueci Minha Senha')}
        </TextPassword>
      </Container>
      {!isKeyboardVisible && (
        <FooterView>
          <Image
            style={{ width: screenWidth * 0.8 }}
            resizeMode="contain"
            source={ou}
          />
          <ButtonRegister
            onPress={() => {
              navigation.navigate('Cadastro');
            }}>
            <TextRegister>{t('Cadastre-se')}</TextRegister>
          </ButtonRegister>
          <ButtonRegister
            style={{ backgroundColor: '#8a8a8a' }}
            onPress={() => {
              navigation.navigate('Localização');
            }}>
            <TextRegister>{t('Entrar sem Cadastro')}</TextRegister>
          </ButtonRegister>
        </FooterView>
      )}
    </View>
  );
}
