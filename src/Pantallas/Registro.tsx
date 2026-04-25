import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, 
  Alert, Platform, ScrollView, StatusBar, Image, KeyboardAvoidingView 
} from 'react-native';
import { supabase } from '../lib/supabase'; 

const logo_app = require('../../assets/Imagenes/Logo.png'); 

export default function Registro({ navigation }: any) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [apodo, setApodo] = useState(''); 
  const [cargando, setCargando] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const manejarRegistro = async () => {
    // Validación de campos locales
    if (!correo || !contrasena || !nombre) {
      Alert.alert('EskaFit', 'Por favor, llena los campos obligatorios (*)');
      return;
    }

    setCargando(true);
    console.log("--- INICIANDO REGISTRO ---");

    try {
      // 1. Crear usuario en la Autenticación de Supabase (auth.users)
      const { data, error: errorAuth } = await supabase.auth.signUp({
        email: correo.trim(),
        password: contrasena,
      });

      if (errorAuth) {
        console.error("Error en Auth:", errorAuth.message);
        throw errorAuth;
      }

      if (data?.user) {
        console.log("Auth exitoso. ID de usuario:", data.user.id);

        // 2. Insertar o Actualizar en la tabla 'public.Usuarios'
        // Usamos .upsert() para evitar el error "duplicate key value"
        const { error: errorDB } = await supabase
          .from('Usuarios')
          .upsert(
            { 
              id: data.user.id, 
              nombre_completo: nombre, 
              email: correo.trim().toLowerCase(),
              nickname: apodo || null,
              rol: 'user' 
            }, 
            { onConflict: 'id' } // Si el ID ya existe, actualiza la fila en lugar de fallar
          );

        if (errorDB) {
          console.error("Error en Base de Datos (Upsert):", errorDB.message);
          throw errorDB;
        }

        console.log("¡Flujo de registro completado con éxito!");
        Alert.alert('¡Bienvenido!', 'Tu cuenta ha sido creada correctamente.');
        navigation.navigate('Login');
      }
    } catch (error: any) {
      console.error("Error capturado en el flujo:", error.message);
      
      // Personalizamos el mensaje si detectamos que el correo ya existe
      if (error.message.includes('Usuarios_email_key')) {
        Alert.alert('EskaFit', 'Este correo ya está registrado en la base de datos.');
      } else {
        Alert.alert('EskaFit - Error', error.message);
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={estilos.contenedorPrincipal}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={estilos.flex1}
      >
        <ScrollView contentContainerStyle={estilos.contenidoScroll}>
          <View style={estilos.encabezado}>
            <Image source={logo_app} style={estilos.logo} resizeMode="contain" />
            <Text style={estilos.eslogan}>ENTRENA • SUPERA • TRANSFORMA</Text>
          </View>

          <View style={estilos.contenedorBienvenida}>
            <Text style={estilos.titulo}>Crea tu cuenta</Text>
            <Text style={estilos.subtitulo}>Regístrate para empezar a transformar tu vida</Text>
          </View>

          <View style={estilos.formulario}>
            <View style={estilos.envolturaInput}>
              <TextInput
                style={estilos.entradaTexto}
                placeholder="Nombre Completo *"
                placeholderTextColor="#666"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={estilos.envolturaInput}>
              <TextInput
                style={estilos.entradaTexto}
                placeholder="Nickname (Opcional)"
                placeholderTextColor="#666"
                value={apodo}
                onChangeText={setApodo}
                autoCapitalize="none"
              />
            </View>

            <View style={estilos.envolturaInput}>
              <TextInput
                style={estilos.entradaTexto}
                placeholder="Correo electrónico *"
                placeholderTextColor="#666"
                value={correo}
                onChangeText={setCorreo}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={estilos.envolturaInput}>
              <TextInput
                style={estilos.entradaTexto}
                placeholder="Contraseña *"
                placeholderTextColor="#666"
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry={!mostrarContrasena}
              />
              <TouchableOpacity onPress={() => setMostrarContrasena(!mostrarContrasena)} style={estilos.iconoOjo}>
                <Text style={{color: '#666'}}>{mostrarContrasena ? 'Ocultar' : 'Ver'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[estilos.boton, cargando && estilos.botonDeshabilitado]} 
              onPress={manejarRegistro}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={estilos.textoBoton}>Registrarme</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={estilos.piePagina}>
            <Text style={estilos.textoPie}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={estilos.enlacePie}> Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
// ... (Tus estilos se mantienen iguales)

  const estilos = StyleSheet.create({
    contenedorPrincipal: { 
      flex: 1, 
      backgroundColor: '#000' 
    },
    flex1: { 
      flex: 1 
    },
    contenidoScroll: { 
      padding: 30, 
      paddingBottom: 50 
    },
    encabezado: { 
      alignItems: 'center', 
      marginTop: 40, 
      marginBottom: 30 
    },
    logo: { 
      width: 200, 
      height: 200 
    },
    eslogan: { 
      fontSize: 10, 
      color: '#666', 
      marginTop: 10, 
      letterSpacing: 2, 
      fontWeight: '500' 
    },
    contenedorBienvenida: { 
      marginBottom: 25 
    },
    titulo: { 
      fontSize: 28, 
      fontWeight: 'bold', 
      color: '#fff' 
    },
    subtitulo: { 
      fontSize: 14, 
      color: '#666', 
      marginTop: 5 
    },
    formulario: { 
      width: '100%' 
    },
    envolturaInput: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1a1a1a',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#333',
      marginBottom: 15,
      paddingHorizontal: 15,
    },
    entradaTexto: {
      flex: 1,
      paddingVertical: 18,
      color: '#fff',
      fontSize: 16,
    },
    iconoOjo: { 
      padding: 5 
    },
    boton: {
      backgroundColor: '#C5FF2A', 
      padding: 18,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 25,
    },
    botonDeshabilitado: { 
      backgroundColor: '#4a6a12' 
    },
    textoBoton: { 
      color: '#000', 
      fontSize: 18, 
      fontWeight: 'bold' 
    },
    piePagina: { 
      flexDirection: 'row', 
      justifyContent: 'center', 
      marginTop: 30, 
      marginBottom: 20 
    },
    textoPie: { 
      fontSize: 14, 
      color: '#fff' 
    },
    enlacePie: { 
      fontSize: 14, 
      color: '#C5FF2A', 
      fontWeight: 'bold' 
    },
  });