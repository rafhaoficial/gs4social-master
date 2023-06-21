import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { TextInputMask } from 'react-native-masked-text';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Modal from 'react-native-modal';
import man from './../../images/profile.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';

import { Container, Input, ViewInput, TextoLogin, BotaoLogin, ViewInputPassword, InputPassword, TextInputPassword } from './style';
import Header from '../../components/header';
import Footer from '../../components/Footer';
import apigs4 from '../../services/apigs4';
import { estados } from '../../Const';

export default function Editar({ navigation }) {
  const mapRef = useRef();

  const [region, setRegion] = useState({
    latitude: 0.5,
    longitude: 0.5,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
  });
  const [name, setName] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [andress, setAndress] = useState('');
  const [category, setCategory] = useState('');
  const [tipo, setTipo] = useState('');
  const [data, setData] = useState('');
  const [dataConfirm, setDataConfirm] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [viewSenha, setViewSenha] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalDelet, setVisibleModalDelet] = useState(false);
  const [visibleModalConfirm, setVisibleModalConfirm] = useState(false);
  const [visiblePasswordDelet, setVisiblePasswordDelet] = useState(false);
  const [passwordDelet, setPasswordDelet] = useState('');
  const [user, setUser] = useState({});
  const [type, setType] = useState('user');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [instagram, setInstagram] = useState('');
  const [description, setDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [acceptAlert, setAcceptAlert] = useState(false);
  const [acceptReports, setAcceptReports] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    Geolocation.getCurrentPosition((info) => {
      let regiao = {
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
        latitudeDelta: 0.02843,
        longitudeDelta: 0.02144,
      };
      setRegion(regiao);
    });
    loadingUser();
  }, []);

  async function loadingUser() {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    console.log(user);
    setType(user.user_type);
    if (user.user_type == 'user') {
      setName(user.name);
      setPhone_number(user.phone_number);
      setPhotoUrl(user.photo_url);
      setCity(user.city);
      setState(user.state);
      setAcceptAlert(user.accept_alerts);
      setUser(user);
      setLoading(false)
    } else {
      setLatitude(user.latitude);
      setLongitude(user.longitude);
      setCategory(user.category);
      setName(user.name);
      setPhone_number(user.contact);
      setAndress(user.andress);
      setPhotoUrl(user.brand_url);
      setInstagram(user.instagram);
      setWhatsapp(user.whatsapp);
      setCity(user.city);
      setState(user.state);
      setDescription(user.description);
      setAcceptAlert(user.accept_alerts);
      setAcceptReports(user.accept_reports);
      let regiao = {
        latitude: user.latitude,
        longitude: user.longitude,
        latitudeDelta: 0.02843,
        longitudeDelta: 0.02144,
      };
      setUser(user);
      setLoading(false)
      mapRef.current.animateToRegion(regiao, 1000);
    }
  }

  async function editUser() {
    setCarregando(true);
    if (type != 'user') {
      if (
        name &&
        phone_number &&
        category &&
        latitude &&
        longitude &&
        andress
      ) {
        await apigs4
          .put(
            `/institutions`,
            {
              name,
              contact: phone_number,
              latitude,
              longitude,
              andress,
              category,
              whatsapp,
              instagram,
              city,
              state,
              description,
              accept_alerts: acceptAlert,
              accept_reports: acceptReports,
            },
            {
              headers: { Authorization: `Bearer ${user.token}` },
            },
          )
          .then(async (response) => {
            console.log(response.data)
            let userEdit = user;
            userEdit.name = name;
            userEdit.contact = phone_number;
            userEdit.latitude = latitude;
            userEdit.longitude = longitude;
            userEdit.andress = andress;
            userEdit.category = category;
            userEdit.whatsapp = whatsapp;
            userEdit.description = description;
            userEdit.instagram = instagram;
            userEdit.state = state;
            userEdit.city = city;
            userEdit.accept_reports = acceptReports;
            userEdit.accept_alerts = acceptAlert;
            await AsyncStorage.setItem('user', JSON.stringify(userEdit));
            Alert.alert('', t('Seus dados foram editados com sucesso'));
          })
          .catch((error) => {
            console.log(error.response.data);
            Alert.alert(
              '',
              t(
                'Não foi possivel editar seus dados, verifique sua conexão e tente novamente',
              ),
            );
          });
      } else {
        Alert.alert('', t('Preencha todos os campos'));
      }
    } else {
      if (name && phone_number) {
        await apigs4
          .put(
            `/users`,
            {
              name,
              phone_number,
              city,
              state,
              accept_alerts: acceptAlert,
            },
            {
              headers: { Authorization: `Bearer ${user.token}` },
            },
          )
          .then(async (response) => {
            let userEdit = user;
            userEdit.name = name;
            userEdit.accept_alerts = acceptAlert;
            userEdit.state = state;
            userEdit.city = city;
            userEdit.phone_number = phone_number;
            await AsyncStorage.setItem('user', JSON.stringify(userEdit));
            Alert.alert('', t('Seus dados foram editados com sucesso'));
          })
          .catch((error) => {
            Alert.alert(
              '',
              t(
                'Não foi possivel editar seus dados, verifique sua conexão e tente novamente',
              ),
            );
          });
      } else {
        Alert.alert('', t('Preencha todos os campos'));
      }
    }
    setCarregando(false);
  }

  async function uploadImage(image) {
    //setIsLoadingImage(true);
    console.log(image);
    const data = new FormData();
    data.append('file', {
      uri: image.uri,
      type: image.type,
      name: image.fileName,
    });
    console.log(user)
    await apigs4
      .put(
        `/${user.user_type == 'user' ? 'users/photo' : 'institutions/brand'}`,
        data,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      )
      .then(async (response) => {
        console.log(response.data);
        let userEdit = user;
        if (user.user_type == 'user') {
          userEdit.photo_url = image.uri;
        } else {
          userEdit.brand_url = image.uri;
        }
        setPhotoUrl(image.uri);
        setUser(userEdit);
        await AsyncStorage.setItem('user', JSON.stringify(userEdit));
        Alert.alert('', t('Imagem do perfil atualizada com sucesso'));
      })
      .catch((error) => {
        if (error.response.message) {

          Alert.alert('', error.response.message);
        }
        Alert.alert(
          '',
          t(
            'Não foi possivel atualizar a foto do perfil, verifique sua conexão e tente novamente',
          ),
        );
      });
  }


  async function deletAccount() {
    if (!passwordDelet) {
      Alert.alert('', "Digite a senha para prosseguir");
    } else {
      apigs4
        .post(`/users/delete`, {
          password: passwordDelet
        },
          {
            headers: { Authorization: `Bearer ${user.token}` }
          })
        .then(async (response) => {
          Alert.alert(':(', 'Sua conta foi excluida com sucesso, espero que você volte em breve.');
          setVisibleModalConfirm(false);
          AsyncStorage.clear();
          navigation.navigate('Login');
        })
        .catch((error) => {
          console.log(error.response.data)
          if (
            error.response.data.message ==
            'Senha incorreta'
          ) {
            Alert.alert('', 'Senha digita está incorreta');
          } else {
            Alert.alert('', 'Erro interno, verifique sua conexão e tente novamente ou entre em contato com nosso suporte para lhe auxiliar');
          }
        });
    }
  }

  const { t, i18n } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <Header rota="Menu" />
      <ScrollView>
        {
          loading ? (
            <ActivityIndicator color="#654" size={"large"} style={{ marginTop: 50 }} />
          ) : (
            <Container>
              <ImageBackground
                source={!user ? man : photoUrl ? { uri: photoUrl } : man}
                imageStyle={{
                  width: 120,
                  height: 120,
                  marginTop: 10,
                  borderRadius: 75,
                  marginLeft: 40,
                }}
                style={{
                  width: 200,
                  marginTop: 10,
                  height: 140,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
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
                        console.log(response);
                        uploadImage(response);
                      }
                    });
                  }}
                  style={{ position: 'absolute', top: 0, right: 15 }}>
                  <Icone name="image-search" size={30} color={'#5f5f5f'} />
                </TouchableOpacity>
              </ImageBackground>
              <ViewInput style={{ marginTop: 15 }}>
                <Icon
                  name="person"
                  style={{ marginLeft: 10, marginRight: 10 }}
                  size={25}
                  color={'#5f5f5f'}
                />
                <Input

                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                  }}
                  placeholderTextColor="#888"
                  placeholder="Nome*"></Input>
              </ViewInput>
              {type != 'user' && (
                <>
                  <ViewInput
                    style={{
                      height: 'auto',
                      marginBottom: 0,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }}>
                    <Icon
                      name="location-searching"
                      style={{ marginLeft: 10, marginRight: 10 }}
                      size={25}
                      color={'#5f5f5f'}
                    />
                    <GooglePlacesAutocomplete
                      placeholder={t('Rua App GS4 Social, 129') + '*'}
                      returnKeyType={'search'}
                      scrollEnabled={true}
                      listViewDisplayed={false}
                      fetchDetails
                      onPress={async (data, details) => {
                        let regiao = {
                          latitude: details.geometry.location.lat,
                          longitude: details.geometry.location.lng,
                          latitudeDelta: 0.005,
                          longitudeDelta: 0.005,
                        };
                        setLatitude(details.geometry.location.lat);
                        setLongitude(details.geometry.location.lng);
                        setandress(data.description);
                        mapRef.current.animateToRegion(regiao, 1000);
                      }}
                      query={{
                        key: 'AIzaSyDHiKSJE2umIoSpsdj0qnkbihIAR6sn-WY',
                        language: 'pt',
                      }}
                      TextInputProps={{
                        autoCapitalize: 'none',
                        autoCorrect: false,
                      }}
                      enablePoweredByContainer={false}
                      styles={{
                        container: {
                          backgroundColor: 'white',
                          width: '100%',
                        },
                        textInput: {
                          fontSize: 16,
                          paddingLeft: 0,
                          marginLeft: 0,
                          textAlign: 'left',
                        },
                        textInputContainer: {
                          flex: 1,
                          textAlign: 'left',
                          borderBottomWidth: 0,
                          borderTopWidth: 0,
                          backgroundColor: 'transparent',
                          margin: 3,
                          backgroundColor: 'white',
                        },
                        listView: {
                          paddingLeft: 0,
                          marginLeft: 0,
                          borderColor: '#0f0',
                          height: 240,
                        },
                        description: {
                          fontSize: 14,
                          fontWeight: 'bold',
                          opacity: 0.8,
                        },
                      }}
                    />
                  </ViewInput>

                  <MapView
                    showsUserLocation
                    initialRegion={region}
                    ref={mapRef}
                    onPress={(e) => {
                      let regiao = {
                        latitude: e.nativeEvent.coordinate.latitude,
                        longitude: e.nativeEvent.coordinate.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                      };
                      setLatitude(e.nativeEvent.coordinate.latitude);
                      setLongitude(e.nativeEvent.coordinate.longitude);
                      mapRef.current.animateToRegion(regiao, 1000);
                    }}
                    style={{
                      width: '90%',
                      height: 250,
                      alignSelf: 'center',
                      marginBottom: 20,
                      borderRadius: 25,
                    }}>
                    {longitude != 0 && (
                      <Marker
                        pinColor="red"
                        coordinate={{
                          longitude: parseFloat(longitude),
                          latitude: parseFloat(latitude),
                        }}
                      />
                    )}
                    <Text
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        borderRadius: 10,
                        padding: 5,
                      }}>
                      {t(
                        'Verifique se o local indicado acima está correta no mapa',
                      )}
                    </Text>
                  </MapView>
                  <ViewInput style={{ height: 'auto' }}>
                    <Icon
                      name="location-on"
                      style={{ marginLeft: 10, marginRight: 10 }}
                      size={25}
                      color={'#5f5f5f'}
                    />
                    <Input

                      placeholderTextColor="#888"
                      autoCapitalize="none"
                      multiline
                      value={andress}
                      onChangeText={(text) => {
                        setAndress(text);
                      }}
                      placeholder={t('Endereço Detalhado') + '*'}></Input>
                  </ViewInput>

                  <ViewInput style={{ height: Platform.OS == 'android' ? 55 : 120 }}>
                    <Icon
                      name="filter-list-alt"
                      style={{ marginLeft: 10, marginRight: 10 }}
                      size={25}
                      color={'#5f5f5f'}
                    />
                    <Picker
                      style={{ width: '90%' }}

                      itemStyle={{ height: Platform.OS == 'android' ? 55 : 120 }}
                      selectedValue={category}
                      onValueChange={(value) => {
                        setCategory(value);
                      }}>
                      <Picker.Item
                        key={0}
                        value={null}
                        label={t('Selecione uma Categoria')}
                      />
                      {type != 'publico' && (
                        <Picker.Item
                          key={1}
                          value={'doacoes'}
                          label={t('Doação')}
                        />
                      )}
                      <Picker.Item
                        key={4}
                        value={'alimentos'}
                        label={t('Alimentos')}
                      />
                      <Picker.Item key={5} value={'pets'} label={t('Pets')} />
                      <Picker.Item key={6} value={'saude'} label={t('Saúde')} />
                      <Picker.Item
                        key={2}
                        value={'meio_ambiente'}
                        label={t('Meio ambiente')}
                      />
                      <Picker.Item
                        key={3}
                        value={'habitacao'}
                        label={t('Habitação')}
                      />
                      <Picker.Item
                        key={3}
                        value={'educacao'}
                        label={t('Educação')}
                      />
                    </Picker>
                  </ViewInput>
                </>
              )}
              <ViewInput>
                <Icon
                  name="call"
                  style={{ marginLeft: 10, marginRight: 10 }}
                  size={25}
                  color={'#5f5f5f'}
                />
                <TextInputMask
                  type={'cel-phone'}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) ',
                  }}
                  value={phone_number}
                  onChangeText={(text) => {
                    setPhone_number(text);
                  }}
                  placeholderTextColor="#888"
                  placeholder="Telefone para contato*"
                />
              </ViewInput>
              {type != 'user' && (
                <>

                  <ViewInput>
                    <Icone
                      name="whatsapp"
                      style={{ marginLeft: 10, marginRight: 10 }}
                      size={25}
                      color={'#5f5f5f'}
                    />
                    <TextInputMask
                      type={'cel-phone'}
                      options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '(99) ',
                      }}
                      value={whatsapp}
                      onChangeText={(text) => {
                        setWhatsapp(text);
                      }}
                      placeholderTextColor="#888"
                      placeholder="Whatsapp"
                    />
                  </ViewInput>

                  <ViewInput>
                    <Icone
                      name="instagram"
                      style={{ marginLeft: 10, marginRight: 10 }}
                      size={25}
                      color={'#5f5f5f'}
                    />
                    <Input

                      value={instagram}
                      onChangeText={(text) => {
                        setInstagram(text);
                      }}
                      placeholderTextColor="#888"
                      placeholder="Instagram"></Input>
                  </ViewInput>
                  <ViewInput style={{ minHeight: 80 }}>
                    <Icon
                      name="description"
                      style={{ marginLeft: 10, marginRight: 10 }}
                      size={25}
                      color={'#5f5f5f'}
                    />
                    <Input

                      value={description}
                      onChangeText={(text) => {
                        setDescription(text);
                      }}
                      multiline
                      placeholderTextColor="#888"
                      placeholder="Descrição da sua instituição"></Input>
                  </ViewInput>
                </>
              )}
              <ViewInput style={{ height: Platform.OS == 'android' ? 55 : 150 }}>
                <Picker
                  style={{ width: '100%' }}
                  selectedValue={state}
                  itemStyle={{ height: Platform.OS == 'android' ? 55 : 120 }}
                  onValueChange={(value) => {
                    setState(value);
                    if (value == "") {
                      setAcceptAlert(false)
                      setAcceptReports(false)
                    }
                  }}>
                  <Picker.Item key={"placeholder"} value={""} label={"Selecione seu estado"} />
                  {
                    estados.map((item, index) => {
                      return (
                        <Picker.Item key={index} value={item.nome} label={item.nome} />)
                    })
                  }
                </Picker>
              </ViewInput>
              <ViewInput style={{ height: Platform.OS == 'android' ? 55 : 150 }}>
                <Picker
                  enabled={state ? true : false}
                  style={{ width: '100%' }}
                  selectedValue={city}
                  itemStyle={{ height: Platform.OS == 'android' ? 55 : 120 }}
                  onValueChange={(value) => {
                    setCity(value);
                    if (value == "") {
                      setAcceptAlert(false)
                      setAcceptReports(false)
                    }
                  }}>
                  <Picker.Item key={"placeholder"} value={""} label={"Selecione sua cidade"} />
                  {
                    estados.map((item) => {
                      if (item.nome == state) {
                        return (
                          item.cidades.map((data, index) => {
                            return (
                              <Picker.Item key={index} value={data} label={data} />
                            )
                          })
                        )

                      }
                    })
                  }
                </Picker>
              </ViewInput>
              <ViewInput>
                <Text style={{ flex: 1, paddingHorizontal: 15 }}>Aceita receber email de novas instituições na sua cidade?</Text>
                <Switch onValueChange={() => {
                  if (city && state) {
                    setAcceptAlert(!acceptAlert)
                  } else {
                    Alert.alert("", "Selecione seu estado e cidade para aceitar o recebimento.")
                  }
                }} value={acceptAlert} style={{ width: 50, justifyContent: "center" }} />
              </ViewInput>

              {type != 'user' && (
                <ViewInput>
                  <Text style={{ flex: 1, paddingHorizontal: 15 }}>Aceita receber email de novos alertas na sua cidade?</Text>
                  <Switch onValueChange={() => {
                    if (city && state) {
                      setAcceptReports(!acceptReports)
                    } else {

                      Alert.alert("", "Selecione seu estado e cidade para aceitar o recebimento.")
                    }
                  }} value={acceptReports} style={{ width: 50, justifyContent: "center" }} />
                </ViewInput>
              )}

              <BotaoLogin
                disabled={carregando}
                onPress={() => {
                  editUser();
                }}>
                {carregando ? (
                  <ActivityIndicator color="#FFF" size="large" />
                ) : (
                  <TextoLogin>{t('Salvar')}</TextoLogin>
                )}
              </BotaoLogin>
              <BotaoLogin
                style={{ marginBottom: 10, marginTop: 0, backgroundColor: '#5f5f5f' }}
                disabled={carregando}
                onPress={() => {
                  setVisibleModal(true);
                  setTipo('senha');
                  setData('');
                  setDataConfirm('');
                }}>
                <TextoLogin>{t('Alterar Senha')}</TextoLogin>
              </BotaoLogin>

              <BotaoLogin
                style={{ marginBottom: 10, marginTop: 0, backgroundColor: '#5f5f5f' }}
                onPress={() => {
                  setVisibleModal(true);
                  setTipo('email');
                  setData('');
                  setDataConfirm('');
                }}>
                <TextoLogin>{t('Alterar Email')}</TextoLogin>
              </BotaoLogin>

              <BotaoLogin
                style={{ marginBottom: 20, marginTop: 0, backgroundColor: '#F44040' }}
                onPress={() => {
                  setVisibleModalDelet(true);
                }}>
                <TextoLogin>{t('Excluir Conta')}</TextoLogin>
              </BotaoLogin>
            </Container>
          )
        }

      </ScrollView>
      <Footer />

      <Modal
        backdropOpacity={0.5}
        onSwipeComplete={() => setVisibleModal(false)}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        onBackdropPress={() => setVisibleModal(false)}
        swipeDirection={['down']}
        isVisible={visibleModal}>
        <KeyboardAvoidingView
          behavior={"position"}
          contentContainerStyle={{
            margin: 0,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <View
            style={{
              width: '25%',
              height: 5,
              backgroundColor: '#9f9f9f',
              borderRadius: 3,
              marginVertical: 15,
            }}></View>
          <View style={{ width: '95%', alignItems: 'center', marginTop: 10 }}>
            <ViewInput>
              <Icon
                name={tipo == 'senha' ? 'lock' : 'mail'}
                style={{ marginLeft: 10, marginRight: 10 }}
                size={25}
                color={'#5f5f5f'}
              />
              <Input

                placeholderTextColor="#888"
                secureTextEntry={tipo == 'senha' ? viewSenha : false}
                value={data}
                onChangeText={(text) => {
                  setData(text);
                }}
                placeholder={
                  tipo == 'senha'
                    ? t('Senha Atual') + '*'
                    : t('Novo Email') + '*'
                }
                style={{ paddingRight: 10 }}
              />
              {tipo == "senha" && (<Icon
                onPress={() => {
                  setViewSenha(!viewSenha);
                }}
                name={!viewSenha ? 'visibility' : 'visibility-off'}
                style={{ marginLeft: -5 }}
                size={23}
                color={'#5f5f5f'}
              />)}
            </ViewInput>
            <ViewInput>
              <Icon
                name={tipo == 'senha' ? 'lock' : 'mail'}
                style={{ marginLeft: 10, marginRight: 10 }}
                size={25}
                color={'#5f5f5f'}
              />
              <Input

                placeholderTextColor="#888"
                secureTextEntry={tipo == 'senha' ? viewSenha : false}
                value={dataConfirm}
                onChangeText={(text) => {
                  setDataConfirm(text);
                }}
                placeholder={
                  tipo == 'senha'
                    ? t('Nova Senha') + '*'
                    : t('Confirmar Email') + '*'
                }
                style={{ paddingRight: 10 }}
              />
              {tipo == "senha" && (<Icon
                onPress={() => {
                  setViewSenha(!viewSenha);
                }}
                name={!viewSenha ? 'visibility' : 'visibility-off'}
                style={{ marginLeft: -5 }}
                size={23}
                color={'#5f5f5f'}
              />)}
            </ViewInput>
            <BotaoLogin
              style={{ marginBottom: 20, marginTop: 0 }}
              disabled={carregando}
              onPress={async () => {
                if (data || dataConfirm) {
                  if (tipo == 'senha') {
                    await apigs4
                      .put(
                        `/users`,
                        {
                          old_password: data,
                          new_password: dataConfirm,
                        },
                        {
                          headers: { Authorization: `Bearer ${user.token}` },
                        },
                      )
                      .then(async (response) => {
                        Alert.alert('', t('Sua senha foi editada com sucesso'));
                        setVisibleModal(false);
                      })
                      .catch((error) => {
                        Alert.alert(
                          '',
                          t(
                            'Não foi possivel editar sua senha, verifique sua conexão e tente novamente',
                          ),
                        );
                      });
                  } else {
                    if (data == dataConfirm) {
                      await apigs4
                        .put(
                          `/users`,
                          {
                            email: data,
                          },
                          {
                            headers: { Authorization: `Bearer ${user.token}` },
                          },
                        )
                        .then(async (response) => {
                          Alert.alert(
                            '',
                            t('Seu email foi editada com sucesso'),
                            [
                              {
                                text: 'Fechar',
                              },
                            ],
                          );
                          setVisibleModal(false);
                        })
                        .catch((error) => {
                          Alert.alert(
                            '',
                            t(
                              'Não foi possivel editar seu email, verifique sua conexão e tente novamente',
                            ),
                          );
                        });
                    } else {
                      Alert.alert('', t('Os emails não correspondem'));
                    }
                  }
                } else {
                  Alert.alert(
                    '',
                    `${t('Preencha')} ${tipo == 'senha'
                      ? t('a senha atual e a nova senha')
                      : t('o novo email e a confirmação do email')
                    }`,
                  );
                }
              }}>
              {carregando ? (
                <ActivityIndicator color="#FFF" size="large" />
              ) : (
                <TextoLogin>{t('Confirmar alteração')}</TextoLogin>
              )}
            </BotaoLogin>
          </View>
        </KeyboardAvoidingView>
      </Modal>


      <Modal
        backdropOpacity={0.5}
        onSwipeComplete={() => setVisibleModalDelet(false)}
        testID={'modal'}
        style={{
          justifyContent: "center",
          alignItems: 'center',
          margin: 0,
        }}
        onBackdropPress={() => setVisibleModalDelet(false)}
        isVisible={visibleModalDelet}>
        <View
          style={{
            margin: 0,
            width: '80%',
            justifyContent: 'center',
            padding: 20,
            backgroundColor: '#fff',
            flexDirection: "row",
            flexWrap: "wrap",
            borderRadius: 20,
          }}>
          <Text style={{ fontSize: 17, textAlign: "center", marginBottom: 15 }}>Você tem certeza que quer apagar sua conta?</Text>

          <TouchableOpacity
            style={{ padding: 30, paddingVertical: 6, borderRadius: 10, backgroundColor: "#F44040", marginLeft: 10 }}
            onPress={() => {
              setVisibleModalDelet(false);
              setTimeout(() => {
                setVisibleModalConfirm(true);
              }, 500);
            }}>
            <Text style={{ fontSize: 15, textAlign: "center", color: "#FFF" }}>Sim</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 30, paddingVertical: 6, borderRadius: 10, backgroundColor: "#7ac5ce", marginLeft: 18 }}
            onPress={() => {
              setVisibleModalDelet(false);
            }}>
            <Text style={{ fontSize: 15, textAlign: "center", color: "#fff" }}>Não</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        backdropOpacity={0.5}
        onSwipeComplete={() => {
          setPasswordDelet("")
          setVisibleModalConfirm(false)
        }}
        testID={'modal'}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        onBackdropPress={() => {
          setPasswordDelet("")
          setVisibleModalConfirm(false)
        }}
        swipeDirection={['down']}
        isVisible={visibleModalConfirm}>
        <KeyboardAvoidingView
          behavior={"position"}
          contentContainerStyle={{
            margin: 0,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <View
            style={{
              height: 'auto',
              margin: 0,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
              backgroundColor: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <Text style={{ fontSize: 17, textAlign: "center", marginBottom: 20, width: "100%" }}>Confirma sua senha para prosseguir com a exclusão da conta</Text>

            <ViewInput style={{ backgroundColor: "#f0f0f0", alignItems: "center", width: "95%" }}>
              <Icon
                name={'lock'}
                style={{ marginLeft: 5, marginRight: 5 }}
                size={25}
                color={'#5f5f5f'}
              />
              <Input
                placeholderTextColor="#666"
                secureTextEntry={visiblePasswordDelet}
                autoCapitalize="none"
                value={passwordDelet}
                onChangeText={(text) => {
                  setPasswordDelet(text);
                }}
                style={{ padding: 0, flex: 1, fontSize: 15, marginRight: 5 }}
                placeholder="Senha"
              />
              <Icon
                onPress={() => {
                  let visibleDelet = !visiblePasswordDelet;
                  setVisiblePasswordDelet(visibleDelet);
                }}
                name={visiblePasswordDelet ? 'visibility' : 'visibility-off'}
                size={23}
                color={'#5f5f5f'}
              />
            </ViewInput>


            <BotaoLogin
              style={{ width: '95%', marginTop: 5, marginBottom: 5, backgroundColor: "#F44040" }}
              onPress={() => {
                deletAccount();
              }}>
              <TextoLogin>{t('Confirmar Exclusão')}</TextoLogin>
            </BotaoLogin>
          </View></KeyboardAvoidingView>
      </Modal>
    </View >
  );
}
