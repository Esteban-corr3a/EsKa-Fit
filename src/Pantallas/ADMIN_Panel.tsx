import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function AdminPanel({ navigation }: any) {
  const opciones = [
    { id: 1, nombre: 'Gestión de Usuarios', icono: 'people', color: '#C5FF2A', ruta: 'ADMIN_Gestionperfiles' },
    { id: 2, nombre: 'Agregar Nueva Rutina', icono: 'dumbbell', color: '#00FFB2', ruta: 'ADMIN_SubirRutina' },
    { id: 3, nombre: 'Reportes de Progreso', icono: 'bar-chart', color: '#FFD700', ruta: 'Home' }, // Temporal
  ];

  return (
    <ScrollView style={estilos.contenedor}>
      <Text style={estilos.titulo}>Panel Administrativo</Text>
      <View style={estilos.cuadricula}>
        {opciones.map((opcion) => (
          <TouchableOpacity 
            key={opcion.id} 
            style={estilos.tarjeta}
            onPress={() => navigation.navigate(opcion.ruta)}
          >
            <View style={[estilos.iconoFondo, { backgroundColor: opcion.color + '20' }]}>
              {opcion.id === 2 ? 
                <MaterialCommunityIcons name="dumbbell" size={30} color={opcion.color} /> :
                <Ionicons name={opcion.icono as any} size={30} color={opcion.color} />
              }
            </View>
            <Text style={estilos.textoTarjeta}>{opcion.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#000', padding: 20 },
  titulo: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginVertical: 30 },
  cuadricula: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tarjeta: { 
    width: '48%', 
    backgroundColor: '#111', 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center', 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#222'
  },
  iconoFondo: { padding: 15, borderRadius: 50, marginBottom: 15 },
  textoTarjeta: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 14 }
});