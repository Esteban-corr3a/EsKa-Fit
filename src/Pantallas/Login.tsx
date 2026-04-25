
import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, SafeAreaView, Image, ScrollView, ActivityIndicator, Alert, ImageBackground, Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

import { supabase } from '../lib/supabase';

const { width, height } = Dimensions.get('window');

const COLORES = {
  fondo: '#000000',
  tarjeta: 'rgba(26, 26, 26, 0.8)',
  primario: '#CCFF00',
  textoPrincipal: '#FFFFFF',
  textoSecundario: '#AAAAAA',
  borde: 'rgba(51, 51, 51, 0.5)',
};

export default function Login({ navigation }: any) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const manejarLogin = async () => {
    // Modo invitado (Remover si no es necesario)
    if (!correo && !contrasena) {
      navigation.replace('Main');
      return;
    }

    if (!correo || !contrasena) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setCargando(true);
    setError('');

    try {
      const { data, error: errorAuth } = await supabase.auth.signInWithPassword({
        email: correo.trim(),
        password: contrasena,
      });

      if (errorAuth) {
        setError('Correo o contraseña incorrectos.');
        setCargando(false);
        return;
      }

      if (data.session) {
        const userId = data.session.user.id;
        console.log("1. Autenticación exitosa. UID:", userId);

        // CONSULTA DETALLADA:
        const { data: usuarioBD, error: errorBD } = await supabase
          .from('Usuarios')
          .select('rol')
          .eq('id', userId)
          .maybeSingle(); // Usamos maybeSingle para evitar errores si no existe

        console.log("2. Resultado de tabla Usuarios:", usuarioBD);

        if (errorBD) {
          console.error("Error en consulta de base de datos:", errorBD.message);
        }

        // VALIDACIÓN DE ROL
        // Usamos .toLowerCase() y .trim() para evitar errores por espacios o mayúsculas
        const rolUsuario = usuarioBD?.rol?.toLowerCase().trim();

        if (rolUsuario === 'admin') {
          console.log("3. ¡Acceso ADMIN confirmado!");
          navigation.replace('Main'); // <--- Aquí deberías ir a tu pantalla de Admin
        } else {
          navigation.replace('Main');
        }
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      setError('Ocurrió un error inesperado.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop' }}
      style={estilos.imagenFondo}
    >
      <View style={estilos.overlay}>
        <SafeAreaView style={estilos.contenedorPrincipal}>
          <StatusBar barStyle="light-content" />

          <ScrollView
            contentContainerStyle={estilos.contenidoDesplazable}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={estilos.contenedorLogo}>
              <Image
                source={require('../../assets/Imagenes/Logo.png')}
                style={estilos.imagenLogo}
                resizeMode="contain"
              />
            </View>

            <View style={estilos.contenedorBienvenida}>
              <Text style={estilos.tituloBienvenida}>Bienvenido de vuelta</Text>
              <Text style={estilos.subtituloBienvenida}>Inicia sesión para continuar</Text>
            </View>

            <View style={estilos.contenedorFormulario}>
              <View style={estilos.envolturaInput}>
                <MaterialCommunityIcons name="email-outline" size={20} color={COLORES.textoSecundario} style={estilos.iconoInput} />
                <TextInput
                  style={estilos.entradaTexto}
                  placeholder="Correo electrónico"
                  placeholderTextColor={COLORES.textoSecundario}
                  value={correo}
                  onChangeText={setCorreo}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!cargando}
                />
              </View>

              <View style={estilos.envolturaInput}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORES.textoSecundario} style={estilos.iconoInput} />
                <TextInput
                  style={estilos.entradaTexto}
                  placeholder="Contraseña"
                  placeholderTextColor={COLORES.textoSecundario}
                  value={contrasena}
                  onChangeText={setContrasena}
                  secureTextEntry={!mostrarContrasena}
                  editable={!cargando}
                />
                <TouchableOpacity onPress={() => setMostrarContrasena(!mostrarContrasena)} style={estilos.iconoOjo}>
                  <Ionicons name={mostrarContrasena ? "eye-off-outline" : "eye-outline"} size={20} color={COLORES.textoSecundario} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={estilos.olvidoContrasena} disabled={cargando}>
                <Text style={estilos.textoOlvidoContrasena}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              {error ? <Text style={estilos.textoError}>{error}</Text> : null}

              <TouchableOpacity
                style={[estilos.botonLogin, cargando && { opacity: 0.7 }]}
                onPress={manejarLogin}
                disabled={cargando}
              >
                {cargando ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={estilos.textoBotonLogin}>Iniciar sesión</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={estilos.contenedorSeparador}>
              <View style={estilos.lineaSeparadora} />
              <Text style={estilos.textoSeparador}>o continúa con</Text>
              <View style={estilos.lineaSeparadora} />
            </View>

            <View style={estilos.contenedorSocial}>
              <TouchableOpacity
                style={estilos.botonSocial}
                onPress={() => Alert.alert("Próximamente", "Google disponible pronto.")}
              >
                <FontAwesome name="google" size={20} color={COLORES.textoPrincipal} style={estilos.iconoSocial} />
                <Text style={estilos.textoBotonSocial}>Continuar con Google</Text>
              </TouchableOpacity>
            </View>

            <View style={estilos.contenedorRegistro}>
              <Text style={estilos.textoRegistro}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Registro')} disabled={cargando}>
                <Text style={estilos.enlaceRegistro}>Regístrate</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
  imagenFondo: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)' },
  contenedorPrincipal: { flex: 1 },
  contenidoDesplazable: { flexGrow: 1, paddingHorizontal: 25, justifyContent: 'center', paddingBottom: 40 },
  contenedorLogo: { alignItems: 'center', marginBottom: 20, marginTop: -20 },
  imagenLogo: { width: width * 0.8, height: 180 },
  contenedorBienvenida: { marginBottom: 25, alignItems: 'flex-start' },
  tituloBienvenida: { fontSize: 28, fontWeight: 'bold', color: COLORES.textoPrincipal },
  subtituloBienvenida: { fontSize: 16, color: COLORES.textoSecundario, marginTop: 5 },
  contenedorFormulario: { width: '100%', marginBottom: 20 },
  envolturaInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(30, 30, 30, 0.9)', borderRadius: 12, borderWidth: 1, borderColor: COLORES.borde, paddingHorizontal: 15, marginBottom: 15, height: 55 },
  iconoInput: { marginRight: 10 },
  entradaTexto: { flex: 1, color: COLORES.textoPrincipal, fontSize: 16 },
  iconoOjo: { padding: 5 },
  olvidoContrasena: { alignSelf: 'flex-end', marginBottom: 20 },
  textoOlvidoContrasena: { color: COLORES.primario, fontSize: 14, fontWeight: '600' },
  textoError: { color: '#FF4444', textAlign: 'center', marginBottom: 15 },
  botonLogin: { backgroundColor: COLORES.primario, borderRadius: 12, height: 55, justifyContent: 'center', alignItems: 'center' },
  textoBotonLogin: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  contenedorSeparador: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  lineaSeparadora: { flex: 1, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  textoSeparador: { color: COLORES.textoSecundario, paddingHorizontal: 10, fontSize: 14 },
  contenedorSocial: { width: '100%', marginBottom: 25 },
  botonSocial: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)', height: 55 },
  iconoSocial: { marginRight: 12 },
  textoBotonSocial: { color: COLORES.textoPrincipal, fontSize: 16, fontWeight: '600' },
  contenedorRegistro: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  textoRegistro: { color: COLORES.textoSecundario, fontSize: 15 },
  enlaceRegistro: { color: COLORES.primario, fontSize: 15, fontWeight: 'bold' },
});