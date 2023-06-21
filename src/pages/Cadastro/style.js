import styled from 'styled-components';
import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { HelperText } from 'react-native-paper';

export const TextoMenu = styled.Text`
  font-size: 18px;
  width: 50%;
  text-align: center;
  margin-top: -70px;
  margin-bottom: 25px;
  color: #000;
  font-weight: bold;
`;

export const TextoOpcoes = styled.Text`
  font-size: 16px;
  text-align: center;
  font-weight: bold;
`;

export const Logo = styled.Image`
  width: 80%;
  height: 200px;
  margin-bottom: 40px;
  margin-top: -50px;
`;

export const TextoLogin = styled.Text`
  font-size: 16px;
  color: #FFF;
  font-weight: bold;
`;

export const TextoBotao = styled.Text`
  font-size: 12px;
  color: #5f5f5f;
  font-weight: bold;
`;

export const Container = styled.View`
  display: flex;
  flex: 1;
  padding-top: 10px;
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
  flex: 1;
`;

export const Helper = styled(HelperText)`
  color: #fff;
  margin: 2px 0px 5px 0px;
`;

export const Borda = styled.View`
  height: 5px;
  margin-top: 10px;
  width: 80%;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #7ac5ce;
`;

export const MenuOpcoes = styled.TouchableOpacity`
  height: 30px;
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
  width: 85%;
  border-radius: 10px;
  background-color: #fff;
`;

export const ViewSelect = styled.View`
  height: 45px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 20px;
  padding-top: 15px;
  width: 85%;
  border-radius: 10px;
  background-color: #fff;
`;

export const BotaoLogin = styled.TouchableOpacity`
  height: 45px;
  width: 85%;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 300px;
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
