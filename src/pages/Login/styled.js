import styled from 'styled-components';
import { screenWidth } from '../../Const';
import { Animated, Image } from 'react-native';

export const Input = styled.TextInput`
  flex: 1;
  font-size: 16px;
  margin-right: 10px;
  height: 45px;
  color: #fff;
`;

export const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #f0f0f0;
`;

export const InputView = styled.View`
  width: ${screenWidth * 0.85}px;
  height: 45px;
  border-radius: 30px;
  align-items: center;
  justify-content: space-around;
  background-color: #5f5f5f;
  margin-top: 15px;
  flex-direction: row;
`;

export const ButtonLogin = styled.TouchableOpacity`
  width: ${screenWidth * 0.85}px;
  height: 45px;
  background-color: #7ac5ce;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  margin-top: 20px;
`;

export const TextLogin = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 18px;
`;

export const Logo = styled(Animated.Image)`
  width: ${screenWidth * 0.6}px;
  margin: 25px 0px;
`;

export const FooterView = styled.View`
  align-items: center;
  background-color: #f0f0f0;
`;

export const ButtonRegister = styled.TouchableOpacity`
  width: ${screenWidth * 0.85}px;
  height: 45px;
  background-color: #7ac5ce;
  align-items: center;
  justify-content: center;
  margin: -5px 0px 15px 0;
  border-radius: 25px;
`;

export const TextRegister = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const TextPassword = styled.Text`
  color: #4f4f4f;
  text-align: center;
  margin-top: 40px;
  font-weight: bold;
  font-size: 15px;
  text-decoration: underline;
`;
