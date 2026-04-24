import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase'; // Asegúrate de que la ruta sea correcta

const COLORES = {
  fondo: '#000000',
  tarjeta: '#1A1A1A',
  primario: '#C5FF2A', // Verde lima EskaFit
  textoPrincipal: '#FFFFFF',
  textoSecundario: '#AAAAAA',
  borde: '#333333',
  error: '#FF4444',
};

export default function Perfil({ navigation }: any) {
  
  const manejarCerrarSesion = async () => {
    try {
      await supabase.auth.signOut();
      // Al cerrar sesión, reseteamos el stack para ir al Login
      navigation.replace('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const OpcionPerfil = ({ icono, titulo, colorTexto = COLORES.textoPrincipal, onPress, mostrarFlecha = true }: any) => (
    <TouchableOpacity style={estilos.tarjetaOpcion} onPress={onPress}>
      <View style={estilos.filaOpcion}>
        <View style={estilos.contenedorIcono}>
          <Ionicons name={icono} size={22} color={COLORES.primario} />
        </View>
        <Text style={[estilos.textoOpcion, { color: colorTexto }]}>{titulo}</Text>
      </View>
      {mostrarFlecha && <Ionicons name="chevron-forward" size={20} color={COLORES.borde} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={estilos.contenedorPrincipal}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView contentContainerStyle={estilos.contenido}>
        {/* Cabecera del Perfil */}
        <View style={estilos.contenedorCabecera}>
          <View style={estilos.envolturaAvatar}>
            <Image
              source={{ uri: 'https://media.timeout.com/images/105658155/750/562/image.jpg' }} // Aquí irá la foto del usuario
              style={estilos.avatar}
            />
            <TouchableOpacity style={estilos.botonEditarFoto}>
              <Ionicons name="camera" size={18} color={COLORES.fondo} />
            </TouchableOpacity>
          </View>
          <Text style={estilos.nombreUsuario}>Kate Florez</Text>
          <Text style={estilos.emailUsuario}>kat.florezz@gmail.com</Text>
        </View>

        {/* Estadísticas Rápidas */}
        <View style={estilos.contenedorStats}>
          <View style={estilos.statItem}>
            <Text style={estilos.statValor}>65 kg</Text>
            <Text style={estilos.statEtiqueta}>Peso</Text>
          </View>
          <View style={[estilos.statItem, estilos.bordeLateral]}>
            <Text style={estilos.statValor}>1.68 m</Text>
            <Text style={estilos.statEtiqueta}>Altura</Text>
          </View>
          <View style={estilos.statItem}>
            <Text style={estilos.statValor}>22</Text>
            <Text style={estilos.statEtiqueta}>Edad</Text>
          </View>
        </View>

        {/* Sección de Ajustes */}
        <View style={estilos.seccion}>
          <Text style={estilos.tituloSeccion}>Cuenta</Text>
          <OpcionPerfil 
            icono="person-outline" 
            titulo="Editar Perfil" 
            onPress={() => console.log('Ir a Editar Perfil')} 
          />
          <OpcionPerfil 
            icono="notifications-outline" 
            titulo="Notificaciones" 
            onPress={() => {}} 
          />
          <OpcionPerfil 
            icono="shield-checkmark-outline" 
            titulo="Privacidad" 
            onPress={() => {}} 
          />
        </View>

        <View style={estilos.seccion}>
          <Text style={estilos.tituloSeccion}>General</Text>
          <OpcionPerfil 
            icono="help-circle-outline" 
            titulo="Centro de Ayuda" 
            onPress={() => {}} 
          />
          <OpcionPerfil 
            icono="log-out-outline" 
            titulo="Cerrar Sesión" 
            colorTexto={COLORES.error}
            mostrarFlecha={false}
            onPress={manejarCerrarSesion}
          />
        </View>

        <Text style={estilos.versionApp}>EskaFit v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    paddingBottom: 30,
  },
  contenedorCabecera: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  envolturaAvatar: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: COLORES.primario,
  },
  botonEditarFoto: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORES.primario,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORES.fondo,
  },
  nombreUsuario: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORES.textoPrincipal,
  },
  emailUsuario: {
    fontSize: 14,
    color: COLORES.textoSecundario,
    marginTop: 4,
  },
  contenedorStats: {
    flexDirection: 'row',
    backgroundColor: COLORES.tarjeta,
    marginHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  bordeLateral: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORES.borde,
  },
  statValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORES.primario,
  },
  statEtiqueta: {
    fontSize: 12,
    color: COLORES.textoSecundario,
    marginTop: 2,
  },
  seccion: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  tituloSeccion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORES.textoSecundario,
    marginBottom: 10,
    marginLeft: 5,
  },
  tarjetaOpcion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORES.tarjeta,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  filaOpcion: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contenedorIcono: {
    width: 35,
    alignItems: 'center',
  },
  textoOpcion: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  versionApp: {
    textAlign: 'center',
    color: COLORES.borde,
    fontSize: 12,
    marginTop: 10,
  },
});