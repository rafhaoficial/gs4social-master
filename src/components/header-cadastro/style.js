import styled from 'styled-components';
import { Text, View, TextInput, TouchableOpacity, Image} from 'react-native';

export const Texto = styled.Text`
    font-size: 13px; 
    color: #000;
    text-align: center;
    font-weight: bold;
`;

export const Container = styled.View`
    width: 100%;
    padding: 2px 0px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: #f0f0f0;
    `;

export const Botao = styled.TouchableOpacity`

        height: 70px;
        width: 25%;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        background-color: transparent;
`;

