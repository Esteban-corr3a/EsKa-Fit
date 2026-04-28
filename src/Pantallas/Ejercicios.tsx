import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import { supabase } from '../lib/supabase'; // Asegúrate de que la ruta sea correcta

const { width } = Dimensions.get('window');

const CATEGORIAS = [
  { id: '1', nombre: 'Pecho' },
  { id: '2', nombre: 'Espalda' },
  { id: '3', nombre: 'Piernas' },
  { id: '4', nombre: 'Hombros' },
  { id: '5', nombre: 'Bíceps' },
  { id: '6', nombre: 'Tríceps' },
  { id: '7', nombre: 'Abdomen' },
];

export default function Ejercicios() {
  const [categoriaActiva, setCategoriaActiva] = useState('Pecho');
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // 1. Cargar datos desde Supabase
  const fetchEjercicios = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from('Ejercicios') // Nombre exacto de tu tabla
        .select('*');

      if (error) throw error;
      setEjercicios(data || []);
    } catch (error) {
      console.error('Error al obtener ejercicios:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchEjercicios();
  }, []);

  const ejerciciosFiltrados = ejercicios.filter(ex => ex.grupo === categoriaActiva);

  const renderFiltro = ({ item }: any) => {
    const esActivo = categoriaActiva === item.nombre;
    return (
      <TouchableOpacity 
        style={[estilos.itemFiltro, esActivo && estilos.itemFiltroActivo]}
        onPress={() => setCategoriaActiva(item.nombre)}
      >
        <View style={[
          estilos.circuloIcono, 
          esActivo && { borderColor: '#C5FF2A', backgroundColor: '#1A1A1A', transform: [{ scale: 1.1 }] }
        ]}>
           {/* Aquí puedes poner iconos según el nombre de la categoría */}
        </View>
        <Text style={[estilos.textoFiltro, esActivo && { color: '#C5FF2A' }]}>
          {item.nombre}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEjercicio = ({ item }: any) => (
    <TouchableOpacity style={estilos.tarjetaEjercicio}>
      <View style={estilos.contenedorImagen}>
        {item.imagen_url ? (
          <Image 
            source={{ uri: item.imagen_url }} 
            style={estilos.imagenFondo} 
            resizeMode="cover"
          />
        ) : (
          <View style={estilos.placeholderImagen} />
        )}
      </View>
      <View style={estilos.infoEjercicio}>
        <Text style={estilos.nombreEjercicio}>{item.nombre}</Text>
        <Text style={estilos.nivel}>{item.nivel}</Text>
      </View>
    </TouchableOpacity>
  );

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
            <Text style={{ color: '#fff', marginTop: 10 }}>Cargando ejercicios...</Text>
          </View>
        ) : (
          <FlatList
            data={ejerciciosFiltrados}
            renderItem={renderEjercicio}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={estilos.listaEjercicios}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={estilos.textoVacio}>No hay ejercicios en esta categoría aún.</Text>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: '#000',
  },
  areaSegura: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
  },
  headerFiltros: {
    height: 140,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    justifyContent: 'center',
  },
  listaFiltros: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  itemFiltro: {
    alignItems: 'center',
    marginRight: 25,
    width: 80,
  },
  itemFiltroActivo: {
    borderColor: '#C5FF2A',
  },
  circuloIcono: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#0D0D0D',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  textoFiltro: {
    color: '#666',
    fontSize: 13,
    fontWeight: 'bold',
  },
  listaEjercicios: {
    padding: 10,
    paddingBottom: 100,
  },
  tarjetaEjercicio: {
    flex: 1,
    backgroundColor: '#141414',
    margin: 8,
    borderRadius: 18,
    height: 240,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222',
  },
  contenedorImagen: {
    flex: 2,
    backgroundColor: '#1c1c1c',
  },
  imagenFondo: {
    width: '100%',
    height: '100%',
  },
  placeholderImagen: {
    flex: 1,
    backgroundColor: '#222',
  },
  infoEjercicio: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  nombreEjercicio: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  nivel: {
    color: '#C5FF2A',
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoVacio: {
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  }
});