import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ActivityIndicator, ScrollView, Image 
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function ADMIN_SubirEjercicio({ navigation }: any) {
  const [nombre, setNombre] = useState('');
  const [grupo, setGrupo] = useState('Pecho');
  const [nivel, setNivel] = useState('Principiante');
  const [imagenUrl, setImagenUrl] = useState(''); 
  const [cargando, setCargando] = useState(false);

  const guardarEjercicio = async () => {
    if (!nombre.trim() || !imagenUrl.trim()) {
      Alert.alert('Error', 'Por favor llena todos los campos, incluyendo la imagen');
      return;
    }

    setCargando(true);
    try {
      const { error } = await supabase
        .from('Ejercicios')
        .insert([
          { 
            nombre: nombre.trim(), 
            grupo: grupo, 
            nivel: nivel, 
            imagen_url: imagenUrl.trim() 
          }
        ]);

      if (error) throw error;

      Alert.alert('¡Logrado!', 'El ejercicio ya está disponible para los usuarios');
      setNombre('');
      setImagenUrl('');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error en Supabase', error.message);
    } finally {
      setCargando(false);
    }
  };

  const SelectorOpcion = ({ label, opciones, actual, setActual }: any) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={estilos.label}>{label}</Text>
      <View style={estilos.filaOpciones}>
        {opciones.map((op: string) => (
          <TouchableOpacity 
            key={op}
            style={[estilos.tag, actual === op && estilos.tagActivo]}
            onPress={() => setActual(op)}
          >
            <Text style={[estilos.textoTag, actual === op && estilos.textoTagActivo]}>{op}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={estilos.contenedor} contentContainerStyle={{ paddingBottom: 50 }}>
      {/* Header sin flecha de retroceso */}
      <View style={estilos.header}>
        <Text style={estilos.titulo}>Nuevo Ejercicio</Text>
      </View>

      <View style={estilos.formulario}>
        <Text style={estilos.label}>Nombre del Ejercicio</Text>
        <TextInput 
          style={estilos.input}
          placeholder="Ej: Press de Banca"
          placeholderTextColor="#555"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={estilos.label}>URL de la Imagen (Link directo)</Text>
        <TextInput 
          style={estilos.input}
          placeholder="https://ejemplo.com/imagen.jpg"
          placeholderTextColor="#555"
          value={imagenUrl}
          onChangeText={setImagenUrl}
        />

        {imagenUrl !== '' && (
          <View style={estilos.previewContainer}>
            <Text style={[estilos.label, { fontSize: 10 }]}>VISTA PREVIA:</Text>
            <Image source={{ uri: imagenUrl }} style={estilos.previewImagen} />
          </View>
        )}

        <SelectorOpcion 
          label="Grupo Muscular" 
          opciones={['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Bíceps', 'Tríceps', 'Abdomen']}
          actual={grupo}
          setActual={setGrupo}
        />

        <SelectorOpcion 
          label="Nivel" 
          opciones={['Principiante', 'Intermedio', 'Avanzado']}
          actual={nivel}
          setActual={setNivel}
        />

        <TouchableOpacity 
          style={estilos.botonGuardar} 
          onPress={guardarEjercicio}
          disabled={cargando}
        >
          {cargando ? <ActivityIndicator color="#000" /> : <Text style={estilos.textoBoton}>CREAR EJERCICIO</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { 
    marginTop: 40, 
    marginBottom: 20,
    justifyContent: 'center' 
  },
  titulo: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  formulario: { marginTop: 10 },
  label: { color: '#888', marginBottom: 10, fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase' },
  input: { 
    backgroundColor: '#121212', 
    color: '#fff', 
    padding: 16, 
    borderRadius: 15, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222'
  },
  filaOpciones: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#121212', borderWidth: 1, borderColor: '#333' },
  tagActivo: { backgroundColor: '#C5FF2A', borderColor: '#C5FF2A' },
  textoTag: { color: '#888', fontWeight: '600' },
  textoTagActivo: { color: '#000' },
  previewContainer: { marginBottom: 20, alignItems: 'center' },
  previewImagen: { width: '100%', height: 180, borderRadius: 15, marginTop: 10 },
  botonGuardar: { backgroundColor: '#C5FF2A', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  textoBoton: { color: '#000', fontWeight: '900', fontSize: 16 }
});