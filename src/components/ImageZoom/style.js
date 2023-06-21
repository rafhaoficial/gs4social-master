
   
import styled from 'styled-components';
import {screenWidth} from '../../Const';

export const Button = styled.TouchableOpacity`
  display: flex;
`;

export const ViewModal = styled.View`
  border-radius: 25px;
  width: ${screenWidth * 0.9}px;
  align-items: center;
  padding: 50px 0 25px 0;
  justify-content: center;
  background-color: #fff;
`;