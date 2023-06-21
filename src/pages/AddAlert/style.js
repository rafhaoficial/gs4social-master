import styled from 'styled-components';
import { screenWidth } from '../../Const';

export const Imagem = styled.Image`
  width: ${screenWidth * 0.9 * 0.3}px;
  height: ${screenWidth * 0.9 * 0.3}px;
  border-radius: 12px;
  background-color: #ddd;
  opacity: 0.8;
`;

export const ViewImages = styled.View`
  width: ${screenWidth * 0.9}px;
  border-radius: 12px;
  margin-top: 5px;
  flex-direction: row;
  justify-content: space-between;
`;

export const ButtonImage = styled.TouchableOpacity`
  width: ${screenWidth * 0.9 * 0.3}px;
  height: ${screenWidth * 0.9 * 0.3}px;
  justify-content: center;
  align-items: center;
`;

export const TextButton = styled.Text`
  font-size: 20px;
  color: #fff;
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
  width: 100%;
  padding: 0px;
`;

export const ViewInput = styled.View`
  min-height: 45px;
  align-items: center;
  flex-direction: row;
  padding: 0px 10px;
  width: 90%;
  border-radius: 10px;
  background-color: #fff;
`;

export const TextInput = styled.Text`
  font-size: 14px;
  text-align: left;
  width: 88%;
  margin: 15px 0 6px 0;
  font-weight: bold;
`;

export const Button = styled.TouchableOpacity`
  height: 45px;
  width: 90%;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 35px;
  margin-top: 30px;
  background-color: #7ac5ce;
`;
