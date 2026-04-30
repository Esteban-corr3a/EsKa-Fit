import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Alert, ActivityIndicator, Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';

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
    const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

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
                    .select('nombre_completo, foto_url')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                if (data) {
                    setNombre(data.nombre_completo);
                    setFotoPerfil(data.foto_url);
                }
            }
        } catch (error: any) {
            console.error("Error cargando datos:", error.message);
        } finally {
            setCargando(false);
        }
    };

    const seleccionarImagen = async () => {
        const resultado = await ImagePicker.launchImageLibraryAsync({
            // Cambia MediaTypeOptions.Images por ['images'] o ImagePicker.MediaType.IMAGES
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!resultado.canceled && resultado.assets[0].base64) {
            subirImagen(resultado.assets[0].base64);
        }
    };

   const subirImagen = async (base64: string) => {
    setCargando(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Ruta con la nueva carpeta
        const filePath = `Fotos_Perfil/${user.id}.png`; 

        // 2. Subida con upsert: true
        const { error: uploadError } = await supabase.storage
            .from('Perfiles')
            .upload(filePath, decode(base64), {
                contentType: 'image/png',
                upsert: true 
            });

        if (uploadError) throw uploadError;

        // 3. Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
            .from('Perfiles')
            .getPublicUrl(filePath);

        // 4. CREAR URL CON CACHE BUSTER (Esto es lo más importante)
        const urlConCache = `${publicUrl}?t=${new Date().getTime()}`;

        // 5. Actualizar la tabla Usuarios
        const { error: dbError } = await supabase
            .from('Usuarios')
            .update({ foto_url: urlConCache }) // Guardamos la URL con el ?t=...
            .eq('id', user.id);

        if (dbError) throw dbError;

        // 6. Actualizar el estado local
        setFotoPerfil(urlConCache);
        
        Alert.alert("Éxito", "Foto actualizada");

    } catch (error: any) {
        console.error("Error:", error);
        Alert.alert("Error", error.message);
    } finally {
        setCargando(false);
    }
};

    const manejarActualizacion = async () => {
        if (!nombre.trim()) {
            Alert.alert("Error", "El nombre no puede estar vacío");
            return;
        }

        setCargando(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No se encontró el usuario");

            // Actualizar nombre en tabla Usuarios
            const { error: dbError } = await supabase
                .from('Usuarios')
                .update({ nombre_completo: nombre })
                .eq('id', user.id);

            if (dbError) throw dbError;

            // Actualizar contraseña si se escribió algo
            if (nuevaPassword.length > 0) {
                if (nuevaPassword.length < 6) {
                    Alert.alert("Aviso", "La contraseña es muy corta (mínimo 6). No se actualizó.");
                } else {
                    const { error: authError } = await supabase.auth.updateUser({
                        password: nuevaPassword
                    });
                    if (authError) throw authError;
                }
            }

            Alert.alert("Éxito", "Perfil actualizado correctamente", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);

        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <SafeAreaView style={estilos.contenedorPrincipal}>
            <StatusBar barStyle="light-content" />

            {/* HEADER */}
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
                {/* SECCIÓN AVATAR */}
                <View style={estilos.contenedorAvatar}>
                    <TouchableOpacity onPress={seleccionarImagen} style={estilos.avatarWrapper}>
                        {fotoPerfil ? (
                            <Image source={{ uri: fotoPerfil }} style={estilos.fotoPerfil} />
                        ) : (
                            <View style={estilos.avatarPlaceholder}>
                                <Ionicons name="person" size={50} color={COLORES.primario} />
                            </View>
                        )}
                        <View style={estilos.botonEditFoto}>
                            <Ionicons name="camera" size={18} color="#000" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={seleccionarImagen}>
                        <Text style={estilos.cambiarFoto}>Cambiar foto de perfil</Text>
                    </TouchableOpacity>
                </View>

                {/* FORMULARIO */}
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

                    <Text style={estilos.label}>CORREO ELECTRÓNICO</Text>
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
    avatarWrapper: { position: 'relative' },
    fotoPerfil: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: COLORES.primario },
    avatarPlaceholder: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: COLORES.tarjeta,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORES.borde
    },
    botonEditFoto: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: COLORES.primario,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORES.fondo
    },
    cambiarFoto: { color: COLORES.primario, fontWeight: '600', marginTop: 15 },
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