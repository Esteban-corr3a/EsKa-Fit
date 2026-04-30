import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function CamaraScreen({ navigation }: any) {
    const [permiso, pedirPermiso] = useCameraPermissions();
    const [capturando, setCapturando] = useState(false);
    const camaraRef = useRef<CameraView>(null);

    if (!permiso) {
        // Los permisos todavía se están cargando
        return <View style={estilos.contenedor} />;
    }

    if (!permiso.granted) {
        // Los permisos no han sido concedidos
        return (
            <View style={estilos.contenedor}>
                <Text style={estilos.textoPermiso}>Necesitamos acceso a tu cámara para escanear comida</Text>
                <TouchableOpacity style={estilos.botonPermiso} onPress={pedirPermiso}>
                    <Text style={estilos.textoBoton}>Conceder Permiso</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const tomarFoto = async () => {
        if (camaraRef.current && !capturando) {
            try {
                setCapturando(true);
                const foto = await camaraRef.current.takePictureAsync({
                    quality: 0.7,
                    base64: true,
                });
                
                console.log("Foto capturada:", foto?.uri);
                
                // Aquí es donde después implementarás la llamada a la IA
                // navigation.navigate('Analisis', { photoUri: foto.uri });
                
                setCapturando(false);
            } catch (error) {
                console.error("Error al tomar la foto:", error);
                setCapturando(false);
            }
        }
    };

    return (
        <SafeAreaView style={estilos.contenedor}>
            <CameraView 
                style={estilos.camara} 
                facing="back"
                ref={camaraRef}
            >
                <View style={estilos.capaInterfaz}>
                    {/* Botón de Cerrar */}
                    <TouchableOpacity 
                        style={estilos.botonCerrar} 
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="close" size={30} color="white" />
                    </TouchableOpacity>

                    {/* Guía Visual Central */}
                    <View style={estilos.guiaEscaneo} />

                    {/* Controles Inferiores */}
                    <View style={estilos.contenedorControles}>
                        <TouchableOpacity 
                            style={[estilos.botonCaptura, capturando && { opacity: 0.5 }]} 
                            onPress={tomarFoto}
                            disabled={capturando}
                        >
                            <View style={estilos.circuloInterno} />
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    camara: {
        flex: 1,
    },
    capaInterfaz: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        padding: 20,
    },
    botonCerrar: {
        alignSelf: 'flex-start',
        marginTop: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 5,
    },
    guiaEscaneo: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#C5FF2A',
        borderRadius: 30,
        alignSelf: 'center',
        borderStyle: 'dashed',
    },
    contenedorControles: {
        alignItems: 'center',
        marginBottom: 20,
    },
    botonCaptura: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    circuloInterno: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    textoPermiso: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 20,
        paddingHorizontal: 30,
    },
    botonPermiso: {
        backgroundColor: '#C5FF2A',
        padding: 15,
        borderRadius: 10,
        alignSelf: 'center',
    },
    textoBoton: {
        fontWeight: 'bold',
        color: 'black',
    },
});