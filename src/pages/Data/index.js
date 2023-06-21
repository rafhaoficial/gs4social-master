import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Linking,
  ImageBackground,
  Alert,
  BackHandler,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import Header from '../../components/header';
import {Texto, TextoMenu, Container, ViewInput, Input} from './styles';
import apigs4 from '../../services/apigs4';

export default function Data({navigation}) {
  const [profile, setProfile] = useState({});
  const [user, setUser] = useState({});
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [information, setInformation] = useState('');
  const [action, setAction] = useState('');
  const [type, setType] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    let profile = navigation.getParam('data');
    setProfile(profile);
    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Profile', {data: profile});
      return true;
    });
    let dados = navigation.getParam('dados');
    if (dados) {
      setId(dados.id);
      setTitle(dados.title);
      setInformation(dados.information);
      setType(dados.type);
      setAction(dados.action_type);
      setEdit(true);
    }
    loadingUser();
  }, []);

  async function loadingUser() {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    setUser(user);
  }

  async function createAndEditInfo() {
    setIsLoading(true);
    if (!title || !type || !information || !action) {
      Alert.alert('', t('Preencha todos os campos'));
    } else {
      if (edit) {
        await apigs4
          .put(
            `/institution-info/${id}`,
            {
              title,
              information,
              type,
              action_type: action,
            },
            {
              headers: {Authorization: `Bearer ${user.token}`},
            },
          )
          .then(async (response) => {
            Alert.alert(
              '',
              t('Informação editada com sucesso'),
              [
                {
                  text: t('Ver Perfil'),
                  onPress: () => {
                    navigation.navigate('Profile', {data: profile});
                  },
                },
                {
                  text: t('Continuar Edição'),
                },
              ],
              {onDismiss: () => {}, cancelable: true},
            );
          })
          .catch((error) => {
            Alert.alert(
              '',
              t('Não foi possivel editar informação, verifique sua conexão.'),
            );
          });
      } else {
        await apigs4
          .post(
            '/institution-info',
            {
              title,
              information,
              type,
              action_type: action,
            },
            {
              headers: {Authorization: `Bearer ${user.token}`},
            },
          )
          .then(async (response) => {
            Alert.alert(
              '',
              t('Informação adicionada ao seu perfil com sucesso'),
              [
                {
                  text: t('Ver Perfil'),
                  onPress: () => {
                    navigation.navigate('Profile', {data: profile});
                  },
                },
                {
                  text: t('Adicionar Nova Informação'),
                  onPress: () => {
                    setTitle('');
                    setInformation('');
                    setType('');
                    setAction('');
                    setId('');
                    setEdit(false);
                  },
                },
              ],
              {onDismiss: () => {}, cancelable: true},
            );
          })
          .catch((error) => {
            Alert.alert(
              '',
              t(
                'Não foi possivel adicionar nova informação, verifique sua conexão.',
              ),
            );
          });
      }
    }

    setIsLoading(false);
  }
  const {t, i18n} = useTranslation();

  return (
    <View style={{flex: 1, backgroundColor: '#F0F0F0', width: '100%'}}>
      <Header rota="Profile" data={{data: profile}} />
      <ScrollView>
        <Container>
          <ViewInput>
            <Text>{t('Titulo')}</Text>
            <Input
              value={title}
              onChangeText={(text) => {
                setTitle(text);
              }}
              multiline={true}
              style={{minHeight: 40}}
              placeholder={t('Titulo da informação')}></Input>
          </ViewInput>

          <ViewInput>
            <Text>{t('Informação')}</Text>
            <Input
              value={information}
              onChangeText={(text) => {
                setInformation(text);
              }}
              multiline={true}
              style={{minHeight: 80}}
              placeholder="..."></Input>
          </ViewInput>

          <ViewInput style={{height: Platform.OS == 'android' ? 55 : 150}}>
            <Text>{t('Tipo de Informação')}</Text>
            <Picker
              style={{width: '90%'}}
              selectedValue={type}
              itemStyle={{height: Platform.OS == 'android' ? 55 : 120}}
              onValueChange={(value) => {
                setType(value);
              }}>
              <Picker.Item key={0} value={null} label={t('Selecione o Tipo')} />
              <Picker.Item
                key={1}
                value={'informacao'}
                label={t('Informação')}
              />
              <Picker.Item
                key={2}
                value={'transparencia'}
                label={t('Transparência')}
              />
              <Picker.Item key={2} value={'doacao'} label={t('Doação')} />
            </Picker>
          </ViewInput>

          <ViewInput style={{height: Platform.OS == 'android' ? 55 : 150}}>
            <Text>{t('Tipo de Ação')}</Text>
            <Picker
              style={{width: '90%'}}
              selectedValue={action}
              itemStyle={{height: Platform.OS == 'android' ? 55 : 120}}
              onValueChange={(value) => {
                setAction(value);
              }}>
              <Picker.Item
                key={0}
                value={null}
                label={t('Selecione uma Ação')}
              />
              <Picker.Item
                key={1}
                value={'vizualizar'}
                label={t('Apenas Vizualização')}
              />
              <Picker.Item
                key={2}
                value={'redirecionar'}
                label={t('Redirecionar para Link')}
              />
              <Picker.Item key={4} value={'copiar'} label={t('Copiar Dado')} />
            </Picker>
          </ViewInput>

          <TouchableOpacity
            disabled={isLoading}
            onPress={() => {
              createAndEditInfo();
            }}
            style={{
              width: '90%',
              borderRadius: 10,
              backgroundColor: '#7ac5ce',
              height: 60,
              paddingHorizontal: 15,
              marginVertical: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {isLoading ? (
              <ActivityIndicator color="#FFF" size="large" />
            ) : (
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  marginTop: 2,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                {edit ? t('Editar') : t('Adicionar')} {t('Informação')}
              </Text>
            )}
          </TouchableOpacity>
        </Container>
      </ScrollView>
    </View>
  );
}
