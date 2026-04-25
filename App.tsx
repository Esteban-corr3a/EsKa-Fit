import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen'; 
import StackNavigator from './src/Navegacion/Stacknavigator';


const logoImg = require('./assets/Imagenes/Logo.png');

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1)); 

  useEffect(() => {
    async function prepare() {
      try {
        // Tiempo de carga (4 segundos)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar style="light" />
        <Image 
          source={logoImg} 
          style={styles.logo} 
          resizeMode="contain" 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <StackNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#000000', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200, 
    height: 200,
  },
  container: {
    flex: 1,
    backgroundColor: '#000000', 
  },
});