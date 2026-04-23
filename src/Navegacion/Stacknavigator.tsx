import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// CORRECCIÓN: Si StackNavigator y Pantallas están en 'src', es './'
import Login from '../Pantallas/Login';
import Registro from '../Pantallas/Registro';

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
        {/* Asegúrate de que el componente Login esté exportado como 'default' en su archivo */}
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} // Login usualmente no lleva barra superior
        />
        
        {/* Ve agregando las demás pantallas SOLO cuando ya tengas el archivo creado */}
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        <Stack.Screen name="Registro" component={Registro} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}