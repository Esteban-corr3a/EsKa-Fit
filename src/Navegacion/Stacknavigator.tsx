import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas normales
import MenuPrincipal from '../Pantallas/MenuPrincipal';
import Login from '../Pantallas/Login';
import Registro from '../Pantallas/Registro';
import EditarPerfil from '../Pantallas/EditarPerfil';
import Ejercicios from '../Pantallas/Ejercicios';
import Progreso from '../Pantallas/Progreso';
import CalculadoraMacros from '../Pantallas/CalculadoraMacros';

// Pantallas de Administrador
import ADMIN_Panel from '../Pantallas/ADMIN_Panel';
import ADMIN_Gestionperfiles from '../Pantallas/ADMIN_Gestionperfiles';
import ADMIN_SubirRutina from '../Pantallas/ADMIN_SubirRutina';
import ADMIN_SubirEjercicio from '../Pantallas/ADMIN_SubirEjercicio';

const Stack = createNativeStackNavigator<any>();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login" // Empezamos en Login
        screenOptions={{
          headerStyle: { backgroundColor: '#0D0D0D' },
          headerTitleStyle: { color: '#C5FF2A', fontWeight: '600' },
          headerShadowVisible: false,
          headerTintColor: '#C5FF2A',
          headerShown: false,
        }}
      >
        {/* FLUJO DE AUTENTICACIÓN */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registro" component={Registro} />

        {/* FLUJO PRINCIPAL DE USUARIO */}
        <Stack.Screen name="Main" component={MenuPrincipal} />

        <Stack.Screen
          name="Ejercicios"
          component={Ejercicios}
          options={{
            headerShown: true,
            title: 'Ejercicios',
            headerStyle: { backgroundColor: '#000' }
          }}
        />

        {/* FLUJO ADMINISTRATIVO */}
        <Stack.Screen name="AdminPanel" component={ADMIN_Panel} options={{
          headerShown: true, title: 'Panel de Control', headerStyle: { backgroundColor: '#000' }
        }} />
        <Stack.Screen name="ADMIN_Gestionperfiles" component={ADMIN_Gestionperfiles} options={{
          headerShown: true, title: 'Gestión de Perfiles', headerStyle: { backgroundColor: '#000' }
        }} />
        <Stack.Screen name="ADMIN_SubirRutina" component={ADMIN_SubirRutina} options={{
          headerShown: true, title: 'Nueva Rutina', headerStyle: { backgroundColor: '#000' }
        }} />
        <Stack.Screen name="ADMIN_SubirEjercicio" component={ADMIN_SubirEjercicio} options={{
          headerShown: true, title: 'Subir Ejercicio', headerStyle: { backgroundColor: '#000' }
        }} />


        {/* FLUJO USUARIO */}
        <Stack.Screen name="EditarPerfil" component={EditarPerfil} options={{
          headerShown: true, title: 'Editar Perfil', headerStyle: { backgroundColor: '#000' }
        }} />
        <Stack.Screen name="CalculadoraMacros" component={CalculadoraMacros} options={{
          headerShown: true, title: 'Calculadora de Macros', headerStyle: { backgroundColor: '#000' }
        }} />
        <Stack.Screen name="Progreso" component={Progreso} options={{
          headerShown: true, title: 'Progreso', headerStyle: { backgroundColor: '#000' }
        }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}