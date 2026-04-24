import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Home from './Home'; 
import Perfil from './Perfil';

const EjerciciosScreen = () => <View style={estilos.pantallaBase} />;
const RutinasScreen = () => <View style={estilos.pantallaBase} />;
const ProgresoScreen = () => <View style={estilos.pantallaBase} />;

const Tab = createBottomTabNavigator();

const COLORES = {
  fondoMenu: '#000000',
  activo: '#C5FF2A', 
  inactivo: '#888888',
};

export default function MenuPrincipal() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORES.fondoMenu,
          borderTopWidth: 0,
          // Aumentamos el alto total del contenedor
          height: Platform.OS === 'ios' ? 100 : 85, 
          // Agregamos un padding inferior mucho más grande para empujar todo hacia arriba
          paddingBottom: Platform.OS === 'ios' ? 35 : 20, 
          position: 'absolute', // Esto ayuda a que el layout se comporte mejor en algunos dispositivos
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0, // Quita sombras extrañas en Android
        },
        tabBarActiveTintColor: COLORES.activo,
        tabBarInactiveTintColor: COLORES.inactivo,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          // Este es el truco: le damos un margen abajo para que el texto suba
          marginBottom: 5, 
        },
        tabBarIconStyle: {
          // También subimos el icono
          marginTop: 5, 
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Inicio') {
            return <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />;
          } else if (route.name === 'Ejercicios') {
            return <MaterialCommunityIcons name="run" size={size} color={color} />;
          } else if (route.name === 'Rutinas') {
            return <MaterialCommunityIcons name="dumbbell" size={size} color={color} />;
          } else if (route.name === 'Progreso') {
            return <MaterialCommunityIcons name="chart-bar" size={size} color={color} />;
          } else if (route.name === 'Perfil') {
            return <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Inicio" component={Home} />
      <Tab.Screen name="Ejercicios" component={EjerciciosScreen} />
      <Tab.Screen name="Rutinas" component={RutinasScreen} />
      <Tab.Screen name="Progreso" component={ProgresoScreen} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

const estilos = StyleSheet.create({
  pantallaBase: {
    flex: 1,
    backgroundColor: '#000',
  },
});