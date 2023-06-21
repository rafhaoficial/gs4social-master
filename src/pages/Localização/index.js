import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  BackHandler,
  Linking,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';

import Iconee from 'react-native-vector-icons/MaterialCommunityIcons';
import Icone from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {format} from 'date-fns';

import Modal from 'react-native-modal';

import apigs4 from '../../services/apigs4';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Header from '../../components/header';
import Footer from '../../components/Footer';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import pin from './../../images/pin.png';
import pin_alert from './../../images/pin_alert.png';
import {screenWidth} from './../../Const';

import {useTranslation} from 'react-i18next';
import ImageZoom from '../../components/ImageZoom';

export default function Localização({navigation}) {
  const mapRef = useRef();

  const [categorias, setCategorias] = useState({
    meio_ambiente: {
      id: 'meio_ambiente',
      visible: true,
      name: 'Meio Ambiente',
    },
    alimentos: {
      id: 'alimentos',
      visible: true,
      name: 'Alimentos',
    },
    saude: {id: 'saude', visible: true, name: 'Saúde'},
    habitacao: {
      id: 'habitacao',
      visible: true,
      name: 'Habitação',
    },
    educacao: {
      id: 'educacao',
      visible: true,
      name: 'Educação',
    },
    pets: {id: 'pets', visible: true, name: 'Pets'},
  });

  const [tipos, setTipos] = useState({
    ongs: {
      id: 'ongs',
      visible: true,
      name: 'ONGs',
    },
    publico: {
      id: 'publico',
      visible: true,
      name: 'Orgãos Públicos',
    },
    igrejas: {
      id: 'igrejas',
      visible: true,
      name: 'Igrejas',
    },
  });

  const [tiposAlert, setTiposAlert] = useState({
    pedinte: {
      id: 'pedinte',
      visible: true,
      name: 'Pedinte',
    },
    lixo: {
      id: 'lixo',
      visible: true,
      name: 'Lixo',
    },
    pet: {
      id: 'pet',
      visible: true,
      name: 'Pets',
    },
    'morador-rua': {
      id: 'morador-rua',
      visible: true,
      name: 'Modador de Rua',
    },
    'barraco-palafitas': {
      id: 'barraco-palafitas',
      visible: true,
      name: 'Barraco palafitas',
    },
  });

  const [visibleModalAlert, setVisibleModalAlert] = useState(false);
  const [alert, setAlert] = useState({
    created_at: new Date(),
    alert_images: [{photo_url: ''}],
    alert_type: 'lixo',
  });
  const [loading, setLoading] = useState(true);
  const [tipo, setTipo] = useState('categorias');
  const [selected, setSelected] = useState('alimentos');
  const [error, setError] = useState('');
  const [errorAlert, setErrorAlert] = useState('');
  const [institution, setInstitution] = useState({});
  const [visibleModalFilter, setVisibleModalFilter] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [search, setSearch] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [user, setUser] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [region, setRegion] = useState({
    latitude: -8.157422836361844,
    latitudeDelta: 0.06869164215614987,
    longitude: -34.91694012656808,
    longitudeDelta: 0.04203048053949356,
  });

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
    loadingUser();
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS == 'ios') {
      Geolocation.getCurrentPosition(
        (info) => {
          regiao = {
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          };
          mapRef.current.animateToRegion(regiao, 2000);
          setRegion(regiao);
        },
        (err) => console.log(err),
      );
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        let regiao = {};
        Geolocation.getCurrentPosition(
          (info) => {
            regiao = {
              latitude: info.coords.latitude,
              longitude: info.coords.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            };
            mapRef.current.animateToRegion(regiao, 2000);
            setRegion(regiao);
          },
          (err) => console.log(err),
        );
      } else {
        Alert.alert('', t('Não há permissão para geolocalização'));
      }
    }
  };

  async function loadingUser() {
    let user = await AsyncStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      setUser(user);
    }
  }

  async function seachrInstitutions(regiao) {
    setLoading(true);
    let location = {
      ...regiao,
      maxLatitude: 0,
      maxLongitude: 0,
      minLatitude: 0,
      minLongitude: 0,
    };

    location.minLatitude = location.latitude - location.latitudeDelta / 1.5;
    location.maxLatitude = location.latitude + location.latitudeDelta / 1.5;
    location.minLongitude = location.longitude - location.longitudeDelta / 1.5;
    location.maxLongitude = location.longitude + location.longitudeDelta / 1.5;

    await apigs4
      .get(
        `/institutions/all?min_latitude=${location.minLatitude}&max_latitude=${location.maxLatitude}&min_longitude=${location.minLongitude}&max_longitude=${location.maxLongitude}`,
      )
      .then(async (response) => {
        let institutions = [];
        response.data.map((item) => {
          if (categorias[item.category].visible && tipos[item.type].visible) {
            institutions.push(item);
          }
        });
        setInstitutions(institutions);

        setError('');
      })
      .catch((error) => {
        setError('Erro ao buscar instituições');
      });
    seachrAlerts(regiao);
  }

  async function seachrAlerts(regiao) {
    let location = {
      ...regiao,
      maxLatitude: 0,
      maxLongitude: 0,
      minLatitude: 0,
      minLongitude: 0,
    };

    location.minLatitude = location.latitude - location.latitudeDelta / 1.5;
    location.maxLatitude = location.latitude + location.latitudeDelta / 1.5;
    location.minLongitude = location.longitude - location.longitudeDelta / 1.5;
    location.maxLongitude = location.longitude + location.longitudeDelta / 1.5;

    await apigs4
      .get(
        `/alerts/p/?min_latitude=${location.minLatitude}&max_latitude=${location.maxLatitude}&min_longitude=${location.minLongitude}&max_longitude=${location.maxLongitude}`,
      )
      .then(async (response) => {
        let alerts = [];
        response.data.map((item) => {
          if (tiposAlert[item.alert_type].visible) {
            alerts.push(item);
          }
        });
        setAlerts(alerts);
        setErrorAlert('');
      })
      .catch((error) => {
        setErrorAlert('Erro ao buscar alertas');
      });
    setLoading(false);
  }

  const {t, i18n} = useTranslation();

  return (
    <>
      <Header rota="Login" />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <MapView
          showsUserLocation
          showsCompass
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          showsMyLocationButton={false}
          onRegionChangeComplete={(e) => {
            setRegion(e);
            console.log(e);
            if (e.latitudeDelta < 1 && e.longitudeDelta < 1) {
              seachrInstitutions(e);
            }
          }}
          customMapStyle={[
            {
              featureType: 'poi',
              elementType: 'labels.icon',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
          ]}
          initialRegion={region}
          style={{
            width: screenWidth,
            height: '100%',
            alignSelf: 'center',
          }}>
          {alerts.map((item, index) => {
            return (
              <Marker
                key={item.id}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                tracksViewChanges={!loading}
                onPress={async () => {
                  await apigs4
                    .get(`/alerts/p/${item.id}`)
                    .then(async (response) => {
                      console.log(response.data);
                      setAlert(response.data);
                      setVisibleModalAlert(true);
                    })
                    .catch((error) => {
                      setErrorAlert('Erro ao buscar alerta');
                    });
                }}>
                <Image
                  source={pin_alert}
                  style={{height: 35, width: 35}}
                  resizeMode="contain"
                />
              </Marker>
            );
          })}
          {institutions.map((item, index) => {
            return (
              <Marker
                key={item.id}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                tracksViewChanges={!loading}
                onPress={async () => {
                  let institution = item;
                  console.log(item);
                  setVisibleModal(true);
                  setSelected(institution.category);
                  setInstitution(institution);
                }}>
                <View style={{alignItems: 'center'}}>
                  <View
                    style={{
                      backgroundColor: 'rgba(110,110,110,0.9)',
                      marginBottom: 2,
                      borderRadius: 10,
                      padding: 2,
                      paddingHorizontal: 7,
                      color: '#FFF',
                      maxWidth: 180,
                    }}>
                    <Text
                      style={{
                        fontSize: 10,
                        color: '#FFF',
                        textAlign: 'center',
                      }}>
                      {item.name}
                    </Text>
                  </View>
                  <Image
                    source={pin}
                    style={{height: 35, width: 35}}
                    resizeMode="contain"
                  />
                </View>
              </Marker>
            );
          })}
        </MapView>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Listagem', {
              data: institutions,
              type: 'institutions',
            });
          }}
          style={{
            position: 'absolute',
            width: 'auto',
            minWidth: 120,
            paddingHorizontal: 15,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            height: 40,
            backgroundColor: error
              ? '#f54242'
              : region.latitudeDelta > 1 || region.longitudeDelta > 1
              ? '#4f4f4f'
              : '#7ac5ce',
            right: 10,
            bottom: 60,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: '#FFF',
            }}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : error ? (
              error
            ) : region.latitudeDelta > 1 || region.longitudeDelta > 1 ? (
              t('Aproxime mais o mapa')
            ) : institutions.length == 0 ? (
              t('Nenhuma instituição')
            ) : institutions.length == 1 ? (
              `1 ${t('Instituição')}`
            ) : (
              `${institutions.length} ${t('Instituições')}`
            )}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Listagem', {data: alerts, type: 'alerts'});
          }}
          style={{
            position: 'absolute',
            width: 'auto',
            minWidth: 120,
            paddingHorizontal: 15,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            height: 40,
            backgroundColor: errorAlert
              ? '#ed473b'
              : region.latitudeDelta > 1 || region.longitudeDelta > 1
              ? '#4f4f4f'
              : '#ed473b',
            right: 10,
            bottom: 10,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: '#FFF',
            }}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : errorAlert ? (
              errorAlert
            ) : region.latitudeDelta > 1 || region.longitudeDelta > 1 ? (
              t('Aproxime mais o mapa')
            ) : alerts.length == 0 ? (
              t('Nenhum alerta')
            ) : alerts.length == 1 ? (
              `1 ${t('alerta')}`
            ) : (
              `${alerts.length} ${t('alertas')}`
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: 'absolute',
            width: 48,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            height: 48,
            backgroundColor: '#7ac5ce',
            margin: 10,
            right: 0,
            elevation: 5,
            bottom: 100,
          }}
          onPress={() => {
            setTipo('categorias');
            setVisibleModalFilter(true);
          }}>
          <Icone name="filter" size={26} color={'#FFF'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            position: 'absolute',
            width: 48,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            height: 48,
            backgroundColor: '#7ac5ce',
            margin: 10,
            right: 0,
            elevation: 5,
            bottom: 155,
          }}
          onPress={() => setSearch(true)}>
          <Icone name="search" size={26} color={'#FFF'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            position: 'absolute',
            width: 48,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            height: 48,
            backgroundColor: '#7ac5ce',
            margin: 10,
            right: 0,
            elevation: 5,
            bottom: 210,
          }}
          onPress={() => {
            requestCameraPermission();
            Geolocation.getCurrentPosition((info) => {
              let regiao = {
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              };
              mapRef.current.animateToRegion(regiao, 2000);
            });
          }}>
          <Icon name="my-location" size={26} color={'#FFF'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: 'absolute',
            width: 48,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            height: 48,
            backgroundColor: '#ed473b',
            margin: 10,
            right: 0,
            elevation: 5,
            bottom: 265,
          }}
          onPress={() => {
            if (user) {
              navigation.navigate('AddAlert', {region});
            } else {
              Alert.alert(
                '',
                'Faça o login ou cadastro e uma doação para liberar função',
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
          <Iconee name="alert-plus" size={26} color={'#FFF'} />
        </TouchableOpacity>

        <Modal
          backdropOpacity={0.2}
          onSwipeComplete={() => setVisibleModalAlert(false)}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          onBackdropPress={() => setVisibleModalAlert(false)}
          swipeDirection={['down']}
          isVisible={visibleModalAlert}>
          <View
            style={{
              margin: 0,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}>
            <View
              style={{
                width: '25%',
                height: 5,
                backgroundColor: '#9f9f9f',
                borderRadius: 3,
                marginVertical: 10,
              }}></View>
            <Text
              style={{
                position: 'absolute',
                left: 20,
                top: 25,
                fontSize: 15,
                marginVertical: 1,
                fontWeight: 'bold',
                textAlign: 'left',
              }}>
              DATA {format(new Date(alert.created_at), 'dd/MM/yyyy HH:mm')}
            </Text>
            <View style={{padding: 28, marginTop: 5, width: '100%'}}>
              <View style={{width: '100%', alignItems: 'center'}}>
                <View
                  style={{
                    width: '90%',
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                  }}>
                  {alert.alert_images.map((item) => {
                    return (
                      <ImageZoom
                      imagem={
                        item.photo_url
                          ? {uri: item.photo_url}
                          : require('./../../images/profile.png')
                      }
                      tam={ 0.9 * 0.3}
                      resizeMode="cover"
                    />
                    );
                  })}
                </View>

                <Text
                  style={{
                    fontSize: 18,
                    marginTop: 20,
                    width: '85%',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {tiposAlert[alert.alert_type].name}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    marginTop: 8,
                    width: '80%',
                    textAlign: 'center',
                  }}>
                  {alert.description}
                </Text>
                <View
                  style={{
                    width: 120,
                    marginTop: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: 50,
                      height: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#ed473b',
                      borderRadius: 25,
                      paddingTop: 2,
                      paddingRight: 2,
                    }}
                    onPress={() => {
                      navigation.navigate('Navegacao', {
                        usuario: alert,
                        data: alerts,
                        type: 'alerts',
                        rota: 'Localização',
                      });
                    }}>
                    <Iconee name="near-me" size={26} color={'#FFF'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 50,
                      height: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#34af23',
                      borderRadius: 25,
                    }}
                    onPress={() => {
                      Linking.openURL(
                        'https://api.whatsapp.com/send?phone=558181978750',
                      );
                    }}>
                    <Iconee name="whatsapp" size={26} color={'#FFF'} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          backdropOpacity={0.2}
          onSwipeComplete={() => setVisibleModal(false)}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          onBackdropPress={() => setVisibleModal(false)}
          swipeDirection={['down']}
          isVisible={visibleModal}>
          <View
            style={{
              margin: 0,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}>
            <View
              style={{
                width: '25%',
                height: 5,
                backgroundColor: '#9f9f9f',
                borderRadius: 3,
                marginVertical: 10,
              }}></View>
            <View style={{padding: 20, width: '100%'}}>
              <View style={{width: '100%', alignItems: 'center'}}>
                <Image
                  source={
                    institution.brand_url
                      ? {uri: institution.brand_url}
                      : require('./../../images/profile.png')
                  }
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 100,
                    marginBottom: 5,
                  }}
                  resizeMode="cover"
                />
                <Text
                  style={{
                    fontSize: 18,
                    marginVertical: 1,
                    width: '85%',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {institution.name}
                </Text>
                <Text
                  onPress={() => {
                    Linking.openURL('tel:' + institution.contact);
                  }}
                  style={{
                    fontSize: 17,
                    marginVertical: 1,
                    width: '80%',
                    textAlign: 'center',
                  }}>
                  {institution.contact}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    marginVertical: 1,
                    width: '80%',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {t(categorias[selected].name)}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    marginVertical: 1,
                    width: '80%',
                    textAlign: 'center',
                  }}>
                  {institution.andress}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Profile', {data: institution});
                }}
                style={{
                  width: '100%',
                  borderRadius: 10,
                  backgroundColor: '#7ac5ce',
                  height: 50,
                  paddingHorizontal: 15,
                  marginTop: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 16, fontWeight: 'bold', color: '#FFF'}}>
                  {t('Visualizar Perfil')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          backdropOpacity={0.2}
          onSwipeComplete={() => setVisibleModalFilter(false)}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          onBackdropPress={() => setVisibleModalFilter(false)}
          swipeDirection={['down']}
          isVisible={visibleModalFilter}>
          <View
            style={{
              margin: 0,
              width: '100%',
              paddingHorizontal: 20,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}>
            <View
              style={{
                width: '25%',
                height: 5,
                backgroundColor: '#9f9f9f',
                borderRadius: 3,
                marginVertical: 10,
              }}></View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '900',
                textAlign: 'center',
                width: '95%',
                marginBottom: 20,
              }}>
              {t(
                'Marque/Desmarque as categorias e as organizações que deseja visualizar',
              )}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '95%',
                marginBottom: 20,
              }}>
              {Object.values(categorias).map((item) => {
                return (
                  <BouncyCheckbox
                    borderColor="#000"
                    isChecked={item.visible}
                    style={{width: '45%'}}
                    textDecoration={true}
                    textColor="#000"
                    fillColor="#7ac5ce"
                    text={t(item.name)}
                    key={item - 15}
                    onPress={(checked) => {
                      let cate = categorias;
                      cate[item.id].visible = checked;
                      setCategorias(cate);
                    }}
                  />
                );
              })}
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '95%',
                marginBottom: 20,
              }}>
              {Object.values(tipos).map((item) => {
                return (
                  <BouncyCheckbox
                    borderColor="#000"
                    isChecked={item.visible}
                    style={{width: '45%'}}
                    textDecoration={true}
                    textColor="#000"
                    fillColor="#7ac5ce"
                    text={t(item.name)}
                    key={item - 30}
                    onPress={(checked) => {
                      let cate = tipos;
                      cate[item.id].visible = checked;
                      setTipos(cate);
                    }}
                  />
                );
              })}
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '95%',
              }}>
              {Object.values(tiposAlert).map((item) => {
                return (
                  <BouncyCheckbox
                    borderColor="#000"
                    isChecked={item.visible}
                    style={{width: '45%'}}
                    textDecoration={true}
                    textColor="#000"
                    fillColor="#ed473b"
                    text={t(item.name)}
                    key={item - 30}
                    onPress={(checked) => {
                      let cate = tiposAlert;
                      cate[item.id].visible = checked;
                      setTiposAlert(cate);
                    }}
                  />
                );
              })}
            </View>
            <TouchableOpacity
              onPress={() => {
                seachrInstitutions(region);
                setVisibleModalFilter(false);
              }}
              style={{
                height: 50,
                width: '95%',
                backgroundColor: '#7ac5ce',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 20,
              }}>
              <Text style={{color: '#FFF', fontSize: 18, fontWeight: 'bold'}}>
                {t('Filtrar Instituições')}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          backdropOpacity={0.2}
          onSwipeComplete={() => setSearch(false)}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          onBackdropPress={() => setSearch(false)}
          swipeDirection={['down']}
          isVisible={search}>
          <KeyboardAvoidingView
            enabled={Platform.OS == 'ios'}
            behavior={'position'}
            contentContainerStyle={{
              margin: 0,
              width: '100%',
              height: 320,
              padding: 20,
              paddingTop: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}>
            <View
              style={{
                width: '25%',
                height: 5,
                backgroundColor: '#9f9f9f',
                borderRadius: 3,
                marginVertical: 10,
                marginBottom: 25,
              }}></View>
            <GooglePlacesAutocomplete
              placeholder={t('Pesquise cidade')}
              returnKeyType={'search'}
              scrollEnabled={true}
              fetchDetails
              onPress={async (data, details) => {
                let regiao = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  latitudeDelta: 0.15,
                  longitudeDelta: 0.15,
                };
                setSearch(false);
                mapRef.current.animateToRegion(regiao, 1000);
                seachrInstitutions(regiao);
              }}
              query={{
                key: 'AIzaSyDHiKSJE2umIoSpsdj0qnkbihIAR6sn-WY',
                language: 'pt',
                components: 'country:br',
              }}
              TextInputProps={{
                autoCapitalize: 'none',
                autoCorrect: false,
              }}
              enablePoweredByContainer={false}
              styles={{
                container: {
                  width: '90%',
                  flex: 1,
                },
                textInputContainer: {
                  flexDirection: 'row',
                  borderRadius: 5,
                },
                textInput: {
                  backgroundColor: '#FFFFFF',
                  height: 44,
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  fontSize: 15,
                  width: '100%',
                  flex: 1,
                },
                poweredContainer: {
                  borderRadius: 5,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  borderBottomRightRadius: 5,
                  borderBottomLeftRadius: 5,
                },
                powered: {},
                listView: {
                  borderRadius: 5,
                },
                row: {
                  backgroundColor: '#FFFFFF',
                  padding: 13,
                  borderRadius: 5,
                  height: 44,
                  marginBottom: 3,
                  flexDirection: 'row',
                },
                separator: {
                  backgroundColor: '#f0F0F0',
                },
                description: {
                  borderRadius: 5,
                },
                loader: {
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  height: 20,
                  borderRadius: 5,
                },
              }}
            />
          </KeyboardAvoidingView>
        </Modal>
      </View>
      <Footer />
    </>
  );
}
