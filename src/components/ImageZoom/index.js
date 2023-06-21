
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {withNavigation} from 'react-navigation';
import {Image} from 'react-native';
import {screenWidth} from '../../Const';
import {Button, ViewModal} from './style';

import Modal from 'react-native-modal';

function ImageZoom({imagem, tam}) {
  const [modal, setModal] = useState(false);
  return (
    <>
      <Button
        onPress={() => {
          setModal(true);
        }}>
        <Image
          source={imagem}
          style={{
            width: screenWidth * tam,
            height: screenWidth * tam,
            borderRadius: 12,
          }}
        />
      </Button>
      <Modal
        backdropOpacity={0.5}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0,
        }}
        onBackdropPress={() => setModal(false)}
        isVisible={modal}>
        <ViewModal>
          <Image
            source={imagem}
            style={{
              width: screenWidth * 0.8,
              height: screenWidth * 0.8,
              borderRadius: 12,
            }}
          />
          <Button
            onPress={() => {
              setModal(false);
            }}
            style={{position: 'absolute', right: 15, top: 10}}>
            <Icon name="close" size={30} color="#000" />
          </Button>
        </ViewModal>
      </Modal>
    </>
  );
}

export default withNavigation(ImageZoom);