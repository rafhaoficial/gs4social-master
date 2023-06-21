import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Image, Alert, BackHandler} from 'react-native';

import {useTranslation} from 'react-i18next';
import MapViewDirections from 'react-native-maps-directions';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Header from '../../components/header';

import pin from './../../images/pin.png';
import pin_alert from './../../images/pin_alert.png';

export default function Navegacao({navigation}) {
  const mapRef = useRef();

  const [loading, setLoading] = useState(false);
  const [origem, setOrigem] = useState({});
  const [type, setType] = useState('');
  const [profile, setProfile] = useState({});
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [destino, setDestino] = useState({});
  const [region, setRegion] = useState({
    latitude: -7.95454444,
    longitude: -35.7548555,
    latitudeDelta: 0.02843,
    longitudeDelta: 0.02144,
  });

  const data = navigation.getParam('data');
  const rota = navigation.getParam('rota');

  useEffect(() => {
    let profile = navigation.getParam('usuario');
    let type = navigation.getParam('type');
    let data = navigation.getParam('data');
    if (type) {
      setType(type);
      BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate(rota, {data, type});
        return true;
      });
    } else {
      BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate('Profile', {data: profile});
        return true;
      });
    }

    setDestino({
      latitude: profile.latitude,
      longitude: profile.longitude,
    });
    setProfile(profile);
    let regiao = {};
    Geolocation.getCurrentPosition((info) => {
      regiao = {
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setOrigem({
        latitude: regiao.latitude,
        longitude: regiao.longitude,
      });
      setRegion(regiao);
      setLoading(true);
    });
  }, []);

  const {t, i18n} = useTranslation();

  return (
    <>
      <Header
        rota={type == 'alerts' ? rota : 'Profile'}
        data={
          type == 'alerts'
            ? {
                data: data,
                type: type,
              }
            : {data: profile}
        }
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <MapView
          showsUserLocation
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
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
          style={{width: '100%', height: '100%', alignSelf: 'center'}}>
          {loading && (
            <MapViewDirections
              origin={origem}
              destination={destino}
              apikey="AIzaSyDHiKSJE2umIoSpsdj0qnkbihIAR6sn-WY"
              strokeWidth={7}
              strokeColor={type == 'alerts' ? '#ed473b' : '#7ac5ce'}
              onError={(error) => {
                mapRef.current.animateToRegion(origem, 2000);
                Alert.alert(
                  t('Não foi possivel traçar rota'),
                  t('Verifique sua conexão com a internet e tente novamente'),
                  [
                    {
                      text: t('Tentar Novamente'),
                      onPress: () => {
                        setLoading(false);
                        setLoading(true);
                      },
                    },
                    {
                      text: t('Voltar'),
                      onPress: () => {
                        navigation.navigate('Profile', {data: profile});
                      },
                    },
                  ],
                );
              }}
              onReady={(result) => {
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: 50,
                    left: 50,
                    top: 50,
                    bottom: 50,
                  },
                });
                let duration = result.duration;
                let final = '';
                if (duration >= 60) {
                  for (let i = 1; duration >= 60; i++) {
                    duration = duration - 60;
                    final = i;
                  }
                  final = `${final} hr \n${duration.toFixed(0)} min`;
                } else {
                  final = `${duration.toFixed(0)} min`;
                }

                setDistance(result.distance);
                setDuration(final);
              }}
            />
          )}

          <Marker
            key={0}
            coordinate={{
              latitude: destino.latitude,
              longitude: destino.longitude,
            }}>
            <Image
              source={type == 'alerts' ? pin_alert : pin}
              style={{height: 35, width: 35}}
              resizeMode="contain"
            />
          </Marker>
        </MapView>

        <View
          style={{
            position: 'absolute',
            bottom: 40,
            paddingVertical: 10,
            paddingHorizontal: 35,
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'flex-start',
            borderRadius: 25,
            backgroundColor: type == 'alerts' ? '#ed473b' : '#7ac5ce',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: '#FFF',
              width: '100%',
              fontWeight: 'bold',
            }}>
            {distance.toFixed(1)}
            {' km'}
          </Text>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              width: '100%',
              color: '#FFF',
              fontWeight: 'bold',
            }}>
            {duration}
          </Text>
        </View>
      </View>
    </>
  );
}
