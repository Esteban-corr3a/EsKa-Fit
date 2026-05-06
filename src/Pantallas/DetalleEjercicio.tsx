import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    SafeAreaView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DetalleEjercicio({ route, navigation }: any) {
    const { ejercicio } = route.params;

    return (
        <View style={estilos.contenedorPrincipal}>
            <StatusBar barStyle="light-content" />
            
            {/* Header con Imagen */}
            <View style={estilos.contenedorImagen}>
                {ejercicio.imagen_url ? (
                    <Image 
                        source={{ uri: ejercicio.imagen_url }} 
                        style={estilos.imagenEjercicio} 
                        resizeMode="cover"
                    />
                ) : (
                    <View style={estilos.placeholderImagen}>
                        <MaterialCommunityIcons name="weight-lifter" size={80} color="#333" />
                    </View>
                )}
                
                <TouchableOpacity 
                    style={estilos.botonVolver} 
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>

                <View style={estilos.overlayDegradado} />
            </View>

            {/* Contenido */}
            <ScrollView 
                style={estilos.scrollContenido}
                showsVerticalScrollIndicator={false}
            >
                <View style={estilos.cuerpo}>
                    {/* Título y Nivel debajo */}
                    <View style={estilos.seccionTitulo}>
                        <Text style={estilos.nombre}>{ejercicio.nombre}</Text>
                        <Text style={estilos.grupo}>{ejercicio.grupo}</Text>
                        
                        <View style={estilos.badgeNivel}>
                            <Text style={estilos.textoNivel}>{ejercicio.nivel}</Text>
                        </View>
                    </View>

                    <View style={estilos.divisor} />

                    {/* Apartado Único de Repeticiones */}
                    <Text style={estilos.subtitulo}>Objetivo de entrenamiento</Text>
                    <View style={estilos.cardUnica}>
                        <MaterialCommunityIcons name="arm-flex" size={32} color="#C5FF2A" />
                        <View style={estilos.contenedorTextoCard}>
                            <Text style={estilos.valorRepeticiones}>
                                {ejercicio.repeticiones || 'Consultar instructor'}
                            </Text>
                            <Text style={estilos.labelCard}>Repeticiones y Series</Text>
                        </View>
                    </View>

                    {/* Descripción */}
                    <Text style={estilos.subtitulo}>Instrucciones</Text>
                    <Text style={estilos.descripcion}>
                        {ejercicio.descripcion || 'Sin descripción disponible.'}
                    </Text>

                    {/* Músculos Secundarios */}
                    {ejercicio.musculos_secundarios && (
                        <View style={{ marginTop: 20 }}>
                            <Text style={estilos.subtitulo}>Enfoque secundario</Text>
                            <View style={estilos.tagMusculo}>
                                <Text style={estilos.textoTag}>{ejercicio.musculos_secundarios}</Text>
                            </View>
                        </View>
                    )}

                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            <SafeAreaView style={estilos.footer}>
                <TouchableOpacity style={estilos.botonPrimario}>
                    <Text style={estilos.textoBotonPrimario}>Añadir a mi entrenamiento</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const estilos = StyleSheet.create({
    contenedorPrincipal: { flex: 1, backgroundColor: '#000' },
    contenedorImagen: { width: '100%', height: width * 0.85, position: 'relative' },
    imagenEjercicio: { width: '100%', height: '100%' },
    placeholderImagen: { width: '100%', height: '100%', backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
    overlayDegradado: { position: 'absolute', bottom: 0, width: '100%', height: 100, backgroundColor: 'rgba(0,0,0,0.9)' },
    botonVolver: { position: 'absolute', top: 50, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
    scrollContenido: { flex: 1, marginTop: -40, backgroundColor: '#000', borderTopLeftRadius: 35, borderTopRightRadius: 35 },
    cuerpo: { padding: 25 },
    seccionTitulo: { alignItems: 'flex-start' },
    nombre: { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
    grupo: { color: '#8E8E93', fontSize: 16, marginTop: 4, textTransform: 'uppercase' },
    badgeNivel: { backgroundColor: '#121212', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginTop: 12, borderWidth: 1, borderColor: '#C5FF2A' },
    textoNivel: { color: '#C5FF2A', fontWeight: '900', fontSize: 12, textTransform: 'uppercase' },
    divisor: { height: 1, backgroundColor: '#1C1C1E', marginVertical: 30 },
    subtitulo: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    
    // Estilo para la tarjeta única
    cardUnica: { 
        backgroundColor: '#121212', 
        flexDirection: 'row', 
        padding: 20, 
        borderRadius: 22, 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#1C1C1E',
        marginBottom: 20
    },
    contenedorTextoCard: { marginLeft: 20 },
    valorRepeticiones: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
    labelCard: { color: '#8E8E93', fontSize: 13, marginTop: 2 },

    descripcion: { color: '#A2A2A7', fontSize: 16, lineHeight: 26 },
    tagMusculo: { backgroundColor: '#1C1C1E', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, alignSelf: 'flex-start' },
    textoTag: { color: '#C5FF2A', fontSize: 14 },
    footer: { padding: 20, backgroundColor: '#000' },
    botonPrimario: { backgroundColor: '#C5FF2A', paddingVertical: 18, borderRadius: 22, alignItems: 'center' },
    textoBotonPrimario: { color: '#000', fontSize: 17, fontWeight: 'bold' }
});