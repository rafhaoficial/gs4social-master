import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';

import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import logo from './../../images/logo.png';
import profile from './../../images/profile.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Header({ navigation, rota, data }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    loadingUser();
  }, []);

  async function loadingUser() {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    setUser(user);
  }

  return (
    <View
      style={{
        height: 55,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        elevation: 8,
        flexDirection: 'row',
        paddingHorizontal: 15,
      }}>
      <TouchableOpacity
        style={{ opacity: rota == 'Login' ? 0 : 1 }}
        disabled={rota == 'Login'}
        onPress={async () => {
          if (data) {
            navigation.navigate(rota, data);
          } else {
            navigation.navigate(rota);
          }
        }}>
        <Icon name={'arrow-left'} size={30} color={'#5a5a5a'} />
      </TouchableOpacity>
      <Image
        source={logo}
        style={{ width: '40%', height: 35 }}
        resizeMode="contain"
      />
      <TouchableOpacity
        onPress={() => {
          if (user) {
            if (user.user_type != 'user') {
              navigation.navigate('Profile', { data: user });
            } else {
              if (
                navigation.state.routeName != 'Localização' &&
                navigation.state.routeName != 'MinhasDoacoes' &&
                navigation.state.routeName != 'Menu'
              ) {
                navigation.navigate('Menu', { data: user });
              }
            }
          } else {
            Alert.alert(
              '',
              'Faça o login ou cadastro para acessar seu perfil',
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
        <Image
          source={
            !user
              ? profile
              : user.user_type == 'user'
                ? user.photo_url
                  ? { uri: user.photo_url }
                  : profile
                : user.brand_url
                  ? { uri: user.brand_url }
                  : profile
          }
          style={{ width: 38, height: 38, borderRadius: 20 }}
        />
      </TouchableOpacity>
    </View>
  );
}

export default withNavigation(Header);
