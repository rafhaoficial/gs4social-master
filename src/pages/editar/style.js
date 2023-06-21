import styled from 'styled-components';
import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { HelperText } from 'react-native-paper';

export const TextoMenu = styled.Text`
  font-size: 18px;
  width: 50%;
  text-align: center;
  margin-top: -70px;
  margin-bottom: 25px;
  color: #fff;
  font-weight: bold;
`;

export const TextoOpcoes = styled.Text`
  font-size: 16px;
  text-align: center;
  font-weight: bold;
  font-family: Roboto;
`;

export const Logo = styled.Image`
  width: 80%;
  height: 200px;
  margin-bottom: 40px;
  margin-top: -50px;
`;

export const TextoLogin = styled.Text`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
`;

export const TextoBotao = styled.Text`
  font-size: 12px;
  color: #5f5f5f;
  font-weight: bold;
`;

export const Container = styled.View`
  flex: 1;
  height: 100%;
  padding-top: 10px;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
`;

export const Pickers = styled.View`
  border-color: black;
  width: 85%;
  margin-bottom: 20px;
  padding-left: 10px;
  padding-top: -4px;

  height: 45px;
  padding: 5px;
  border-radius: 10px;
  background-color: #fff;
`;

export const Input = styled.TextInput`
  width: 80%;
`;

export const Helper = styled(HelperText)`
  color: #fff;
  margin: 2px 0px 5px 0px;
`;

export const Borda = styled.View`
  height: 5px;
  margin-top: 15px;
  width: 80%;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #7ac5ce;
`;

export const MenuOpcoes = styled.TouchableOpacity`
  height: 45px;
  width: 50%;
  justify-content: flex-end;
  align-items: center;
  background-color: transparent;
`;

export const ViewInput = styled.View`
  height: 45px;
  align-items: center;
  flex-direction: row;
  padding: 5px;
  margin-bottom: 20px;
  width: 90%;
  border-radius: 10px;
  background-color: #fff;
`;

export const ViewSelect = styled.View`
  height: 45px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 20px;
  width: 90%;
  border-radius: 10px;
  background-color: #fff;
`;

export const BotaoLogin = styled.TouchableOpacity`
  height: 45px;
  width: 90%;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 35px;
  margin-top: 10px;
  background-color: #7ac5ce;
`;

export const Botao = styled.TouchableOpacity`
  height: 35px;
  width: 40%;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  margin-top: 25px;
  background-color: #fff;
`;

export const InputPassword = styled.TextInput`
  width: 90%;
  font-size: 15px;
  padding: 0px;
  color: #363636;
`;

export const TextInputPassword = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #363636;
  width: 85%;
  text-align: left;
`;
export const ViewInputPassword = styled.View`
  align-items: center;
  padding: 8px 0 4px 0;
  flex-direction: row;
  width: 85%;
  margin-bottom: 10px;
  border-bottom-width: 2px;
  border-color: #676767;
`;
