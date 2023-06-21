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
  font-size: 14px;
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
  font-size: 18px;
  color: #fff;
  font-weight: bold;
`;

export const TextoBotao = styled.Text`
  font-size: 12px;
  color: #5f5f5f;
  font-weight: bold;
`;

export const Borda = styled.View`
  height: 5px;
  margin-top: 5px;
  width: 80%;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: #5f5f5f;
`;

export const MenuOpcoes = styled.TouchableOpacity`
  height: 45px;
  width: 30%;
  background-color: #fff;
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
  width: 100%;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  background-color: #5f5f5f;
`;

export const Container = styled.View`
  flex: 1;
  min-height: 500px;
  padding: 25px 0;
  align-items: center;
  width: 100%;
  background-color: #5f5f5f;
`;

export const ViewCampaign = styled.View`
  padding: 15px 0;
  align-items: center;
  justify-content: center;
  width: 90%;
  background-color: #f0f0f0;
  border-radius: 15px;
  margin-bottom: 15px;
`;

export const TitleCampaign = styled.Text`
  font-size: 15px;
  font-weight: bold;
  width: 75%;
  text-align: center;
  margin: 15px 0;
`;

export const ImageCampaign = styled.Image`
  width: 90%;
  height: 250px;
  border-radius: 10px;
`;
export const DescriptionCampaign = styled.Text`
  font-size: 13px;
  width: 85%;
  text-align: center;
  margin: 10px 0 5px 0;
`;

export const DateCampaign = styled.Text`
  font-size: 17px;
  width: 85%;
  text-align: center;
  font-weight: bold;
  margin-bottom: 15px;
`;

export const ButtonEditCampaign = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  background-color: #7ac5ce;
  width: 40px;
  position: absolute;
  height: 40px;
  right: 10px;
  top: 60px;
  border-radius: 20px;
`;

export const ButtonCreate = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  background-color: #7ac5ce;
  width: 90%;
  height: 45px;
  border-radius: 10px;
  padding: 0 15px;
  margin-bottom: 15px;
`;

export const TextButtonCreate = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;
