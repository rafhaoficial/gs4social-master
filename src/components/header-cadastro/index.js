import React, { Component } from 'react';
import {
    Text,
    View, 
    AsyncStorage,
    Platform
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Icone from 'react-native-vector-icons/Feather';
import { withNavigation } from 'react-navigation';
import { Container, Texto, Botao } from './style';

class HeaderCadastro extends Component{

    

    render(){


        return(
            <Container >
                <Botao
                onPress={ ()=>{
                    
                        this.props.navigation.navigate('Login')
                  
                }}
                >
                     <Icone 
            name={'arrow-left'}
            size={30}
            color={'#000'}
          />
                </Botao>
            </Container>
        )
    }
}

export default withNavigation(HeaderCadastro);