
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Alert,
    ActivityIndicator
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
    error: '#FF4444'
};

export default function EditarPerfil({ navigation }: any) {
    const [cargando, setCargando] = useState(false);
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');

    useEffect(() => {
        cargarDatosActuales();
    }, []);

    const cargarDatosActuales = async () => {
        setCargando(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCorreo(user.email || '');
                
                const { data, error } = await supabase
                    .from('Usuarios')
                    .select('nombre_completo')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                if (data) setNombre(data.nombre_completo);
            }
        } catch (error: any) {
            console.error("Error cargando datos:", error.message);
        } finally {
            setCargando(false);
        }
    };

    const manejarActualizacion = async () => {
        if (!nombre.trim()) return Alert.alert("Error", "El nombre no puede estar vacío");
        
        setCargando(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No se encontró el usuario");

            // 1. Actualizar Nombre en la tabla Usuarios
            const { error: errorTabla } = await supabase
                .from('Usuarios')
                .update({ nombre_completo: nombre.trim() })
                .eq('id', user.id);

            if (errorTabla) throw errorTabla;

            // 2. Actualizar Password si el usuario escribió algo
            if (nuevaPassword.length > 0) {
                if (nuevaPassword.length < 6) {
                    Alert.alert("Seguridad", "La contraseña debe tener al menos 6 caracteres");
                    setCargando(false);
                    return;
                }
                const { error: errorAuth } = await supabase.auth.updateUser({
                    password: nuevaPassword
                });
                if (errorAuth) throw errorAuth;
            }

            Alert.alert("¡Éxito!", "Perfil actualizado correctamente", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
            
        } catch (error: any) {
            Alert.alert("Error al actualizar", error.message);
        } finally {
            setCargando(false);
        }
    };

    if (cargando && !nombre) {
        return (
            <View style={[estilos.contenedorPrincipal, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={COLORES.primario} />
            </View>
        );
    }

    return (
        <SafeAreaView style={estilos.contenedorPrincipal}>
            <StatusBar barStyle="light-content" />
            
            {/* Header */}
            <View style={estilos.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.botonCerrar}>
                    <Ionicons name="close" size={28} color={COLORES.textoPrincipal} />
                </TouchableOpacity>
                <Text style={estilos.tituloHeader}>Editar Perfil</Text>
                <TouchableOpacity onPress={manejarActualizacion} disabled={cargando}>
                    {cargando ? (
                        <ActivityIndicator color={COLORES.primario} size="small" />
                    ) : (
                        <Text style={estilos.textoGuardar}>Guardar</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
                <View style={estilos.contenedorAvatar}>
                    <View style={estilos.avatarPlaceholder}>
                        <Ionicons name="person" size={50} color={COLORES.primario} />
                    </View>
                    <TouchableOpacity>
                        <Text style={estilos.cambiarFoto}>Cambiar foto de perfil</Text>
                    </TouchableOpacity>
                </View>

                {/* Formulario */}
                <View style={estilos.seccionFormulario}>
                    <Text style={estilos.label}>NOMBRE COMPLETO</Text>
                    <View style={estilos.inputWrapper}>
                        <MaterialCommunityIcons name="account-outline" size={20} color={COLORES.textoSecundario} />
                        <TextInput
                            style={estilos.input}
                            value={nombre}
                            onChangeText={setNombre}
                            placeholder="Tu nombre"
                            placeholderTextColor="#555"
                        />
                    </View>

                    <Text style={estilos.label}>CORREO ELECTRÓNICO (No editable)</Text>
                    <View style={[estilos.inputWrapper, { opacity: 0.5 }]}>
                        <MaterialCommunityIcons name="email-outline" size={20} color={COLORES.textoSecundario} />
                        <TextInput
                            style={estilos.input}
                            value={correo}
                            editable={false}
                        />
                    </View>

                    <View style={estilos.divisor} />

                    <Text style={estilos.label}>NUEVA CONTRASEÑA</Text>
                    <View style={estilos.inputWrapper}>
                        <MaterialCommunityIcons name="lock-outline" size={20} color={COLORES.textoSecundario} />
                        <TextInput
                            style={estilos.input}
                            value={nuevaPassword}
                            onChangeText={setNuevaPassword}
                            placeholder="Mínimo 6 caracteres"
                            placeholderTextColor="#555"
                            secureTextEntry
                        />
                    </View>
                    <Text style={estilos.infoAyuda}>Deja este campo vacío si no quieres cambiar tu contraseña.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    contenedorPrincipal: { flex: 1, backgroundColor: COLORES.fondo },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORES.borde
    },
    botonCerrar: { padding: 5 },
    tituloHeader: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    textoGuardar: { color: COLORES.primario, fontSize: 16, fontWeight: 'bold' },
    contenido: { padding: 25 },
    contenedorAvatar: { alignItems: 'center', marginBottom: 30 },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORES.tarjeta,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORES.borde
    },
    cambiarFoto: { color: COLORES.primario, fontWeight: '600' },
    seccionFormulario: { marginTop: 10 },
    label: { color: COLORES.textoSecundario, fontSize: 12, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORES.tarjeta,
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 55,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORES.borde
    },
    input: { flex: 1, color: '#FFF', marginLeft: 10, fontSize: 16 },
    divisor: { height: 1, backgroundColor: COLORES.borde, marginVertical: 20 },
    infoAyuda: { color: COLORES.textoSecundario, fontSize: 12, marginTop: -15, fontStyle: 'italic' }
});