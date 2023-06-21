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

import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import Header from '../../components/header';

import {useTranslation} from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format, compareDesc} from 'date-fns';

import {Texto, TextoMenu, Container, ViewInput, Input} from './styles';
import apigs4 from '../../services/apigs4';
import {searchDate} from '../../Const';

export default function Campanha({navigation}) {
  const [profile, setProfile] = useState({});
  const [create, setCreate] = useState(true);
  const [user, setUser] = useState({});
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [date_initial, setDate_initial] = useState(new Date());
  const [modalInitial, setModalInitial] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalEnd, setModalEnd] = useState(false);
  const [date_end, setDate_end] = useState(new Date());
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState({
    uri: '',
  });
  const [id, setId] = useState('');

  useEffect(() => {
    loadingUser();
    let profile = navigation.getParam('data');
    let campaign = navigation.getParam('campaign');
    console.log(campaign);
    if (campaign) {
      console.log(campaign);
      setCreate(false);
      setTitle(campaign.title);
      setDescription(campaign.description);
      setId(campaign.id);
      setDate_initial(searchDate(campaign.date_initial));
      setDate_end(searchDate(campaign.date_end));
      setPhoto({uri: campaign.photo_url});
    }
    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Profile', {data: profile});
      return true;
    });
    setProfile(profile);
  }, []);

  async function loadingUser() {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    setUser(user);
    console.log(user);
  }

  async function createAndEditCampaing() {
    setIsLoading(true);

    if (!title || !description || !date_end || !date_initial || !photo.uri) {
      Alert.alert('', t('Preencha todos os campos'));
    } else {
      const dataUp = new FormData();
      dataUp.append('title', title);
      dataUp.append('description', description);
      dataUp.append(
        'date_initial',
        format(new Date(date_initial), 'dd/MM/yyyy'),
      );
      dataUp.append('date_end', format(new Date(date_end), 'dd/MM/yyyy'));
      if (photo.fileName) {
        dataUp.append('file', {
          uri: photo.uri,
          type: photo.type,
          name: photo.fileName,
        });
      }
      if (create) {
        await apigs4
          .post(`/institution-campaign`, dataUp, {
            headers: {Authorization: `Bearer ${user.token}`},
          })
          .then((response) => {
            console.log(response.data);

            Alert.alert('', t('Campanha adicionada com sucesso'), [
              {
                text: t('Ver Perfil'),
                onPress: () => {
                  navigation.navigate('Profile', {data: profile});
                },
              },
              {
                text: t('Adicionar Nova Campanha'),
                onPress: () => {
                  setTitle('');
                  setDescription('');
                  setDate_initial(new Date());
                  setDate_end(new Date());
                  setPhoto('');
                  setCreate(true);
                },
              },
            ]);

            console.log(response.data);
          })
          .catch((error) => {
            console.log(error.response.data);
            Alert.alert(
              '',
              t('Verifique sua conexão com a internet e tente novamente'),
            );
          });
      } else {
        await apigs4
          .put(`/institution-campaign/${id}`, dataUp, {
            headers: {Authorization: `Bearer ${user.token}`},
          })
          .then((response) => {
            console.log(response.data);

            Alert.alert('', t('Campanha editada com sucesso'), [
              {
                text: t('Ver Perfil'),
                onPress: () => {
                  navigation.navigate('Profile', {data: profile});
                },
              },
              {
                text: t('Continuar Edição'),
              },
            ]);

            console.log(response.data);
          })
          .catch((error) => {
            console.log(error.response.data);
            Alert.alert(
              '',
              t('Verifique sua conexão com a internet e tente novamente'),
            );
          });
      }
    }
    setIsLoading(false);
  }

  async function submitImage() {
    let options = {
      noData: true,
      mediaType: 'photo',
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('MODAL CANCELADO');
      } else if (response.error) {
        console.log('Error' + response.error);
      } else {
        setPhoto(response);
      }
    });
  }

  const {t, i18n} = useTranslation();

  return (
    <View style={{flex: 1, backgroundColor: '#f0f0f0', width: '100%'}}>
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
              placeholder={t('Campanha voltada para arrecadar fundos')}></Input>
          </ViewInput>

          <ViewInput>
            <Text>{t('Imagem')}</Text>
            <ImageBackground
              source={{uri: photo.uri}}
              style={{width: '100%', height: 250, marginVertical: 8}}
              resizeMode="contain">
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => submitImage()}>
                <Text
                  style={{
                    width: '70%',
                    borderRadius: 10,
                    padding: 8,
                    textAlign: 'center',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                  }}>
                  {t('Clique para selecionar uma imagem da campanha')}
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </ViewInput>

          <ViewInput>
            <Text>{t('Descrição')}</Text>
            <Input
              value={description}
              onChangeText={(text) => {
                setDescription(text);
              }}
              multiline={true}
              style={{minHeight: 120}}
              placeholder={t('Descreva aqui toda a campanha')}></Input>
          </ViewInput>

          <ViewInput style={{width: Platform.OS == 'ios' ? '90%' : '40%'}}>
            <Text>{t('Data Inicial')}</Text>
            <TouchableOpacity
              disabled={Platform.OS == 'ios' ? true : false}
              style={{
                height: Platform.OS == 'ios' ? 120 : 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setModalInitial(true);
              }}>
              {(modalInitial || Platform.OS == 'ios') && (
                <DateTimePicker
                  style={{width: '100%', height: 120}}
                  testID="dateTimePicker"
                  value={date_initial}
                  mode={'date'}
                  minimumDate={date}
                  display={Platform.OS == 'ios' ? 'spinner' : 'default'}
                  textColor="#000"
                  locale="pt-BR"
                  onChange={(data, date) => {
                    if (data.type != 'dismissed') {
                      setDate_initial(date);
                      if (compareDesc(date, date_end) == -1) {
                        setDate_end(date);
                      }
                    }
                    setModalInitial(false);
                  }}
                />
              )}
              {Platform.OS != 'ios' && (
                <Text style={{fontSize: 20}}>{`${format(
                  new Date(date_initial),
                  'dd/MM/yyyy',
                )}`}</Text>
              )}
            </TouchableOpacity>
          </ViewInput>

          <ViewInput
            style={{
              width: Platform.OS == 'ios' ? '90%' : '40%',
              marginLeft: Platform.OS == 'ios' ? '0%' : '10%',
            }}>
            <Text>{t('Data Final')}</Text>
            <TouchableOpacity
              disabled={Platform.OS == 'ios' ? true : false}
              style={{
                height: Platform.OS == 'ios' ? 120 : 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setModalEnd(true);
              }}>
              {(modalEnd || Platform.OS == 'ios') && (
                <DateTimePicker
                  style={{width: '100%', height: 120}}
                  testID="dateTimePicker"
                  value={date_end}
                  minimumDate={date_initial}
                  display={Platform.OS == 'ios' ? 'spinner' : 'default'}
                  textColor="#000"
                  locale="pt-BR"
                  onChange={(data, date) => {
                    if (data.type != 'dismissed') {
                      setDate_end(date);
                    }
                    setModalEnd(false);
                  }}
                />
              )}
              {Platform.OS != 'ios' && (
                <Text style={{fontSize: 20}}>{`${format(
                  new Date(date_end),
                  'dd/MM/yyyy',
                )}`}</Text>
              )}
            </TouchableOpacity>
          </ViewInput>
          <TouchableOpacity
            disabled={isLoading}
            onPress={() => {
              createAndEditCampaing();
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
                {create ? t('Adicionar') : t('Editar')} {t('Campanha')}
              </Text>
            )}
          </TouchableOpacity>
        </Container>
      </ScrollView>
    </View>
  );
}
