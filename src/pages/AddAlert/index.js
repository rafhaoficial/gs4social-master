import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import {TextInputMask} from 'react-native-masked-text';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import man from './../../images/profile.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';

import {
  Container,
  Input,
  ViewInput,
  TextButton,
  Button,
  TextInput,
  Imagem,
  ButtonImage,
  ViewImages,
} from './style';
import Header from '../../components/header';
import Footer from '../../components/Footer';
import apigs4 from '../../services/apigs4';
import pin from '../../images/pin_alert.png';

export default function AddAlert({navigation}) {
  const mapRef = useRef();

  const [region, setRegion] = useState(navigation.getParam('region'));
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [photo_1, setPhoto_1] = useState({uri: ''});
  const [photo_2, setPhoto_2] = useState({uri: ''});
  const [photo_3, setPhoto_3] = useState({uri: ''});
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [number, setNumber] = useState('');
  const [category, setCategory] = useState('');
  const [user, setUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadingUser();
  }, []);

  async function loadingUser() {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    setUser(user);
  }

  async function addAlert() {
    setIsLoading(true);
    const data = new FormData();
    if (description && type && latitude && longitude) {
      if (photo_1.uri != '') {
        data.append('files', {
          uri: photo_1.uri,
          type: photo_1.type,
          name: photo_1.fileName,
        });
      }

      if (photo_2.uri != '') {
        data.append('files', {
          uri: photo_2.uri,
          type: photo_2.type,
          name: photo_2.fileName,
        });
      }

      if (photo_3.uri != '') {
        data.append('files', {
          uri: photo_3.uri,
          type: photo_3.type,
          name: photo_3.fileName,
        });
      }

      data.append('latitude', latitude);
      data.append('longitude', longitude);
      data.append('description', description);
      data.append('alert_type', type);

      await apigs4
        .post(`/alerts`, data, {
          headers: {Authorization: `Bearer ${user.token}`},
        })
        .then(async (response) => {
          Alert.alert(
            '',
            'Alerta foi enviado com sucesso e será análisado pela nossa equipe, assim que aprovado ficara disponivel no mapa',
          );
          navigation.navigate('Localização');
        })
        .catch((error) => {
          if (error.response.data.message) {
            Alert.alert('', error.response.data.message);
          } else {
            Alert.alert(
              '',
              t(
                'Não foi possivel adicionar alerta, verifique sua conexão e tente novamente',
              ),
            );
          }
        });
    } else {
      Alert.alert('', t('Preencha todos os campos obrigátorios'));
    }
    setIsLoading(false);
  }

  const {t, i18n} = useTranslation();

  return (
    <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
      <Header
        rota="Localização"
        objeto={{region, institutions: [], alerts: []}}
      />
      <ScrollView>
        <Container>
          <TextInput>DESCREVA A SITUAÇÃO*</TextInput>
          <ViewInput>
            <Input
              value={description}
              onChangeText={(text) => {
                setDescription(text);
              }}
              placeholderTextColor="#888"
              placeholder="O que você está presenciando?*"></Input>
          </ViewInput>
          <TextInput>IMAGENS* ( MÁXIMO 3 )</TextInput>
          <ViewImages>
            <ButtonImage
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
                    setPhoto_1(response);
                  }
                });
              }}>
              <Imagem source={{uri: photo_1.uri}} />
              <Icone
                style={{position: 'absolute'}}
                name="image-search"
                size={30}
                color={photo_1.uri ? '#FFF' : '#5f5f5f'}
              />
            </ButtonImage>
            <ButtonImage
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
                    setPhoto_2(response);
                  }
                });
              }}>
              <Imagem source={{uri: photo_2.uri}} />
              <Icone
                style={{position: 'absolute'}}
                name="image-search"
                size={30}
                color={photo_2.uri ? '#FFF' : '#5f5f5f'}
              />
            </ButtonImage>
            <ButtonImage
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
                    setPhoto_3(response);
                  }
                });
              }}>
              <Imagem source={{uri: photo_3.uri}} />
              <Icone
                style={{position: 'absolute'}}
                name="image-search"
                size={30}
                color={photo_3.uri ? '#FFF' : '#5f5f5f'}
              />
            </ButtonImage>
          </ViewImages>
          <TextInput>LOCALIZAÇÃO*</TextInput>
          <ViewInput
            style={{
              height: 'auto',
              marginBottom: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}>
            <GooglePlacesAutocomplete
              placeholder={t('Rua App GS4 Social, 129') + '*'}
              returnKeyType={'search'}
              scrollEnabled={true}
              listViewDisplayed={false}
              fetchDetails
              placeholderTextColor="#999"
              onPress={async (data, details) => {
                console.log(data, details);
                let regiao = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                };
                setLatitude(details.geometry.location.lat);
                setLongitude(details.geometry.location.lng);
                let [street] = data.description.split('-');
                console.log(street);
                setStreet(street);
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
                  fontSize: 14,
                  paddingLeft: 0,
                  marginLeft: 0,
                  textAlign: 'left',
                  color: '#000'

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

          provider={PROVIDER_GOOGLE}
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
              marginBottom: 5,
            }}>
            {longitude != 0 && (
              <Marker
                coordinate={{
                  longitude: parseFloat(longitude),
                  latitude: parseFloat(latitude),
                }}>
                <Image
                  source={pin}
                  style={{height: 35, width: 35}}
                  resizeMode="contain"
                />
              </Marker>
            )}
            <Text
              style={{
                width: '100%',
                textAlign: 'center',
                borderRadius: 10,
                padding: 5,
              }}>
              {t('Verifique se o local indicado acima está correta no mapa')}
            </Text>
          </MapView>

          <TextInput>ENDEREÇO DETALHADO</TextInput>
          <ViewInput>
            <Input
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={street}
              onChangeText={(text) => {
                setStreet(text);
              }}
              placeholder={t('Rua') + '*'}
            />
          </ViewInput>
          <View
            style={{
              width: '90%',
              marginTop: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <ViewInput style={{width: '62%'}}>
              <Input
                placeholderTextColor="#888"
                autoCapitalize="none"
                value={neighborhood}
                onChangeText={(text) => {
                  setNeighborhood(text);
                }}
                placeholder={t('Bairro')}
              />
            </ViewInput>

            <ViewInput style={{width: '35%'}}>
              <Input
                placeholderTextColor="#888"
                autoCapitalize="none"
                value={number}
                onChangeText={(text) => {
                  setNumber(text);
                }}
                placeholder={t('Número')}
              />
            </ViewInput>
          </View>
          <View
            style={{
              width: '90%',
              marginTop: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <ViewInput style={{width: '52%'}}>
              <Input
                placeholderTextColor="#888"
                autoCapitalize="none"
                value={city}
                onChangeText={(text) => {
                  setCity(text);
                }}
                placeholder={t('Cidade')}
              />
            </ViewInput>

            <ViewInput style={{width: '45%'}}>
              <Input
                placeholderTextColor="#888"
                autoCapitalize="none"
                value={state}
                onChangeText={(text) => {
                  setState(text);
                }}
                placeholder={t('Estado')}
              />
            </ViewInput>
          </View>

          <TextInput>TIPO DE SITUAÇÃO*</TextInput>
          <ViewInput style={{height: Platform.OS == 'android' ? 55 : 120}}>
            <Picker
              style={{width: '100%'}}
              itemStyle={{height: Platform.OS == 'android' ? 55 : 120}}
              selectedValue={type}
              onValueChange={(value) => {
                setType(value);
              }}>
              <Picker.Item key={0} value={null} label={t('Selecione o Tipo')} />
              <Picker.Item key={4} value={'pedinte'} label={t('Pedinte')} />
              <Picker.Item
                key={5}
                value={'morador-rua'}
                label={t('Modador de Rua')}
              />
              <Picker.Item key={6} value={'pet'} label={t('Pets')} />
              <Picker.Item key={2} value={'lixo'} label={t('Lixo')} />
              <Picker.Item
                key={3}
                value={'barraco-palafitas'}
                label={t('Barraco palafitas')}
              />
            </Picker>
          </ViewInput>

          <Button
            disabled={false}
            onPress={() => {
              addAlert();
            }}>
            {false ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <TextButton>{t('Salvar')}</TextButton>
            )}
          </Button>
        </Container>
      </ScrollView>
      <Footer />
    </View>
  );
}
