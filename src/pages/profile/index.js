import React, { useState, useEffect, useReducer } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
  BackHandler,
  Linking,
  Share,
  ActivityIndicator,
  Platform,
} from 'react-native';

import StarRating from 'react-native-star-rating';
import Clipboard from '@react-native-community/clipboard';

import photoUser from './../../images/user.jpeg';
import Icone from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './../../components/header';
import apigs4 from '../../services/apigs4';
import { useTranslation } from 'react-i18next';

import {
  Container,
  TextoOpcoes,
  Borda,
  MenuOpcoes,
  ViewSelect,
  ViewCampaign,
  TitleCampaign,
  ImageCampaign,
  DescriptionCampaign,
  DateCampaign,
  ButtonEditCampaign,
  ButtonCreate,
  TextButtonCreate,
} from './style';
import { ScrollView } from 'react-native-gesture-handler';
export default function Profile({ navigation }) {
  const [categorias, setCategorias] = useState({
    meio_ambiente: { id: 'meio_ambiente', visible: true, name: 'Meio ambiente' },
    doacoes: { id: 'doacoes', visible: true, name: 'Doações' },
    alimentos: { id: 'alimentos', visible: true, name: 'Alimentos' },
    saude: { id: 'saude', visible: true, name: 'Saúde ' },
    habitacao: { id: 'habitacao', visible: true, name: 'Habitação' },
    educacao: { id: 'educacao', visible: true, name: 'Educação' },
    pets: { id: 'pets', visible: true, name: 'Pets' },
  });
  const [campaign, setCampaign] = useState([]);
  const [rating, setRating] = useState(null);
  const [type, setType] = useState('doacoes');
  const [assessments, setAssessments] = useState([]);
  const [data, setData] = useState([]);
  const [commit, setCommit] = useState(null);
  const [avOk, setAvOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState('');
  const [userEdit, setUserEdit] = useState(false);
  const [user, setUser] = useState({});
  const [selected, setSelected] = useState('infos');
  const [profile, setProfile] = useState({
    name: '',
  });

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    let institution = navigation.getParam('data');
    loadingUser(institution);
  }, []);

  async function loadingUser(institution) {
    let user = await AsyncStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
    }
    setUser(user);
    setType(institution.category);
    setProfile(institution);
    if (user) {
      if (user.id == institution.id) {
        setUserEdit(true);
      }
    }

    loadingInstitution(institution.id, user);
  }

  async function loadingInstitution(id, user) {
    await apigs4
      .get(`/institutions/p/${id}`)
      .then((response) => {
        setCampaign(response.data.institution_campaign);
        setData(response.data.institution_infos);
        setAssessments(response.data.institution_rating);
        if (user) {
          response.data.institution_rating.map((item) => {
            if (user.id == item.user.id) {
              setAvOk(true);
              setRating(item.rating);
              setCommit(item.comment);
            }
          });
        }
        setLoading(false)
      })
      .catch((error) => {
        Alert.alert(
          '',
          t(
            'Não foi possivel carregar dados da instituição, verifique sua conexão e tente novamente',
          ),
        );
      });

  }

  const { t, i18n } = useTranslation();

  return (
    <>
      <Header rota="Localização" />
      <ScrollView>
        {
          loading ? (
            <ActivityIndicator color="#654" size={"large"} style={{ marginTop: 50 }} />
          ) : (

            <View
              style={{ flex: 1, alignItems: 'center', backgroundColor: '#f0f0f0' }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: "center",
                  margin: 5,
                  marginTop: 15,
                }}>
                <View
                  style={{
                    position: "absolute",
                    left: 20,
                    width: 50,
                    borderRadius: 25,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      Share.share({
                        message: `${t('Olá, somos o(a)')} ${profile.name} ${t(
                          'e estamos cadastrado no GS4 Social',
                        )}.\n\n
                    ${t('Alguns dos nossos dados')}\n\n${t('Telefone')}: ${profile.contact
                          }\n${t('Email')}: ${profile.email}\n${t('Endereço')}: ${profile.andress
                          }\n\n${t(
                            'Clique no link abaixo para nos localizar',
                          )}\n\nhttps://maps.google.com/maps?q=${profile.latitude
                          },${profile.longitude}`,
                      });
                    }}
                    style={{
                      backgroundColor: '#7ac5ce',
                      width: 55,
                      height: 55,
                      borderRadius: 55,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon name="share-variant" size={30} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <View style={{ width: Dimensions.get("screen").width - 160, alignItems: 'center' }}>
                  <Image
                    source={
                      profile.brand_url
                        ? { uri: profile.brand_url }
                        : require('./../../images/profile.png')
                    }
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 120,
                      marginTop: 0,
                      marginBottom: 10,
                    }}
                    resizeMode="cover"
                  />

                  <Text
                    style={{
                      color: '#4f4f4f',
                      fontSize: 16,
                      width: '95%',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}>
                    {profile.name}
                  </Text>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={
                      assessments.reduce(
                        (total, numero) => total + numero.rating,
                        0,
                      ) / assessments.length
                    }
                    starSize={16}
                    containerStyle={{
                      height: 20,
                      paddingTop: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    fullStarColor={'#ffdd00'}
                  />

                  {/*
                <TouchableOpacity style={{width: '85%', borderRadius: 10, backgroundColor: '#7ac5ce', height: 50, paddingHorizontal: 15, marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
               
                        <Text style={{color: '#fff', fontSize: 16, marginTop: 2, textAlign: 'center'}}>Vizualizar Nossa Campanha</Text>
                </TouchableOpacity>
                */}
                </View>
              </View>
              {
                !!profile.description && (
                  <Text
                    style={{
                      color: '#4f4f4f',
                      fontSize: 14,
                      marginVertical: 1,
                      width: '95%',
                      marginTop: 2,
                      textAlign: 'center',
                    }}>
                    {profile.description}
                  </Text>
                )
              }
              <Text
                style={{
                  color: '#4f4f4f',
                  fontSize: 18,
                  marginVertical: 1,
                  width: '80%',
                  fontWeight: 'bold',
                  marginTop: 5,
                  textAlign: 'center',
                }}>
                {t(categorias[type].name)}
              </Text>
              <View style={{
                width: "90%", flexDirection: "row",
                marginBottom: 10, alignItems: "center", justifyContent: "center"
              }}>
                <TouchableOpacity onPress={() => {
                  Linking.openURL("mailto:" + profile.email)
                }} style={{ width: 45, height: 45, borderRadius: 45, margin: 5, justifyContent: "center", backgroundColor: "#BE2826", alignItems: "center" }}>
                  <Icon name='email' size={25} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  Linking.openURL("tel:" + profile.contact)
                }} style={{ width: 45, height: 45, borderRadius: 45, margin: 5, justifyContent: "center", backgroundColor: "#5f5f5f", alignItems: "center" }}>
                  <Icon name='phone' size={25} color="#FFF" />
                </TouchableOpacity>

                {
                  !!profile.whatsapp && (
                    <TouchableOpacity onPress={() => {
                      Linking.openURL("https://api.whatsapp.com/send?phone=55" + profile.whatsapp)
                    }} style={{ width: 45, height: 45, borderRadius: 45, margin: 5, justifyContent: "center", backgroundColor: "#34af23", alignItems: "center" }}>
                      <Icon name='whatsapp' size={25} color="#FFF" />
                    </TouchableOpacity>
                  )
                }
                {
                  !!profile.instagram && (
                    <TouchableOpacity onPress={() => {
                      Linking.openURL("https://instagram.com/" + profile.instagram)
                    }} style={{ width: 45, height: 45, borderRadius: 45, margin: 5, justifyContent: "center", backgroundColor: "#3f729b", alignItems: "center" }}>
                      <Icon name='instagram' size={25} color="#FFF" />
                    </TouchableOpacity>
                  )
                }


                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Navegacao', { usuario: profile });
                  }}
                  style={{ width: 45, height: 45, borderRadius: 45, margin: 5, justifyContent: "center", backgroundColor: "#7ac5ce", alignItems: "center" }}
                >
                  <Icon name="near-me" size={25} color="#FFF" />
                </TouchableOpacity>
              </View>
              <ViewSelect style={{ marginBottom: -1 }}>
                <MenuOpcoes
                  onPress={() => {
                    setSelected('assessments');
                  }}>
                  <Icon
                    name="star"
                    size={20}
                    color={selected == 'assessments' ? '#FFF' : '#dfdfdf'}
                  />
                  <TextoOpcoes
                    style={{ color: selected == 'assessments' ? '#FFF' : '#dfdfdf' }}>
                    {t('Avaliações')}
                  </TextoOpcoes>
                  <Borda
                    style={{
                      backgroundColor:
                        selected == 'assessments' ? '#FFF' : '#dfdfdf',
                    }}></Borda>
                </MenuOpcoes>
                <MenuOpcoes
                  onPress={() => {
                    setSelected('infos');
                  }}>
                  <Icone
                    name="align-center"
                    size={20}
                    color={selected == 'infos' ? '#FFF' : '#dfdfdf'}
                  />
                  <TextoOpcoes
                    style={{ color: selected == 'infos' ? '#FFF' : '#dfdfdf' }}>
                    {t('Informações')}
                  </TextoOpcoes>
                  <Borda
                    style={{
                      backgroundColor: selected == 'infos' ? '#FFF' : '#dfdfdf',
                    }}></Borda>
                </MenuOpcoes>
                <MenuOpcoes
                  onPress={() => {
                    setSelected('campaign');
                  }}>
                  <Icone
                    name="image"
                    size={20}
                    color={selected == 'campaign' ? '#FFF' : '#dfdfdf'}
                  />
                  <TextoOpcoes
                    style={{ color: selected == 'campaign' ? '#FFF' : '#dfdfdf' }}>
                    {t('Campanhas')}
                  </TextoOpcoes>
                  <Borda
                    style={{
                      backgroundColor: selected == 'campaign' ? '#FFF' : '#dfdfdf',
                    }}></Borda>
                </MenuOpcoes>
              </ViewSelect>
              {selected == 'campaign' && (
                <Container>
                  {user && (
                    <>
                      {userEdit && (
                        <ButtonCreate
                          onPress={() => {
                            navigation.navigate('Campanha', { data: profile });
                          }}>
                          <TextButtonCreate>
                            {t('Criar Nova Campanha')}
                          </TextButtonCreate>
                        </ButtonCreate>
                      )}
                    </>
                  )}
                  {campaign.length == 0 ? (
                    <ViewCampaign>
                      <TitleCampaign>
                        {t('Nenhuma campanha foi realizada até o momento')}
                      </TitleCampaign>
                    </ViewCampaign>
                  ) : (
                    <>
                      {campaign.map((item, index) => {
                        return (
                          <ViewCampaign key={index}>
                            <TitleCampaign>{item.title}</TitleCampaign>
                            <ImageCampaign
                              source={{ uri: item.photo_url }}
                              style={{
                                width: '90%',
                                height: 250,
                                borderRadius: 10,
                              }}
                              resizeMode="contain"
                            />
                            {userEdit && (
                              <ButtonEditCampaign
                                onPress={() => {
                                  navigation.navigate('Campanha', {
                                    data: profile,
                                    campaign: item,
                                  });
                                }}>
                                <Icon name="pencil" size={26} color="#fff" />
                              </ButtonEditCampaign>
                            )}
                            <DescriptionCampaign>
                              {item.description}
                            </DescriptionCampaign>
                            <DateCampaign>
                              {t('De')} {item.date_initial} {t('até')}{' '}
                              {item.date_end}
                            </DateCampaign>
                          </ViewCampaign>
                        );
                      })}
                    </>
                  )}
                </Container>
              )}

              {selected == 'infos' && (
                <View
                  style={{
                    flex: 1,
                    minHeight: 500,
                    width: '100%',
                    backgroundColor: '#4f4f4f',
                    alignItems: 'center',
                    paddingVertical: 25,
                  }}>
                  {user && (
                    <>
                      {userEdit && (
                        <ButtonCreate
                          onPress={() => {
                            navigation.navigate('Data', { data: profile });
                          }}>
                          <TextButtonCreate>
                            {t('Adicionar Informações')}
                          </TextButtonCreate>
                        </ButtonCreate>
                      )}
                    </>
                  )}
                  {data.length == 0 ? (
                    <ViewCampaign>
                      <TitleCampaign
                        style={{ fontSize: 14, width: '60%', textAlign: 'center' }}>
                        {t('Nenhuma informação a ser exibida até o momento')}
                      </TitleCampaign>
                    </ViewCampaign>
                  ) : (
                    <>
                      {data.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              width: '90%',
                              backgroundColor: '#f0f0f0',
                              borderRadius: 10,
                              alignItems: 'center',
                              justifyContent: 'space-around',
                              marginBottom: 12,
                              flexDirection: 'row',
                              padding: 10,
                            }}>
                            <View
                              style={{
                                width: '75%',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: 'bold',
                                  width: '100%',
                                  textAlign: 'center',
                                }}>
                                {item.title}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 13,
                                  width: '100%',
                                  textAlign: 'center',
                                }}>
                                {item.information}
                              </Text>
                            </View>
                            {user ? (
                              <>
                                {userEdit ? (
                                  <TouchableOpacity
                                    onPress={() => {
                                      navigation.navigate('Data', {
                                        data: profile,
                                        dados: item,
                                      });
                                    }}
                                    style={{
                                      width: 40,
                                      height: 40,
                                      backgroundColor: '#7ac5ce',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      borderRadius: 5,
                                    }}>
                                    <Icon name="pencil" size={25} color={'#fff'} />
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    onPress={async () => {
                                      if (item.action_type == 'copiar') {
                                        Clipboard.setString(
                                          item.title + ' : ' + item.information,
                                        );
                                        Alert.alert('', t('Copiado com Sucesso'));
                                      } else {
                                        if (item.action_type == 'redirecionar') {
                                          Linking.openURL(item.information)
                                            .then()
                                            .catch((error) => {
                                              Linking.openURL(
                                                `https://${item.information}`,
                                              );
                                            });
                                        } else {
                                          await Share.share({
                                            message: `${item.title}\n\n${item.information}\n\nby GS4 Social`,
                                          });
                                        }
                                      }
                                    }}
                                    style={{
                                      width: 40,
                                      height: 40,
                                      backgroundColor: '#7ac5ce',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      borderRadius: 5,
                                    }}>
                                    <Icone
                                      name={
                                        item.action_type == 'copiar'
                                          ? 'copy'
                                          : item.action_type == 'redirecionar'
                                            ? 'link-2'
                                            : 'share'
                                      }
                                      size={25}
                                      color={'#fff'}
                                    />
                                  </TouchableOpacity>
                                )}
                              </>
                            ) : (
                              <TouchableOpacity
                                onPress={async () => {
                                  if (item.action_type == 'copiar') {
                                    Clipboard.setString(
                                      item.title + ' : ' + item.information,
                                    );
                                    Alert.alert('', t('Copiado com Sucesso'));
                                  } else {
                                    if (item.action_type == 'redirecionar') {
                                      Linking.openURL(item.information)
                                        .then()
                                        .catch((error) => {
                                          Linking.openURL(
                                            `https://${item.information}`,
                                          );
                                        });
                                    } else {
                                      await Share.share({
                                        message: `${item.title}\n\n${item.information}\n\nby GS4 Social`,
                                      });
                                    }
                                  }
                                }}
                                style={{
                                  width: 40,
                                  height: 40,
                                  backgroundColor: '#7ac5ce',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: 5,
                                }}>
                                <Icone
                                  name={
                                    item.action_type == 'copiar'
                                      ? 'copy'
                                      : item.action_type == 'redirecionar'
                                        ? 'link-2'
                                        : 'share'
                                  }
                                  size={25}
                                  color={'#fff'}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        );
                      })}
                    </>
                  )}
                </View>
              )}

              {selected == 'assessments' && (
                <Container>
                  {user && (
                    <>
                      {!userEdit && (
                        <View
                          style={{
                            width: '90%',
                            backgroundColor: '#f0f0f0',
                            borderRadius: 20,
                            alignItems: 'center',
                            marginBottom: 20,
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: 'bold',
                              marginTop: 15,
                            }}>
                            {t('Qualifique a instituição')}
                          </Text>
                          <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={rating}
                            starSize={30}
                            containerStyle={{
                              alignItems: 'center',
                              marginTop: 10,
                              justifyContent: 'space-around',
                              width: '50%',
                            }}
                            fullStarColor={'#ffdd00'}
                            selectedStar={(rating) => setRating(rating)}
                          />
                          <Text
                            style={{
                              fontSize: 13,
                              marginVertical: 10,
                              width: '80%',
                              textAlign: 'center',
                            }}>
                            {t('Deixe um comentario')}
                          </Text>
                          <TextInput
                            style={{
                              width: '90%',
                              backgroundColor: '#fff',
                              borderRadius: 10,
                              marginBottom: 15,
                              minHeight: 50,
                              textAlign: 'center',
                            }}
                            value={commit}
                            onChangeText={(text) => {
                              setCommit(text);
                            }}
                            multiline={true}
                            placeholder={t('Deixe aqui sua avaliação')}
                          />
                          <TouchableOpacity
                            style={{
                              width: '90%',
                              backgroundColor: '#7ac5ce',
                              borderRadius: 10,
                              marginBottom: 15,
                              minHeight: 50,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={async () => {
                              if (user) {
                                if (rating != null && commit != '') {
                                  if (!avOk) {
                                    await apigs4
                                      .post(
                                        `/institutions/${profile.id}/rating`,
                                        {
                                          rating,
                                          comment: commit,
                                        },
                                        {
                                          headers: {
                                            Authorization: `Bearer ${user.token}`,
                                          },
                                        },
                                      )
                                      .then((response) => {
                                        console.log(response.data);

                                        Alert.alert(
                                          '',
                                          t('Avaliação adicionada com sucesso'),
                                        );
                                      })
                                      .catch((error) => {
                                        console.log(error.response.data);
                                        Alert.alert(
                                          '',
                                          t(
                                            'Não foi possivel avaliar a intituição, verifique sua conexão e tente novamente',
                                          ),
                                        );
                                      });
                                  } else {
                                    await apigs4
                                      .put(
                                        `/institutions/${profile.id}/rating`,
                                        {
                                          rating,
                                          comment: commit,
                                        },
                                        {
                                          headers: {
                                            Authorization: `Bearer ${user.token}`,
                                          },
                                        },
                                      )
                                      .then((response) => {
                                        console.log(response.data);

                                        Alert.alert(
                                          '',
                                          t('Avaliação editada com sucesso'),
                                        );
                                      })
                                      .catch((error) => {
                                        console.log(error.response.data);
                                        Alert.alert(
                                          '',
                                          t(
                                            'Não foi possivel editar avaliação, verifique sua conexão e tente novamente',
                                          ),
                                        );
                                      });
                                  }
                                } else {
                                  Alert.alert(
                                    '',
                                    t(
                                      'Classifique a instituição e deixe seu comentário',
                                    ),
                                  );
                                }
                              }
                            }}>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 17,
                                fontWeight: 'bold',
                              }}>
                              {avOk ? t('Atualizar') : t('Enviar')} {t('Avaliação')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  )}
                  {assessments.length == 0 ? (
                    <ViewCampaign>
                      <TitleCampaign
                        style={{ fontSize: 14, width: '60%', textAlign: 'center' }}>
                        {t('Nenhuma avaliação foi realizada até o momento')}
                      </TitleCampaign>
                    </ViewCampaign>
                  ) : (
                    <>
                      {assessments.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              width: '90%',
                              backgroundColor: '#f0f0f0',
                              borderRadius: 20,
                              paddingVertical: 12,
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              marginBottom: 20,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '85%',
                                marginVertical: 5,
                                marginBottom: 8,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                              }}>
                              <Image
                                source={
                                  item.user.photo_url
                                    ? { uri: item.user.photo_url }
                                    : photoUser
                                }
                                style={{ width: 32, height: 32, borderRadius: 32 }}
                              />
                              <Text style={{ fontSize: 16, marginLeft: 10 }}>
                                {item.user.name}
                              </Text>
                            </View>
                            <View style={{ width: '85%' }}>
                              <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={item.rating}
                                starSize={15}
                                containerStyle={{
                                  alignItems: 'center',
                                  justifyContent: 'space-around',
                                  width: 80,
                                }}
                                fullStarColor={'#ffdd00'}
                              />
                            </View>

                            {item.comment && (
                              <Text
                                style={{
                                  fontSize: 14,
                                  marginTop: 10,
                                  width: '85%',
                                }}>
                                {item.comment}
                              </Text>
                            )}
                          </View>
                        );
                      })}
                    </>
                  )}
                </Container>
              )}
            </View>
          )
        }
      </ScrollView>
      {user && (
        <>
          {(user.user_type == 'user' && profile.type != 'publico') && (
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS == "android") {
                  navigation.navigate('Doacao', { usuario: profile });
                } else {
                  Linking.openURL(`https://app.gs4social.com/${profile.id}`)
                }

              }}
              style={{
                position: 'absolute',
                right: 20,
                top: 80,
                backgroundColor: '#7ac5ce',
                width: 55,
                height: 55,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="hand-heart" size={30} color="#FFF" />
            </TouchableOpacity>
          )}
        </>
      )}
    </>
  );
}
