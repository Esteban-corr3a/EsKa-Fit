import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const COLORES = {
  fondo: '#000000',
  tarjeta: '#121212',
  primario: '#C5FF2A',
  textoPrincipal: '#FFFFFF',
  textoSecundario: '#8E8E93',
  borde: '#1C1C1E',
};

export default function ADMIN_SubirRutina({ navigation }: any) {
  const [form, setForm] = useState({ 
    titulo: '', 
    nivel: 'Principiante', 
    tiempo: '', 
    descripcion: '',
    imagen_url: '',
    categoria: '' 
  });
  const [cargando, setCargando] = useState(false);

  const niveles = ['Principiante', 'Intermedio', 'Avanzado'];

  const guardarRutina = async () => {
    // Validación básica
    if (!form.titulo || !form.nivel || !form.tiempo || !form.descripcion || !form.imagen_url) {
      return Alert.alert("Campos incompletos", "Por favor, llena todos los campos para continuar.");
    }

    setCargando(true);

    try {
      const { error } = await supabase
        .from('Rutinas')
        .insert([{
          titulo: form.titulo,
          nivel: form.nivel,
          tiempo: form.tiempo,
          descripcion: form.descripcion,
          imagen_url: form.imagen_url,
          categoria: form.categoria
        }]);

      if (error) throw error;

      Alert.alert("¡Éxito!", "La rutina ha sido publicada correctamente.");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setCargando(false);
    }
  };

  const InputCampo = ({ label, icon, placeholder, value, onChangeText, keyboardType = "default", multiline = false }: any) => (
    <View style={estilos.contenedorInput}>
      <Text style={estilos.label}>{label}</Text>
      <View style={[estilos.inputWrapper, multiline && { height: 100, alignItems: 'flex-start', paddingTop: 12 }]}>
        <MaterialCommunityIcons name={icon} size={20} color={COLORES.primario} style={estilos.icono} />
        <TextInput
          style={[estilos.input, multiline && { textAlignVertical: 'top' }]}
          placeholder={placeholder}
          placeholderTextColor="#555"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={estilos.safeArea}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Personalizado */}
      <View style={estilos.header}>
       
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={estilos.contenedor} showsVerticalScrollIndicator={false}>
        
        <InputCampo 
          label="Título de la Rutina" 
          icon="format-title" 
          placeholder="Ej: Full Body Explosivo"
          value={form.titulo}
          onChangeText={(txt: string) => setForm({...form, titulo: txt})}
        />

        <InputCampo 
          label="URL de la Imagen (Unsplash / Directa)" 
          icon="image-outline" 
          placeholder="https://imagen.com/foto.jpg"
          value={form.imagen_url}
          onChangeText={(txt: string) => setForm({...form, imagen_url: txt})}
        />

        <View style={estilos.fila}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <InputCampo 
              label="Tiempo" 
              icon="clock-outline" 
              placeholder="45 min"
              value={form.tiempo}
              onChangeText={(txt: string) => setForm({...form, tiempo: txt})}
            />
          </View>
          <View style={{ flex: 1 }}>
            <InputCampo 
              label="Categoría" 
              icon="tag-outline" 
              placeholder="Ej: Pierna"
              value={form.categoria}
              onChangeText={(txt: string) => setForm({...form, categoria: txt})}
            />
          </View>
        </View>

        <Text style={estilos.label}>Nivel de Intensidad</Text>
        <View style={estilos.contenedorNiveles}>
          {niveles.map((n) => (
            <TouchableOpacity 
              key={n}
              style={[estilos.capsulaNivel, form.nivel === n && estilos.capsulaActiva]}
              onPress={() => setForm({...form, nivel: n})}
            >
              <Text style={[estilos.textoNivel, form.nivel === n && estilos.textoNivelActivo]}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <InputCampo 
          label="Descripción y Ejercicios" 
          icon="text-subject" 
          placeholder="Describe la rutina y la lista de ejercicios..."
          value={form.descripcion}
          onChangeText={(txt: string) => setForm({...form, descripcion: txt})}
          multiline={true}
        />

        <TouchableOpacity 
          style={[estilos.botonPublicar, cargando && { opacity: 0.7 }]} 
          onPress={guardarRutina}
          disabled={cargando}
        >
          <Text style={estilos.textoBoton}>
            {cargando ? "PUBLICANDO..." : "PUBLICAR RUTINA"}
          </Text>
          {!cargando && <Ionicons name="cloud-upload-outline" size={20} color="#000" style={{ marginLeft: 10 }} />}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORES.fondo },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde
  },
  botonAtras: { padding: 5 },
  tituloHeader: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  contenedor: { flex: 1, padding: 20 },
  contenedorInput: { marginBottom: 20 },
  label: { color: COLORES.textoSecundario, marginBottom: 8, fontSize: 13, fontWeight: '600', marginLeft: 4 },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORES.tarjeta, 
    borderRadius: 15, 
    borderWidth: 1, 
    borderColor: COLORES.borde,
    paddingHorizontal: 15,
    height: 55
  },
  icono: { marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  fila: { flexDirection: 'row' },
  contenedorNiveles: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  capsulaNivel: { 
    flex: 1, 
    backgroundColor: COLORES.tarjeta, 
    paddingVertical: 10, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORES.borde
  },
  capsulaActiva: { backgroundColor: COLORES.primario, borderColor: COLORES.primario },
  textoNivel: { color: COLORES.textoSecundario, fontWeight: '600', fontSize: 12 },
  textoNivelActivo: { color: '#000' },
  botonPublicar: { 
    backgroundColor: COLORES.primario, 
    flexDirection: 'row',
    padding: 18, 
    borderRadius: 15, 
    marginTop: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: COLORES.primario,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  textoBoton: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 1 }
});