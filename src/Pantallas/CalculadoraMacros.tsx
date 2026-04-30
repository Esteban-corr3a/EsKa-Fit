import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CalculadoraMacros() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('hombre'); // hombre o mujer
  const [objetivo, setObjetivo] = useState('mantenimiento'); // perder, mantener, ganar
  const [resultado, setResultado] = useState<any>(null);

  const calcularMacros = () => {
    if (!peso || !altura || !edad) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const p = parseFloat(peso);
    const a = parseFloat(altura);
    const e = parseInt(edad);

    // 1. Calcular TMB (Mifflin-St Jeor)
    let tmb = (10 * p) + (6.25 * a) - (5 * e);
    tmb = genero === 'hombre' ? tmb + 5 : tmb - 161;

    // 2. Multiplicar por factor de actividad moderada (1.55)
    let mantenimiento = tmb * 1.55;

    // 3. Ajustar según objetivo
    let caloriasObjetivo = mantenimiento;
    if (objetivo === 'perder') caloriasObjetivo -= 500;
    if (objetivo === 'ganar') caloriasObjetivo += 500;

    // 4. Repartición de Macros (Ejemplo estándar: 30% Prot, 30% Grasa, 40% Carbs)
    const proteinas = (caloriasObjetivo * 0.30) / 4;
    const grasas = (caloriasObjetivo * 0.30) / 9;
    const carbs = (caloriasObjetivo * 0.40) / 4;

    setResultado({
      kcal: Math.round(caloriasObjetivo),
      prot: Math.round(proteinas),
      gras: Math.round(grasas),
      carb: Math.round(carbs)
    });
  };

  return (
    <ScrollView style={estilos.contenedor}>
      <Text style={estilos.titulo}>Calculadora de Macros</Text>
      
      <View style={estilos.card}>
        <Text style={estilos.label}>Género</Text>
        <View style={estilos.fila}>
          <TouchableOpacity 
            style={[estilos.selector, genero === 'hombre' && estilos.activo]} 
            onPress={() => setGenero('hombre')}
          >
            <Text style={[estilos.textoSel, genero === 'hombre' && estilos.textoActivo]}>Hombre</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[estilos.selector, genero === 'mujer' && estilos.activo]} 
            onPress={() => setGenero('mujer')}
          >
            <Text style={[estilos.textoSel, genero === 'mujer' && estilos.textoActivo]}>Mujer</Text>
          </TouchableOpacity>
        </View>

        <View style={estilos.inputFila}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={estilos.label}>Peso (kg)</Text>
            <TextInput style={estilos.input} keyboardType="numeric" value={peso} onChangeText={setPeso} placeholder="70" placeholderTextColor="#444"/>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={estilos.label}>Altura (cm)</Text>
            <TextInput style={estilos.input} keyboardType="numeric" value={altura} onChangeText={setAltura} placeholder="175" placeholderTextColor="#444"/>
          </View>
        </View>

        <Text style={estilos.label}>Edad</Text>
        <TextInput style={estilos.input} keyboardType="numeric" value={edad} onChangeText={setEdad} placeholder="25" placeholderTextColor="#444"/>

        <Text style={estilos.label}>Objetivo</Text>
        <View style={estilos.filaVertical}>
          {['perder', 'mantenimiento', 'ganar'].map((obj) => (
            <TouchableOpacity 
              key={obj}
              style={[estilos.selectorLargo, objetivo === obj && estilos.activo]}
              onPress={() => setObjetivo(obj)}
            >
              <Text style={[estilos.textoSel, objetivo === obj && estilos.textoActivo]}>
                {obj === 'perder' ? 'Perder Grasa' : obj === 'ganar' ? 'Ganar Músculo' : 'Mantener Peso'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={estilos.botonCalcular} onPress={calcularMacros}>
          <Text style={estilos.textoBoton}>CALCULAR RESULTADOS</Text>
        </TouchableOpacity>
      </View>

      {resultado && (
        <View style={estilos.resultadoCard}>
          <Text style={estilos.resTitulo}>Tus Requerimientos</Text>
          <Text style={estilos.kcal}>{resultado.kcal} <Text style={{fontSize: 20}}>kcal</Text></Text>
          
          <View style={estilos.gridMacros}>
            <View style={estilos.macroItem}>
              <Text style={[estilos.macroValor, {color: '#FF4444'}]}>{resultado.prot}g</Text>
              <Text style={estilos.macroNombre}>Proteína</Text>
            </View>
            <View style={estilos.macroItem}>
              <Text style={[estilos.macroValor, {color: '#FFD700'}]}>{resultado.carb}g</Text>
              <Text style={estilos.macroNombre}>Carbs</Text>
            </View>
            <View style={estilos.macroItem}>
              <Text style={[estilos.macroValor, {color: '#00FFB2'}]}>{resultado.gras}g</Text>
              <Text style={estilos.macroNombre}>Grasas</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#000', padding: 20 },
  titulo: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginVertical: 30 },
  card: { backgroundColor: '#111', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#222' },
  label: { color: '#C5FF2A', fontSize: 12, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
  fila: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  inputFila: { flexDirection: 'row', marginBottom: 20 },
  input: { backgroundColor: '#000', color: '#fff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  selector: { flex: 1, padding: 15, alignItems: 'center', backgroundColor: '#000', borderRadius: 12, marginHorizontal: 5, borderWidth: 1, borderColor: '#333' },
  selectorLargo: { width: '100%', padding: 15, alignItems: 'center', backgroundColor: '#000', borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  activo: { backgroundColor: '#C5FF2A', borderColor: '#C5FF2A' },
  textoSel: { color: '#666', fontWeight: 'bold' },
  textoActivo: { color: '#000' },
  filaVertical: { marginBottom: 20 },
  botonCalcular: { backgroundColor: '#C5FF2A', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  textoBoton: { color: '#000', fontWeight: '900', fontSize: 16 },
  resultadoCard: { marginTop: 25, backgroundColor: '#111', padding: 25, borderRadius: 25, alignItems: 'center', marginBottom: 50 },
  resTitulo: { color: '#888', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  kcal: { color: '#fff', fontSize: 45, fontWeight: '900' },
  gridMacros: { flexDirection: 'row', marginTop: 20, width: '100%', justifyContent: 'space-around' },
  macroItem: { alignItems: 'center' },
  macroValor: { fontSize: 20, fontWeight: 'bold' },
  macroNombre: { color: '#666', fontSize: 12, marginTop: 5 }
});