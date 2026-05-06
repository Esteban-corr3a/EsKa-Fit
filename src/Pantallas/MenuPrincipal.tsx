import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Home from './Home'; 
import Ejercicios from './Ejercicios';
import Progreso from './Progreso';

// Componente temporal para Rutinas
const RutinasScreen = () => <View style={estilos.pantallaBase} />;

const Tab = createBottomTabNavigator();

export default function MenuPrincipal() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#C5FF2A',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? 40 : 30, 
            left: 20,
            right: 20,
            
            // DISEÑO DE ISLA
            height: 75, 
            borderRadius: 35,
            backgroundColor: '#1A1A1A',
            borderTopWidth: 0,
            
            // ESPACIADO INTERNO
            paddingTop: 12,
            paddingBottom: 12,

            // SOMBRA Y ELEVACIÓN
            elevation: 15, 
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.6,
            shadowRadius: 15,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: 'bold',
            marginBottom: 5,
          },
          tabBarIconStyle: {
            marginBottom: 2,
          },
          tabBarIcon: ({ focused, color }) => {
            const size = 24;
            if (route.name === 'Inicio') {
              return <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />;
            } else if (route.name === 'Ejercicios') {
              return <MaterialCommunityIcons name="run" size={size} color={color} />;
            } else if (route.name === 'Rutinas') {
              return <MaterialCommunityIcons name="dumbbell" size={size} color={color} />;
            } else if (route.name === 'Progreso') {
              return <MaterialCommunityIcons name="chart-bar" size={size} color={color} />;
            }
          },
        })}
      >
        <Tab.Screen name="Inicio" component={Home} />
        <Tab.Screen name="Ejercicios" component={Ejercicios} />
        <Tab.Screen name="Rutinas" component={RutinasScreen} />
        <Tab.Screen name="Progreso" component={Progreso} />
        
        {/* El Screen de Perfil ha sido eliminado de aquí */}
      </Tab.Navigator>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantallaBase: { flex: 1, backgroundColor: '#000' },
});