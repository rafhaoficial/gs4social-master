import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
  Linking,
  ScrollView,
} from 'react-native';

import {useTranslation} from 'react-i18next';
import Header from '../../components/header';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import pets from './../../images/pets.png';
import alimentos from './../../images/alimentos.png';
import saude from './../../images/saude.png';
import habitacao from './../../images/habitacao.png';
import meio_ambiente from './../../images/meio_ambiente.png';
import doacoes from './../../images/doacoes.png';
import educacao from './../../images/educacao.png';
import Modal from 'react-native-modal';
import Footer from '../../components/Footer';
import apigs4 from '../../services/apigs4';
import {screenWidth} from '../../Const';
import {format} from 'date-fns';
import ImageZoom from '../../components/ImageZoom';

const alert_type = {
  pedinte: 'Pedinte',
  'morador-rua': 'Modador de Rua',
  pet: 'Pets',
  lixo: 'Lixo',
  'barraco-palafitas': 'Barraco palafitas',
};
const categorias = {
  meio_ambiente: {
    id: 'meio_ambiente',
    visible: true,
    name: 'Meio ambiente',
    image: meio_ambiente,
  },
  doacoes: {id: 'doacoes', visible: true, name: 'Doações', image: doacoes},
  alimentos: {
    id: 'alimentos',
    visible: true,
    name: 'Alimentos',
    image: alimentos,
  },
  saude: {id: 'saude', visible: true, name: 'Saúde ', image: saude},
  habitacao: {
    id: 'habitacao',
    visible: true,
    name: 'Habitação',
    image: habitacao,
  },
  educacao: {
    id: 'educacao',
    visible: true,
    name: 'Educação',
    image: educacao,
  },
  pets: {id: 'pets', visible: true, name: 'Pets', image: pets},
};

