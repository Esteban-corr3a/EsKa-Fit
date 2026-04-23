import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  Platform,
  ScrollView,
  StatusBar,
  Image, // <--- Faltaba agregar Image aquí
  KeyboardAvoidingView // <--- Faltaba agregar esto aquí
} from 'react-native';
import { supabase } from '../lib/supabase'; 

// Importa tu logo (Asegúrate de que la ruta sea correcta)
const logo = require('../../assets/Imagenes/Logo.png'); 

export default function Registro({ navigation }: any) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !nombre) {
      Alert.alert('EskaFit', 'Por favor, llena los campos obligatorios (*)');
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { nombre_completo: nombre } },
      });

      if (authError) throw authError;

      if (data?.user) {
        const { error: dbError } = await supabase
          .from('Usuarios')
          .insert([{ 
            id: data.user.id, 
            nombre_completo: nombre,
            email: email,
            nickname: nickname || null 
          }]);

        if (dbError) throw dbError;

        Alert.alert('¡Bienvenido!', 'Tu cuenta ha sido creada. Revisa tu correo para confirmar el registro.');
        navigation.navigate('Login');
      }
    } catch (error: any) {
      Alert.alert('EskaFit - Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* 1. Header con Logo */}
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.slogan}>ENTRENA • SUPERA • TRANSFORMA</Text>
          </View>

          {/* 2. Título */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>Crea tu cuenta</Text>
            <Text style={styles.subtitle}>Regístrate para empezar a transformar tu vida</Text>
          </View>

          {/* 3. Formulario */}
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Nombre Completo *"
                placeholderTextColor="#666"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Nickname (Opcional)"
                placeholderTextColor="#666"
                value={nickname}
                onChangeText={setNickname}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico *"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña *"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Text style={{color: '#666'}}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>Registrarme</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* 4. Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}> Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1 },
  scrollContainer: { padding: 30, paddingBottom: 50 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  logo: { width: 200, height: 200 },
  slogan: { fontSize: 10, color: '#666', marginTop: 10, letterSpacing: 2, fontWeight: '500' },
  welcomeContainer: { marginBottom: 25 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  form: { width: '100%' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    color: '#fff',
    fontSize: 16,
  },
  eyeIcon: { padding: 5 },
  button: {
    backgroundColor: '#C5FF2A', 
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonDisabled: { backgroundColor: '#4a6a12' },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30, marginBottom: 20 },
  footerText: { fontSize: 14, color: '#fff' },
  footerLink: { fontSize: 14, color: '#C5FF2A', fontWeight: 'bold' },
});