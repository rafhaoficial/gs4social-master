import React, {useState, useEffect} from 'react';
import {
  View,
  Keyboard,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  BackHandler,
} from 'react-native';
import {
  Input,
  ButtonLogin,
  TextLogin,
  InputView,
  ButtonIcon,
  Logo,
  Header,
  Pergunta,
  ViewInputSenha,
  TextInput,
  TextoComplementar,
  ViewInput,
} from './styled';
import Icon from 'react-native-vector-icons/MaterialIcons';
import apigs4 from '../../services/apigs4';
import {screenWidth} from '../../Const';
import logo from './../../images/logo.png';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const styles = StyleSheet.create({
  root: {flex: 1},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    margin: 2,
    borderWidth: 2,
    borderColor: '#bbb',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#4F4F4F',
  },
});

function ResetPassword({navigation}) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [etapa, setEtapa] = useState(0);
  const [email, setEmail] = useState('');
  const [value, setValue] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [visibleSenha, setVisibleSenha] = useState(true);
  const [visibleSenhaC, setVisibleSenhaC] = useState(true);
  const ref = useBlurOnFulfill({value, cellCount: 5});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Login');
      return true;
    });
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const forgotPassword = async () => {
    setIsLoading(true);
    if (email) {
      await apigs4
        .post('/passwords/forgot', {
          email: email.toLowerCase(),
        })
        .then(async (response) => {
          setEtapa(1);
        })
        .catch((error) => {
          console.log(error);
          if (
            error.response.data.message == 'celebrate request validation failed'
          ) {
            if (
              error.response.data.validation.body.message ==
              '"email" must be a valid email'
            ) {
              Alert.alert('Ops..', 'Email inserido é inválido');
            }
          } else {
            Alert.alert('Ops..', error.response.data.message);
          }
        });
    } else {
      Alert.alert('Ops..', 'Preencha o email para recuperar sua senha');
    }
    setIsLoading(false);
  };

  const resetPassword = async () => {
    setIsLoading(true);
    await apigs4
      .post('/passwords/reset', {
        email: email.toLowerCase(),
        password,
        code: value,
      })
      .then(async (response) => {
        Alert.alert(
          'Sucesso',
          'Sua senha foi redefinida e agora você pode acessar a conta com sua nova senha.',
        );
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.log(error.response.data.message);
        if (error.response.data.message == 'Códito incorreto!') {
          Alert.alert('Ops..', 'Código inserido está incorreto');
          setEtapa(1);
        } else {
          console.log(error.response.data.message);
          Alert.alert('Ops..', error.response.data.message);
        }
      });
    setIsLoading(false);
  };

  return (
    <ScrollView style={{flex: 1}}>
      <Header>
        <ButtonIcon
          style={{left: 25}}
          onPress={() => {
            if (etapa == 0) {
              navigation.navigate('Login');
            } else {
              setEtapa(etapa - 1);
            }
          }}>
          <Icon name={'arrow-back-ios'} size={25} color="#544" />
        </ButtonIcon>
        <Logo source={logo} resizeMode="contain" />
      </Header>
      <View
        style={{
          backgroundColor: '#f0f0f0',
          flex: 1,
          alignItems: 'center',
        }}>
        {etapa == 0 && (
          <>
            <Pergunta>Preencha seu email</Pergunta>
            <TextoComplementar>
              Coloque o email corretamente para enviar o código para você
              recuperar sua conta.
            </TextoComplementar>
            <ViewInput>
              <TextInput>Email:</TextInput>
              <Input
                placeholder="Digite seu Email"
                value={email}
                placeholderTextColor="#888"
                onChangeText={(text) => {
                  setEmail(text);
                }}
              />
            </ViewInput>
          </>
        )}
        {etapa == 1 && (
          <>
            <Pergunta>Digite o código que você recebeu no seu email</Pergunta>
            <TextoComplementar>
              Não compartilhe seu código de segurança com ninguem.
            </TextoComplementar>
            <SafeAreaView style={styles.root}>
              <CodeField
                ref={ref}
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={value}
                onChangeText={setValue}
                cellCount={5}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({index, symbol, isFocused}) => (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </SafeAreaView>
          </>
        )}
        {etapa == 2 && (
          <>
            <Pergunta>Escolha uma nova senha</Pergunta>
            <TextoComplementar>
              Crie uma senha com pelo menos 6 caracteres. Ela deve ser algo que
              outras pessoas não consigam advinhar.
            </TextoComplementar>
            <ViewInput>
              <TextInput>Nova Senha:</TextInput>
              <ViewInputSenha>
                <Input
                  style={{width: 'auto', flex: 1}}
                  value={password}
                  autoCapitalize="none"
                  placeholder="Digite sua Nova Senha"
                  onChangeText={(text) => {
                    setPassword(text);
                  }}
                  placeholderTextColor="#888"
                  secureTextEntry={visibleSenha}
                />
                <ButtonIcon
                  style={{right: 25}}
                  onPress={() => {
                    setVisibleSenha(!visibleSenha);
                  }}>
                  <Icon
                    name={visibleSenha ? 'visibility' : 'visibility-off'}
                    size={22}
                    color="#8f8f8f"
                  />
                </ButtonIcon>
              </ViewInputSenha>
            </ViewInput>
            <ViewInput>
              <TextInput>Confirmar Nova Senha:</TextInput>
              <ViewInputSenha>
                <Input
                  style={{width: 'auto', flex: 1, height: 50}}
                  value={confirmarSenha}
                  autoCapitalize="none"
                  placeholderTextColor="#888"
                  placeholder="Confirme sua Nova Senha"
                  onChangeText={(text) => {
                    setConfirmarSenha(text);
                  }}
                  secureTextEntry={visibleSenhaC}
                />
                <ButtonIcon
                  style={{right: 25}}
                  onPress={() => {
                    setVisibleSenhaC(!visibleSenhaC);
                  }}>
                  <Icon
                    name={visibleSenhaC ? 'visibility' : 'visibility-off'}
                    size={22}
                    color="#8f8f8f"
                  />
                </ButtonIcon>
              </ViewInputSenha>
            </ViewInput>
          </>
        )}
        <ButtonLogin
          onPress={() => {
            switch (etapa) {
              case 0: {
                forgotPassword();
                break;
              }
              case 1: {
                if (value.length == 5) {
                  setEtapa(2);
                } else {
                  Alert.alert(
                    'Opss',
                    'Digite o código de 5 digitos que você recebeu por email.',
                  );
                }
                break;
              }
              case 2: {
                if (password && confirmarSenha) {
                  if (password == confirmarSenha) {
                    resetPassword();
                  } else {
                    Alert.alert('Opss', 'As duas senhas não correspondem');
                  }
                } else {
                  Alert.alert(
                    'Opss',
                    'Digite a sua nova senha e confirme para continuar',
                  );
                }
                break;
              }
            }
          }}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <TextLogin>
              {etapa == 0
                ? 'Enviar Código'
                : etapa == 1
                ? 'Confirmar Código'
                : 'Redefinir Senha'}
            </TextLogin>
          )}
        </ButtonLogin>
      </View>
    </ScrollView>
  );
}

export default ResetPassword;