export default function Listagem({navigation}) {
  const [institutions, setInstitutions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [type, setType] = useState('institutions');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    created_at: new Date(),
    alert_images: [{photo_url: ''}],
  });
  const [visibleModalAlert, setVisibleModalAlert] = useState(false);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Localização');
      return true;
    });
    let type = navigation.getParam('type');
    console.log(type);
    if (type == 'institutions') {
      loadingInstitutions();
    } else {
      loadingAlerts();
    }
  }, []);

  async function loadingInstitutions() {
    let institutions = await navigation.getParam('data');
    if (institutions) {
      setInstitutions(institutions);
    }
    setType('institutions');
  }
  async function loadingAlerts() {
    let alerts = await navigation.getParam('data');
    if (alerts) {
      setAlerts(alerts);
    }
    console.log(alerts);
    setType('alerts');
  }

  async function seachrInstitutions(regiao) {
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
          if (categorias[item.category].visible) {
            institutions.push(item);
          }
        });
        setInstitutions(institutions);
      })
      .catch((error) => {
        Alert.alert(
          '',
          t(
            'Não foi possivel buscar instituições nessa região, verifique sua conexão e tente novamente',
          ),
        );
      });
  }

  async function seachralerts(regiao) {
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
        `/alerts/all?min_latitude=${location.minLatitude}&max_latitude=${location.maxLatitude}&min_longitude=${location.minLongitude}&max_longitude=${location.maxLongitude}`,
      )
      .then(async (response) => {
        let alertss = [];
        response.data.map((item) => {
          alertss.push(item);
        });
        setAlerts(alertss);
      })
      .catch((error) => {
        Alert.alert(
          '',
          t(
            'Não foi possivel buscar alertas nessa região, verifique sua conexão e tente novamente',
          ),
        );
      });
  }
  const {t, i18n} = useTranslation();

  return (
    <View style={{backgroundColor: '#f0f0f0', flex: 1}}>
      <Header rota="Localização" />
      <View
        style={{
          width: '90%',
          backgroundColor: '#f0f0f0',
          borderRadius: 10,
          marginVertical: 15,
          marginLeft: '5%',
          flexDirection: 'row',
        }}>
        <GooglePlacesAutocomplete
          placeholder={t('Pesquise cidade')}
          returnKeyType={'search'}
          scrollEnabled={true}
          fetchDetails
          onPress={(data, details) => {
            let regiao = {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            };
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
          placeholderTextColor="#999"
          enablePoweredByContainer={false}
          styles={{
            container: {
              width: '100%',
              flex: 1,
            },
            textInputContainer: {
              flexDirection: 'row',
              borderRadius: 10,
            },
            textInput: {
              backgroundColor: '#fff',
              height: 55,
              borderRadius: 10,
              paddingVertical: 5,
              fontSize: 15,
              width: '100%',
              flex: 1,
            },
            poweredContainer: {
              borderRadius: 10,
              justifyContent: 'flex-end',
              alignItems: 'center',
              borderBottomRightRadius: 5,
              borderBottomLeftRadius: 5,
            },
            powered: {},
            listView: {
              borderRadius: 10,
              height: 200,
            },
            row: {
              backgroundColor: '#fff',
              padding: 13,
              borderRadius: 10,
              height: 44,
              marginBottom: 3,
              flexDirection: 'row',
            },
            separator: {
              backgroundColor: '#f0F0F0',
            },
            description: {
              borderRadius: 10,
            },
            loader: {
              flexDirection: 'row',
              justifyContent: 'flex-end',
              height: 20,
              borderRadius: 10,
            },
          }}
        />
      </View>
      <ScrollView
        style={{
          backgroundColor: '#f0f0f0',
        }}>
        <View
          style={{
            flex: 1,
            width: '100%',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
          }}>
          {type == 'institutions' ? (
            <>
              {institutions.length == 0 ? (
                <Text
                  style={{
                    width: '90%',
                    padding: 15,
                    paddingHorizontal: 50,
                    fontWeight: 'bold',
                    fontSize: 16,
                    backgroundColor: '#F0f0f0',
                    marginVertical: 15,
                    borderRadius: 12,
                    textAlign: 'center',
                  }}>
                  {t('Nenhuma instituição encontrada nessa região')}
                </Text>
              ) : (
                <>
                  {institutions.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          navigation.navigate('Profile', {data: item});
                        }}
                        style={{
                          width: '90%',
                          padding: 10,
                          backgroundColor: '#fff',
                          marginBottom: 15,
                          minHeight: 120,
                          borderRadius: 12,
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            width: (screenWidth * 0.9 - 20) * 0.28,
                            height: (screenWidth * 0.9 - 20) * 0.28,
                          }}>
                          <Image
                            source={
                              item.brand_url
                                ? {uri: item.brand_url}
                                : require('./../../images/profile.png')
                            }
                            style={{
                              width: (screenWidth * 0.9 - 20) * 0.28,
                              height: (screenWidth * 0.9 - 20) * 0.28,
                              borderRadius: 90,
                            }}
                            resizeMode="cover"
                          />
                        </View>
                        <View
                          style={{
                            width: (screenWidth * 0.9 - 20) * 0.68,
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
                              marginVertical: 1,
                              width: '100%',
                              fontWeight: 'bold',
                              textAlign: 'center',
                            }}>
                            {item.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              marginVertical: 1,
                              width: '100%',
                              textAlign: 'center',
                            }}>
                            {item.contact}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              marginVertical: 1,
                              width: '100%',
                              fontWeight: 'bold',
                              textAlign: 'center',
                            }}>
                            {t(categorias[item.category].name)}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              marginVertical: 1,
                              width: '95%',
                              textAlign: 'center',
                            }}>
                            {item.andress}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
            </>
          ) : (
            <>
              {alerts.length == 0 ? (
                <Text
                  style={{
                    width: '90%',
                    padding: 15,
                    paddingHorizontal: 50,
                    fontWeight: 'bold',
                    fontSize: 16,
                    backgroundColor: '#F0f0f0',
                    marginVertical: 15,
                    borderRadius: 12,
                    textAlign: 'center',
                  }}>
                  {t('Nenhum alerta encontrado nessa região')}
                </Text>
              ) : (
                <>
                  {alerts.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
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
                        }}
                        style={{
                          width: '90%',
                          padding: 10,
                          backgroundColor: '#fff',
                          marginBottom: 15,
                          minHeight: 100,
                          borderRadius: 12,
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            position: 'absolute',
                            left: 12,
                            top: 12,
                            fontSize: 13,
                            marginVertical: 1,
                            fontWeight: 'bold',
                            textAlign: 'left',
                          }}>
                          {format(
                            new Date(item.created_at),
                            'dd/MM/yyyy HH:mm',
                          )}
                        </Text>

                        <View
                          style={{
                            width: '90%',
                            marginTop: 25,
                          }}>
                          <Text
                            style={{
                              fontSize: 18,
                              marginVertical: 1,
                              width: '100%',
                              textAlign: 'center',
                              fontWeight: 'bold',
                            }}>
                            {alert_type[item.alert_type]}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              marginVertical: 1,
                              width: '100%',
                              textAlign: 'center',
                            }}>
                            {item.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
      <Footer />

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
                {alert_type[alert.alert_type]}
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
                      rota: 'Listagem',
                    });
                  }}>
                  <Icon name="near-me" size={26} color={'#FFF'} />
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
                  <Icon name="whatsapp" size={26} color={'#FFF'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
