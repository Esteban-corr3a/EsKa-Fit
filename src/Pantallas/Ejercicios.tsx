import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, FlatList, TouchableOpacity, Dimensions, 
  SafeAreaView, StatusBar, Platform, Image, ActivityIndicator, Alert 
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CATEGORIAS = [
  { id: '1', nombre: 'Pecho', imagen: 'https://calisteniajhk.com/wp-content/uploads/2018/04/chest3portions.jpg?w=436' },
  { id: '2', nombre: 'Espalda', imagen: 'https://formatted-decks.s3.amazonaws.com/image/38a24ca3-bba2-4a82-a434-0d06d39d4dfe.jpg' },
  { id: '3', nombre: 'Piernas', imagen: 'https://www.infobae.com/resizer/v2/C5PPKGYKLFE3LLOCHJFOULYR4E.png?auth=e050dc064c90553489e3e6e56479adecbc76f071e3308cfbe66ede56c593c820&smart=true&width=350&height=180&quality=85' },
  { id: '4', nombre: 'Hombros', imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjDewovKyohtstQXLj2FTW19VioK9Gn7ammw&s' },
  { id: '5', nombre: 'Bíceps', imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS7Wd_agKAktnFFxHofOIIn50E2wygjHi3-g&s' },
  { id: '6', nombre: 'Tríceps', imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8GHbYEWuwGH_hG4aL8RzD_2ECWEnskOPyrQ&s' },
  { id: '7', nombre: 'Abdomen', imagen: 'https://i.pinimg.com/736x/a5/59/35/a559354d4a5f2a0b1d22df09ac90f54c.jpg' },
];

export default function Ejercicios({ navigation }: any) {
  const [categoriaActiva, setCategoriaActiva] = useState('Pecho');
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [ejercicioParaAñadir, setEjercicioParaAñadir] = useState<any | null>(null);

  const fetchEjercicios = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase.from('Ejercicios').select('*');
      if (error) throw error;
      setEjercicios(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { fetchEjercicios(); }, []);

  const confirmarAñadir = async () => {
    if (!ejercicioParaAñadir) return;
    try {
      const { error } = await supabase
        .from('progreso') 
        .insert([{ 
            ejercicio_id: ejercicioParaAñadir.id, 
            nombre: ejercicioParaAñadir.nombre,
            fecha: new Date().toISOString()
        }]);

      if (error) throw error;
      Alert.alert("¡Éxito!", `${ejercicioParaAñadir.nombre} añadido.`);
      setEjercicioParaAñadir(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar.");
    }
  };

  const renderFiltro = ({ item }: any) => {
    const esActivo = categoriaActiva === item.nombre;
    
    return (
      <TouchableOpacity 
        style={estilos.itemFiltro}
        onPress={() => setCategoriaActiva(item.nombre)}
      >
        <View style={[
          estilos.circuloIcono, 
          esActivo && { borderColor: '#C5FF2A', backgroundColor: '#1A1A1A' }
        ]}>
          {/* VALIDACIÓN: Si la imagen existe y no es el texto por defecto, la muestra */}
          {item.imagen && item.imagen !== 'TU_URL_AQUI' ? (
            <Image 
              source={{ uri: item.imagen }} 
              style={estilos.imagenIcono} 
              resizeMode="cover"
            />
          ) : (
            <Ionicons 
              name={esActivo ? "barbell" : "barbell-outline"} 
              size={24} 
              color={esActivo ? "#C5FF2A" : "#444"} 
            />
          )}
        </View>
        <Text style={[estilos.textoFiltro, esActivo && { color: '#C5FF2A' }]}>
          {item.nombre}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEjercicio = ({ item }: any) => {
    return (
      <TouchableOpacity 
        style={estilos.tarjetaEjercicio}
        // UN SOLO TOQUE: VA AL DETALLE
        onPress={() => navigation.navigate('DetalleEjercicio', { ejercicio: item })}
        // TOQUE MANTENIDO: ABRE EL PANEL
        onLongPress={() => setEjercicioParaAñadir(item)}
        delayLongPress={400} // Tiempo que hay que dejar apretado (400ms)
      >
        <View style={estilos.contenedorImagen}>
          {item.imagen_url ? (
            <Image source={{ uri: item.imagen_url }} style={estilos.imagenFondo} />
          ) : (
            <View style={estilos.placeholderImagen} />
          )}
        </View>
        <View style={estilos.infoEjercicio}>
          <Text style={estilos.nombreEjercicio} numberOfLines={1}>{item.nombre}</Text>
          <Text style={estilos.nivel}>{item.nivel}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={estilos.contenedorPrincipal}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={estilos.areaSegura}>
        
        <View style={estilos.headerFiltros}>
          <FlatList
            data={CATEGORIAS}
            renderItem={renderFiltro}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={estilos.listaFiltros}
          />
        </View>

        {cargando ? (
          <View style={estilos.centrado}>
            <ActivityIndicator size="large" color="#C5FF2A" />
          </View>
        ) : (
          <FlatList
            data={ejercicios.filter(ex => ex.grupo === categoriaActiva)}
            renderItem={renderEjercicio}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={estilos.listaEjercicios}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* PANEL FLOTANTE (SE ACTIVA CON LONG PRESS) */}
        {ejercicioParaAñadir && (
          <View style={estilos.panelFlotante}>
            <View style={estilos.contenidoPanel}>
              <View style={estilos.headerPanel}>
                <View>
                 
                  <Text style={estilos.subtituloPanel}>{ejercicioParaAñadir.nombre}</Text>
                </View>
                <TouchableOpacity onPress={() => setEjercicioParaAñadir(null)}>
                  <Ionicons name="close-circle" size={26} color="#444" />
                </TouchableOpacity>
              </View>
              
              <View style={estilos.filaBotones}>
                <TouchableOpacity 
                  style={estilos.botonAñadir} 
                  onPress={confirmarAñadir}
                >
                  <Text style={estilos.textoAñadir}>Añadir a mi entrenamiento</Text>
                  <Ionicons name="add" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

      </SafeAreaView>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedorPrincipal: { flex: 1, backgroundColor: '#000' },
  areaSegura: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10 },
  headerFiltros: { height: 130, backgroundColor: '#000' },
  listaFiltros: { paddingHorizontal: 20, alignItems: 'center' },
  itemFiltro: { alignItems: 'center', marginRight: 20, width: 70 },
circuloIcono: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#0D0D0D', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#333',
    overflow: 'hidden'
  },
  textoFiltro: { color: '#666', fontSize: 12, fontWeight: 'bold' },
  listaEjercicios: { padding: 10, paddingBottom: 180 }, 
  tarjetaEjercicio: { flex: 1, backgroundColor: '#141414', margin: 8, borderRadius: 18, height: 200, overflow: 'hidden' },
  contenedorImagen: { flex: 1.5, backgroundColor: '#1c1c1c' },
  imagenFondo: { width: '100%', height: '100%' },
  
  imagenIcono: {
    width: '100%',height: '100%',},
  placeholderImagen: { flex: 1, backgroundColor: '#222' },
  infoEjercicio: { flex: 1, padding: 12 },
  nombreEjercicio: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  nivel: { color: '#C5FF2A', fontSize: 11, marginTop: 4 },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  panelFlotante: {
    position: 'absolute',
    bottom: 150, // Ajustado para que flote sobre tu menú
    alignSelf: 'center',
    width: width * 0.9,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 25,
  },
  contenidoPanel: { gap: 15 },
  headerPanel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tituloPanel: { color: '#C5FF2A', fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold' },
  subtituloPanel: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  filaBotones: { flexDirection: 'row' },
  botonAñadir: { 
    flex: 1, 
    flexDirection: 'row', 
    padding: 15, 
    borderRadius: 12, 
    backgroundColor: '#C5FF2A', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 8
  },
  textoAñadir: { color: '#000', fontWeight: 'bold', fontSize: 14 }
});