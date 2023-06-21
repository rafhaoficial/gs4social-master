import styled from 'styled-components';
import { Text, TouchableOpacity } from 'react-native';
import { Surface } from 'react-native-paper';

export const TextoMenu = styled.Text`
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  font-family: Roboto;
`;

export const Texto = styled.Text`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #fff;
`;

export const Opcao = styled.View`
  margin: 25px;
  height: auto;
  align-items: center;
`;

export const Botao = styled.TouchableOpacity`
  background: #fff;
  margin-top: 5px;
  width: 75%;
  border-radius: 5px;
  height: 4px;
  align-items: center;
  justify-content: center;
`;

export const Container = styled.View`
  margin: 25px 0;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
`;

export const Input = styled.TextInput`
  width: 95%;
  padding-left: 15px;
`;

export const ViewInput = styled.View`
  flex-direction: column;
  padding: 10px 5px 5px 15px;
  margin-bottom: 20px;
  width: 90%;
  border-radius: 10px;
  background-color: #ccc;
`;
