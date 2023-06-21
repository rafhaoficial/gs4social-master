import styled from 'styled-components';
import { Text, TouchableOpacity } from 'react-native';
import { Surface } from 'react-native-paper';

export const TextoMenu = styled.Text`
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  font-family: Roboto;
`;

export const ViewUser = styled.View`
  margin: 25px;
  height: auto;
  align-items: center;
`;

export const Botao = styled.TouchableOpacity`
  background: #fff;
  margin-top: 5px;
  width: 75%;
  border-radius: 5px;
  height: 45px;
  align-items: center;
  justify-content: center;
`;

export const Container = styled.View`
  margin: 25px;
  height: auto;
  align-items: center;
`;

export const TextUser = styled.Text`
  font-size: 15px;
  margin-top: 5px;
  font-weight: bold;
  font-style: normal;
  text-align: center;
  color: #4f4f4f;
`;

export const Option = styled.TouchableOpacity`
  margin-top: 15px;
  border-radius: 10px;
  width: 95%;
  height: 45px;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  background-color: #7ac5ce;
`;

export const TextOption = styled.Text`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #fff;
`;
