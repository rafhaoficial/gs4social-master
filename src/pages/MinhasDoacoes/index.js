import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  BackHandler,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Clipboard,
  ScrollView,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/header';
import {useTranslation} from 'react-i18next';

import Footer from '../../components/Footer';
import apigs4 from '../../services/apigs4';
import {format} from 'date-fns';

export default function MinhasDoacoes({navigation}) {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});

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
    if (user.user_type == 'user') {
      seachrUserDonations(user);
    } else {
      seachrInstitutionDonations(user);
    }
  }

  async function seachrUserDonations(user) {
    await apigs4
      .get(`/donations/user_payments`, {
        headers: {Authorization: `Bearer ${user.token}`},
      })
      .then(async (response) => {
        let donationss = [];
        console.log(response.data);
        response.data.map((item) => {
          donationss.push(item);
        });
        setDonations(donationss);
      })
      .catch((error) => {
        Alert.alert(
          '',
          t(
            'Não foi possivel buscar doações, verifique sua conexão e tente novamente',
          ),
        );
      });
    setIsLoading(false);
  }

  async function seachrInstitutionDonations(user) {
    await apigs4
      .get(`/donations/institution_payments`, {
        headers: {Authorization: `Bearer ${user.token}`},
      })
      .then(async (response) => {
        let donationss = [];
        console.log(response.data);
        response.data.map((item) => {
          donationss.push({...item, payment_status: 'approved'});
        });
        setDonations(donationss);
      })
      .catch((error) => {
        Alert.alert(
          '',
          t(
            'Não foi possivel buscar doações, verifique sua conexão e tente novamente',
          ),
        );
      });
    setIsLoading(false);
  }

  const {t, i18n} = useTranslation();

  return (
    <View style={{backgroundColor: '#f0f0f0', flex: 1}}>
      <Header rota="Localização" />
      <ScrollView
        style={{
          backgroundColor: '#f0f0f0',
        }}>
        {isLoading ? (
          <View
            style={{
              flex: 1,
              width: '100%',
              paddingTop: 50,
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
            }}>
            <ActivityIndicator size="large" color="#4f4f4f" />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
            }}>
              {Platform.OS == "ios"&& (<View
                  style={{
                    backgroundColor: '#fff',
                    width: '85%',
                    alignItems: 'center',
                    padding: 20,
                    marginTop: 25,
                    borderRadius: 15,
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      textAlign: 'center',
                    }}>
                    {t('Aqui você apenas visualiza as doacoes feitas no nosso site.')}
                  </Text>
                </View>)}
            <Text
              style={{
                fontSize: 18,
                marginTop: 25,
                marginBottom: 12,
                width: '80%',
                textAlign: 'left',
              }}>
              {user.user_type == 'user'
                ? t('Minhas Doações')
                : t('Doações Recebidas')}
            </Text>
            <View
              style={{
                flex: 1,
                marginTop: 5,
                width: '85%',
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: '#f0f0f0',
              }}>
              {donations.length == 0 ? (
                <View
                  style={{
                    backgroundColor: '#fff',
                    width: '100%',
                    alignItems: 'center',
                    padding: 20,
                    borderRadius: 15,
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      textAlign: 'center',
                    }}>
                    {t('Nenhuma doação foi encontrada')}
                  </Text>
                </View>
              ) : (
                <>
                  {donations.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        disabled={user.user_type == 'user' ? false : true}
                        onPress={() => {
                          navigation.navigate('Doacao', {
                            donation: item,
                            rota: 'MinhasDoacoes',
                          });
                        }}
                        style={{
                          flex: 1,
                          marginBottom: 12,
                          width: '100%',
                          borderRadius: 15,
                          padding: 10,
                          flexDirection: 'row',
                          paddingHorizontal: 15,
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          backgroundColor: '#fff',
                        }}>
                        <View
                          style={{
                            alignItems: 'flex-start',
                          }}>
                          <Text
                            style={{
                              fontSize: 17,
                              color:
                                item.payment_status == 'pending'
                                  ? '#fa9200'
                                  : item.payment_status == 'approved'
                                  ? '#0dbf0d'
                                  : '#e32b2b',
                              flex: 1,
                              fontWeight: 'bold',
                              textAlign: 'left',
                            }}>
                            •{' '}
                            {item.payment_status == 'pending'
                              ? t('Pendente')
                              : item.payment_status == 'approved'
                              ? t('Concluido')
                              : t('Expirado')}
                          </Text>
                          <Text
                            style={{
                              fontSize: 13,
                              marginTop: 2,
                              flex: 1,
                              textAlign: 'center',
                            }}>
                            {format(
                              new Date(item.created_at),
                              'dd/MM/yyyy HH:mm',
                            )}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            flex: 1,
                            marginLeft: 15,
                            textAlign: 'center',
                          }}>
                          R$
                          {' ' +
                            item.transaction_amount
                              .toFixed(2)
                              .toString()
                              .replace('.', ',')
                              .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
            </View>
          </View>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}
