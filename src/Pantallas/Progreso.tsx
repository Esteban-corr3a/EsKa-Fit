import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, 
  SafeAreaView, TextInput, Alert 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase'; // Asegúrate de tener configurado Supabase

const { width } = Dimensions.get('window');

export default function Progreso({ navigation }: any) {
  
  // Estados para los datos del usuario
  const [datosPerfil, setDatosPerfil] = useState({
    peso: '70',
    altura: '170',
    edad: '25',
    actividad: 1.375, // Moderado por defecto
    genero: 'hombre' 
  });

  const [macros, setMacros] = useState({
    kcal: 0,
    proteina: 0,
    carbs: 0,
    grasas: 0
  });

  // Efecto para recalcular cada vez que cambien los datos físicos
  useEffect(() => {
    calcularObjetivos();
  }, [datosPerfil]);

  const calcularObjetivos = () => {
    const p = parseFloat(datosPerfil.peso);
    const a = parseFloat(datosPerfil.altura);
    const e = parseFloat(datosPerfil.edad);

    if (!p || !a || !e) return;

    // Fórmula de Harris-Benedict revisada
    let tmb = (10 * p) + (6.25 * a) - (5 * e);
    tmb = datosPerfil.genero === 'hombre' ? tmb + 5 : tmb - 161;

    const kcalTotales = Math.round(tmb * datosPerfil.actividad);
    
    // Distribución estándar de macros (40% Carbs, 30% Proteína, 30% Grasas)
    setMacros({
      kcal: kcalTotales,
      proteina: Math.round((kcalTotales * 0.30) / 4),
      carbs: Math.round((kcalTotales * 0.40) / 4),
      grasas: Math.round((kcalTotales * 0.30) / 9),
    });
  };

  const actualizarDato = (campo: string, valor: string) => {
    setDatosPerfil({ ...datosPerfil, [campo]: valor });
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        <Text style={estilos.titulo}>Mi Progreso</Text>

        {/* 1. SECCIÓN DE EDICIÓN FÍSICA */}
        <View style={estilos.seccion}>
          <Text style={estilos.subtitulo}>Datos de Perfil</Text>
          <View style={estilos.gridInputs}>
            <View style={estilos.inputCaja}>
              <Text style={estilos.labelInput}>Peso (kg)</Text>
              <TextInput 
                style={estilos.input}
                keyboardType="numeric"
                value={datosPerfil.peso}
                onChangeText={(v) => actualizarDato('peso', v)}
                placeholderTextColor="#444"
              />
            </View>
            <View style={estilos.inputCaja}>
              <Text style={estilos.labelInput}>Altura (cm)</Text>
              <TextInput 
                style={estilos.input}
                keyboardType="numeric"
                value={datosPerfil.altura}
                onChangeText={(v) => actualizarDato('altura', v)}
              />
            </View>
            <View style={estilos.inputCaja}>
              <Text style={estilos.labelInput}>Edad</Text>
              <TextInput 
                style={estilos.input}
                keyboardType="numeric"
                value={datosPerfil.edad}
                onChangeText={(v) => actualizarDato('edad', v)}
              />
            </View>
          </View>
        </View>

        {/* 2. SECCIÓN DE OBJETIVOS CALCULADOS */}
        <View style={estilos.seccion}>
          <Text style={estilos.subtitulo}>Objetivo Diario Sugerido</Text>
          <View style={estilos.cardMacros}>
            <View style={estilos.headerMacros}>
              <Text style={estilos.kcalGrande}>{macros.kcal}</Text>
              <Text style={estilos.kcalUnidad}>kcal / día</Text>
            </View>
            
            <View style={estilos.divisor} />

            <View style={estilos.filaMacros}>
              <MacroItem valor={macros.proteina} nombre="Proteína" color="#FF4444" />
              <MacroItem valor={macros.carbs} nombre="Carbs" color="#FFD700" />
              <MacroItem valor={macros.grasas} nombre="Grasas" color="#00FFB2" />
            </View>
          </View>
          <Text style={estilos.notaInformativa}>
            *Calculado automáticamente según tu TMB y nivel de actividad.
          </Text>
        </View>

        {/* 3. BOTÓN A LA CALCULADORA AVANZADA */}
        <View style={estilos.seccion}>
          <TouchableOpacity 
            style={estilos.botonCalculadora}
            onPress={() => navigation.navigate('CalculadoraMacros')}
          >
            <View style={estilos.iconoCaja}>
              <MaterialCommunityIcons name="calculator-variant" size={28} color="#C5FF2A" />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={estilos.btnTitulo}>Personalizar Plan</Text>
              <Text style={estilos.btnSubtitulo}>Ajustar nivel de actividad y metas</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C5FF2A" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-componente para los macros
const MacroItem = ({ valor, nombre, color }: any) => (
  <View style={estilos.itemMacro}>
    <Text style={[estilos.valorMacro, { color }]}>{valor}g</Text>
    <Text style={estilos.nombreMacro}>{nombre}</Text>
  </View>
);

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#000' },
  titulo: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginHorizontal: 20, marginVertical: 20 },
  seccion: { marginBottom: 25, paddingHorizontal: 20 },
  subtitulo: { color: '#C5FF2A', fontSize: 14, fontWeight: 'bold', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  
  // Grid de Inputs
  gridInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  inputCaja: { backgroundColor: '#111', borderRadius: 15, padding: 12, width: (width - 60) / 3, borderWidth: 1, borderColor: '#222' },
  labelInput: { color: '#666', fontSize: 10, marginBottom: 5, textTransform: 'uppercase' },
  input: { color: '#C5FF2A', fontSize: 18, fontWeight: 'bold', padding: 0 },

  // Estilo Card Macros
  cardMacros: { backgroundColor: '#111', borderRadius: 25, padding: 20, borderWidth: 1, borderColor: '#222' },
  headerMacros: { alignItems: 'center', marginBottom: 15 },
  kcalGrande: { color: '#fff', fontSize: 42, fontWeight: '900' },
  kcalUnidad: { color: '#666', fontSize: 14 },
  divisor: { height: 1, backgroundColor: '#222', marginVertical: 10 },
  filaMacros: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  itemMacro: { alignItems: 'center' },
  valorMacro: { fontSize: 20, fontWeight: 'bold' },
  nombreMacro: { color: '#666', fontSize: 11, marginTop: 4 },
  notaInformativa: { color: '#444', fontSize: 11, marginTop: 10, textAlign: 'center', fontStyle: 'italic' },

  // Botón Calculadora
  botonCalculadora: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C5FF2A33',
  },
  iconoCaja: { backgroundColor: '#1A1A1A', padding: 10, borderRadius: 12 },
  btnTitulo: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnSubtitulo: { color: '#666', fontSize: 12 },
});