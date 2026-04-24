import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// CORRECCIÓN: Si StackNavigator y Pantallas están en 'src', es './'
import MenuPrincipal from '../Pantallas/MenuPrincipal';

import Login from '../Pantallas/Login';
import Registro from '../Pantallas/Registro';

import Home from '../Pantallas/Home';
import Perfil from '../Pantallas/Perfil';

// Usamos <any> para que TypeScript sea flexible mientras desarrollas
const Stack = createNativeStackNavigator<any>();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#0D0D0D' },
          headerTitleStyle: { color: '#00FFB2', fontWeight: '600' },
          headerShadowVisible: false,
          headerTintColor: '#00FFB2',
        }}
      >
        <Stack.Screen name="Main" component={MenuPrincipal} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Registro" component={Registro} options={{ headerShown: false }} />
        <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}