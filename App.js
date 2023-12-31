import React, { useEffect } from 'react';
import { StatusBar, View, Platform } from 'react-native';
import Router from './src/router';
import React from 'react';
import MapComponent from './MapComponent';

function App() {
  return (
    <div className="App">
      <MapComponent />
    </div>
  );
}

export default App;

export default function App() {
  useEffect(() => {
    StatusBar.setBarStyle(Platform.OS === 'ios' ? 'dark-content' : 'default');
  }, []);


  return (
    <View style={{ paddingTop: Platform.OS == "ios" ? 35 : 0, flex: 1, backgroundColor: "#f0f0f0" }}>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        translucent={false}
        backgroundColor="#f0f0f0"
        networkActivityIndicatorVisible={false}
      />
      <Router />
    </View>
  );
}
