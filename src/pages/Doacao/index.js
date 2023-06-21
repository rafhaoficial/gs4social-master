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
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/header';
import CurrencyInput from 'react-native-currency-input';
import {format} from 'date-fns';
import pets from './../../images/pets.png';
import alimentos from './../../images/alimentos.png';
import saude from './../../images/saude.png';
import habitacao from './../../images/habitacao.png';
import meio_ambiente from './../../images/meio_ambiente.png';
import doacoes from './../../images/doacoes.png';
import educacao from './../../images/educacao.png';
import {useTranslation} from 'react-i18next';

import Footer from '../../components/Footer';
import apigs4 from '../../services/apigs4';
const largura = Dimensions.get('screen').width;

const values = [10, 20, 50, 100];

export default function Doacao({navigation}) {
  const [categorias, setCategorias] = useState({
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
  });

  const [error, setError] = useState(false);
  const [value, setValue] = useState(0);
  const [donation, setDonation] = useState({
    id: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDonation, setIsLoadingDonation] = useState(false);
  const [rota, setRota] = useState('Profile');
  const [profile, setProfile] = useState({
    category: 'doacoes',
    brand_url: '',
  });
  const [user, setUser] = useState({});

  useEffect(() => {
    loadingInstitution();
    loadingUser();
  }, []);

  async function loadingUser() {
    let user = await AsyncStorage.getItem('user');
    user = JSON.parse(user);
    setUser(user);
    let donation = navigation.getParam('donation');
    if (donation) {
      console.log(donation);
      setDonation(donation);
      setProfile(donation.institution);
    }
    let rota = navigation.getParam('rota');
    if (rota) {
      setRota(rota);
    }
    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate(rota, {data: profile});
      return true;
    });
    setIsLoading(false);
  }

  async function loadingInstitution() {
    let profilee = await navigation.getParam('usuario');
    if (profilee) {
      setProfile(profilee);
    }
  }

  async function createDonation() {
    setIsLoadingDonation(true);
    await apigs4
      .post(
        `/donations`,
        {
          institution_id: profile.id,
          transaction_amount: value,
        },
        {
          headers: {Authorization: `Bearer ${user.token}`},
        },
      )
      .then(async (response) => {
        let donationn = response.data;
        donationn.transaction_amount = value;
        donationn.created_at = new Date();
        donationn.payment_status = 'pending';
        setDonation(donationn);
      })
      .catch((error) => {
        Alert.alert('', t('Erro ao iniciar transação, tente novamente'));
      });
    setIsLoadingDonation(false);
  }

  const {t, i18n} = useTranslation();

  return (
    <View style={{backgroundColor: '#f0f0f0', flex: 1}}>
      <Header rota={rota} data={{data: profile}} />
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
          <>
            {donation.id == 0 ? (
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  alignItems: 'center',
                  backgroundColor: '#f0f0f0',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    marginTop: 25,
                    width: '80%',
                    textAlign: 'left',
                  }}>
                  {t('Instituição beneficiária')}
                </Text>

                <View
                  style={{
                    flex: 1,
                    marginTop: 10,
                    width: '85%',
                    minHeight: 70,
                    borderRadius: 15,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    padding: 5,
                    paddingHorizontal: 15,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                  }}>
                  <Image
                    source={
                      profile.brand_url
                        ? {uri: profile.brand_url}
                        : require('./../../images/profile.png')
                    }
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 60,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      margin: 5,
                      marginLeft: 15,
                      flex: 1,
                      textAlign: 'left',
                    }}>
                    {profile.name}
                    {'\n'}
                    <Text
                      style={{
                        fontSize: 15,
                        marginTop: 8,
                        fontWeight: 'bold',
                        flex: 1,
                        textAlign: 'left',
                      }}>
                      {categorias[profile.category].name}
                    </Text>
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    marginTop: 15,
                    width: '80%',
                    textAlign: 'left',
                  }}>
                  {t('Selecione um valor para doar')}
                </Text>
                <View
                  style={{
                    flex: 1,
                    marginTop: 10,
                    width: '90%',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    backgroundColor: '#f0f0f0',
                  }}>
                  {values.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setValue(item);
                        }}
                        style={{
                          width: '45%',
                          height: 60,
                          padding: 10,
                          backgroundColor: value == item ? '#7ac5ce' : '#fff',

                          marginBottom: 15,
                          borderRadius: 12,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 18,
                            marginVertical: 1,
                            color: value == item ? '#fff' : '#000',
                            width: '100%',
                            fontWeight: 'bold',
                            textAlign: 'center',
                          }}>
                          R$
                          {' ' +
                            item
                              .toFixed(2)
                              .toString()
                              .replace('.', ',')
                              .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text
                  style={{
                    fontSize: 16,
                    marginTop: 15,
                    marginBottom: 10,
                    width: '80%',
                    textAlign: 'left',
                  }}>
                  {t('Ou digite o valor que deseja doar')}
                </Text>
                <CurrencyInput
                  value={value}
                  onChangeValue={(valor) => {
                    setValue(valor);
                  }}
                  style={{
                    width: '85%',
                    backgroundColor: '#FFF',
                    borderWidth: error && value < 10 ? 2 : 0,
                    borderColor: error && value < 10 ? '#d55' : '#fff',
                    color: error && value < 10 ? '#d55' : '#000',
                    height: 55,
                    fontSize: 20,
                    borderRadius: 15,
                    fontWeight: 'bold',
                    paddingLeft: 15,
                  }}
                  prefix="R$ "
                  delimiter=","
                  separator="."
                  precision={2}
                  onChangeText={(formattedValue) => {
                    console.log(formattedValue); // $2,310.46
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (value <= 0) {
                      Alert.alert('', t('Digite o valor que deseja doar'));
                    } else {
                      if (value >= 10) {
                        createDonation();
                      } else {
                        setError(true);
                        Alert.alert(
                          '',
                          t('Valor minimo para doação é R$ 10,00'),
                        );
                      }
                    }
                  }}
                  disabled={isLoadingDonation}
                  style={{
                    width: '85%',
                    height: 55,
                    padding: 10,
                    backgroundColor: '#7ac5ce',
                    marginTop: 25,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {isLoadingDonation ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text
                      style={{
                        fontSize: 18,
                        marginVertical: 1,
                        width: '100%',
                        color: '#fff',
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}>
                      {t('Gerar QR Code Pix')}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  alignItems: 'center',
                  backgroundColor: '#f0f0f0',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    marginTop: 25,
                    width: '80%',
                    textAlign: 'left',
                  }}>
                  {t('Doação')}
                </Text>
                <View
                  style={{
                    flex: 1,
                    marginTop: 10,
                    width: '85%',
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
                          donation.payment_status == 'pending'
                            ? '#fa9200'
                            : donation.payment_status == 'approved'
                            ? '#0dbf0d'
                            : '#e32b2b',
                        flex: 1,
                        fontWeight: 'bold',
                        textAlign: 'left',
                      }}>
                      •{' '}
                      {donation.payment_status == 'pending'
                        ? t('Pendente')
                        : donation.payment_status == 'approved'
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
                        new Date(donation.created_at),
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
                      donation.transaction_amount
                        .toFixed(2)
                        .toString()
                        .replace('.', ',')
                        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    marginTop: 10,
                    width: '80%',
                    textAlign: 'left',
                  }}>
                  {t('Instituição beneficiária')}
                </Text>
                <View
                  style={{
                    flex: 1,
                    marginTop: 10,
                    width: '85%',
                    minHeight: 70,
                    borderRadius: 15,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    padding: 5,
                    paddingHorizontal: 15,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                  }}>
                  <Image
                    source={
                      profile.brand_url
                        ? {uri: profile.brand_url}
                        : require('./../../images/profile.png')
                    }
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 60,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      margin: 5,
                      marginLeft: 15,
                      flex: 1,
                      textAlign: 'left',
                    }}>
                    {profile.name}
                    {'\n'}
                    <Text
                      style={{
                        fontSize: 15,
                        marginTop: 8,
                        fontWeight: 'bold',
                        flex: 1,
                        textAlign: 'left',
                      }}>
                      {categorias[profile.category].name}
                    </Text>
                  </Text>
                </View>
                {donation.payment_status == 'pending' && (
                  <>
                    <Text
                      style={{
                        fontSize: 16,
                        marginTop: 10,
                        width: '80%',
                        textAlign: 'left',
                      }}>
                      {t('QR Code PIX')}
                    </Text>

                    <View
                      style={{
                        flex: 1,
                        marginTop: 10,
                        width: '85%',
                        minHeight: 70,
                        borderRadius: 15,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        padding: 5,
                        paddingHorizontal: 15,
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                      }}>
                      <Image
                        source={{
                          uri: `data:image/png;base64,${donation.qr_code_base64}`,
                        }}
                        style={{
                          width: '85%',
                          height: 250,
                          borderRadius: 60,
                        }}
                        resizeMode="contain"
                      />
                    </View>

                    <Text
                      style={{
                        fontSize: 16,
                        marginTop: 10,
                        width: '80%',
                        textAlign: 'left',
                      }}>
                      {t('PIX Copia e Cola')}
                    </Text>
                    <TouchableOpacity
                      onPress={async () => {
                        await Clipboard.setString(donation.qr_code);
                        Alert.alert(
                          '',
                          t('Pix Copia e Cola copiado com sucesso'),
                        );
                      }}
                      style={{
                        alignItems: 'center',
                        width: '85%',
                        marginVertical: 10,
                      }}>
                      <Text
                        style={{
                          width: '100%',
                          paddingHorizontal: 15,
                          borderRadius: 15,
                          padding: 8,
                          marginBottom: 4,
                          backgroundColor: '#fff',
                        }}>
                        {donation.qr_code}
                      </Text>
                      <Text>{t('toque para copiar chave')}</Text>
                    </TouchableOpacity>
                  </>
                )}
                {donation.payment_status == 'approved' && (
                  <>
                    <Text
                      style={{
                        fontSize: 17,
                        marginVertical: 40,
                        width: '75%',
                        textAlign: 'center',
                      }}>
                      {t(
                        'A equipe do GS4 Social agradece pela sua doação à instituição. Acompanhe a destinação da doação pelo aplicativo',
                      )}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setDonation({id: 0});
                      }}
                      style={{
                        width: '85%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 15,
                        height: 55,
                        backgroundColor: '#7ac5ce',
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#FFF',
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}>
                        {t('Doar Novamente')}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                {donation.payment_status == 'expired' && (
                  <>
                    <Text
                      style={{
                        fontSize: 17,
                        marginVertical: 35,
                        width: '80%',
                        textAlign: 'center',
                      }}>
                      {t(
                        'O tempo para finalizar sua doação foi esgotado, tente novamente',
                      )}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setDonation({id: 0});
                      }}
                      style={{
                        width: '85%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 15,
                        height: 55,
                        backgroundColor: '#7ac5ce',
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#FFF',
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}>
                        {t('Doar Novamente')}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}
