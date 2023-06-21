import styled from 'styled-components';
import { screenWidth } from '../../Const';

export const Input = styled.TextInput`
  width: ${screenWidth * 0.85}px;
  height: 45px;
  padding: 0px 15px;
  font-size: 15px;
  background-color: #fff;
  border-radius: 20px;
`;

export const InputView = styled.View`
  width: ${screenWidth * 0.85}px;
  height: 45px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  margin-top: 15px;
  flex-direction: row;
`;

export const ButtonLogin = styled.TouchableOpacity`
  width: ${screenWidth * 0.85}px;
  height: 45px;
  background-color: #7ac5ce;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  margin-top: 25px;
`;

export const TextLogin = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 18px;
`;

export const Header = styled.View`
  display: flex;
  width: ${screenWidth}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px 20px;
  height: 70px;
`;

export const Title = styled.Text`
  font-size: 22px;
  color: #4f4f4f;
  margin: 0px 0px 2px 10px;
`;

export const ButtonIcon = styled.TouchableOpacity`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
`;

export const Logo = styled.Image`
  height: 40px;
  max-width: ${screenWidth * 0.64}px;
`;

export const Pergunta = styled.Text`
  font-size: 35px;
  width: 80%;
  text-align: center;
  color: #4f4f4f;
  margin: 30px 0px 15px 0px;
`;

export const TextoComplementar = styled.Text`
  font-size: 16px;
  width: 85%;
  margin-bottom: 10px;
  text-align: center;
  color: #4f4f4f;
`;

export const TextInput = styled.Text`
  font-size: 13px;
  width: 100%;
  text-align: left;
  color: #4f4f4f;
  margin: 0px 0px 6px 30px;
`;
export const ViewInputSenha = styled.View`
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  padding-right: 15px;
  flex-direction: row;
  background-color: #ececec;
  width: ${screenWidth * 0.85}px;
`;

export const ViewInput = styled.View`
  align-items: center;
  width: ${screenWidth * 0.85}px;
  margin-top: 10px;
`;
