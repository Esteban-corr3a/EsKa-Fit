import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    Dimensions,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

const COLORES = {
    fondo: '#000000',
    tarjeta: '#121212',
    primario: '#C5FF2A',
    textoPrincipal: '#FFFFFF',
    textoSecundario: '#8E8E93',
    borde: '#1C1C1E',
};

export default function HomeScreen() {
    const [nombreUsuario, setNombreUsuario] = useState('Cargando...');

    useEffect(() => {
        obtenerDatosUsuario();
    }, []);

    const obtenerDatosUsuario = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('Usuarios')
                    .select('nombre_completo')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setNombreUsuario(data.nombre_completo || 'Guerrero/a');
                } else {
                    setNombreUsuario('Guerrero/a');
                }
            }
        } catch (error) {
            console.error("Error inesperado:", error);
            setNombreUsuario("Guerrero/a");
        }
    };

    return (
        <SafeAreaView style={estilos.contenedorPrincipal}>
            <StatusBar barStyle="light-content" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilos.contenidoScroll}>

                {/* Saludo Inicial */}
                <View style={estilos.contenedorSaludo}>
                    <Text style={estilos.textoSaludo}>Hola, {nombreUsuario} 👋</Text>
                    <Text style={estilos.textoSubsaludo}>Vamos con todo hoy</Text>
                </View>

                {/* Tarjeta Principal */}
                <View style={estilos.tarjetaDestacadaContainer}>
                    <ImageBackground
                        source={{ uri: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=687&auto=format&fit=crop' }}
                        style={estilos.imagenFondoTarjeta}
                        imageStyle={{ borderRadius: 20 }}
                    >
                        <View style={estilos.overlayNegro}>
                            <Text style={estilos.textoRutinaDelDia}>RUTINA DEL DÍA</Text>
                            <Text style={estilos.tituloRutinaPrincipal}>Pierna Básica</Text>

                            <View style={estilos.detallesFila}>
                                <View style={estilos.badgeDetalle}>
                                    <Ionicons name="time-outline" size={14} color={COLORES.primario} />
                                    <Text style={estilos.textoBadge}>30 min</Text>
                                </View>
                                <View style={[estilos.badgeDetalle, { marginLeft: 10 }]}>
                                    <MaterialCommunityIcons name="speedometer" size={14} color={COLORES.primario} />
                                    <Text style={estilos.textoBadge}>Principiante</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={estilos.botonEmpezar}>
                                <Text style={estilos.textoBotonEmpezar}>Empezar rutina</Text>
                                <Ionicons name="chevron-forward" size={18} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>

                {/* Sección: Mis Rutinas */}
                <View style={estilos.seccionCabecera}>
                    <Text style={estilos.tituloSeccion}>Mis rutinas</Text>
                    <TouchableOpacity><Text style={estilos.textoVerTodas}>Ver todas</Text></TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={estilos.scrollRutinas}>
                    <TarjetaRutina
                        titulo="Upper Body"
                        nivel="Intermedio"
                        tiempo="45 min"
                        img="https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?w=500&auto=format"
                    />
                    <TarjetaRutina
                        titulo="Core Fuerte"
                        nivel="Principiante"
                        tiempo="20 min"
                        img="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format"
                    />
                </ScrollView>

                {/* Sección: Tu Progreso */}
                <Text style={[estilos.tituloSeccion, { marginTop: 25, marginBottom: 15 }]}>Tu progreso</Text>
                <View style={estilos.contenedorProgreso}>
                    <CardProgreso icon="flame" valor="5" desc="días" color="#FF8C00" />
                    <CardProgreso icon="arm-flex" valor="12" desc="completas" color={COLORES.primario} isMCI />
                    <CardProgreso icon="trophy" valor="350" desc="minutos" color="#FFD700" />
                </View>

                {/* Espacio final para que el menú flotante no tape el contenido */}
                <View style={{ height: 120 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// Sub-componentes
const TarjetaRutina = ({ titulo, nivel, tiempo, img }: any) => (
    <TouchableOpacity style={estilos.cardRutina}>
        <Image source={{ uri: img }} style={estilos.imgCard} />
        <View style={estilos.infoCard}>
            <Text style={estilos.tituloCard}>{titulo}</Text>
            <Text style={estilos.subtituloCard}>{nivel} • {tiempo}</Text>
        </View>
    </TouchableOpacity>
);

const CardProgreso = ({ icon, valor, desc, color, isMCI = false }: any) => (
    <View style={estilos.miniCardProgreso}>
        <View style={estilos.filaProgreso}>
            {isMCI ?
                <MaterialCommunityIcons name={icon} size={18} color={color} /> :
                <Ionicons name={icon} size={18} color={color} />
            }
            <Text style={estilos.valorProgresoText}>{valor}</Text>
        </View>
        <Text style={estilos.descProgresoText}>{desc}</Text>
    </View>
);

const estilos = StyleSheet.create({
    contenedorPrincipal: { flex: 1, backgroundColor: COLORES.fondo },
    contenidoScroll: { paddingHorizontal: 20, paddingTop: 10 },
    contenedorSaludo: { marginBottom: 15 },
    textoSaludo: { fontSize: 28, fontWeight: 'bold', color: COLORES.textoPrincipal },
    textoSubsaludo: { fontSize: 16, color: COLORES.textoSecundario, marginTop: 4 },
    tarjetaDestacadaContainer: { height: 230, borderRadius: 25, marginBottom: 25, overflow: 'hidden' },
    imagenFondoTarjeta: { flex: 1, justifyContent: 'flex-end' },
    overlayNegro: {
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flex: 1,
        justifyContent: 'center'
    },
    textoRutinaDelDia: { color: COLORES.primario, fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
    tituloRutinaPrincipal: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginVertical: 8 },
    detallesFila: { flexDirection: 'row', marginBottom: 20 },
    badgeDetalle: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20
    },
    textoBadge: { color: '#FFF', fontSize: 12, marginLeft: 5 },
    botonEmpezar: {
        backgroundColor: COLORES.primario,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignSelf: 'flex-start'
    },
    textoBotonEmpezar: { fontWeight: 'bold', marginRight: 10, color: '#000' },
    seccionCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    tituloSeccion: { fontSize: 20, fontWeight: 'bold', color: COLORES.textoPrincipal },
    textoVerTodas: { color: COLORES.primario, fontWeight: '600' },
    scrollRutinas: { marginLeft: -5 },
    cardRutina: {
        width: 165, height: 230, backgroundColor: COLORES.tarjeta,
        borderRadius: 20, marginRight: 15, overflow: 'hidden',
        borderWidth: 1, borderColor: COLORES.borde
    },
    imgCard: { width: '100%', height: '70%' },
    infoCard: { padding: 12 },
    tituloCard: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
    subtituloCard: { color: COLORES.textoSecundario, fontSize: 12, marginTop: 4 },
    contenedorProgreso: { flexDirection: 'row', justifyContent: 'space-between' },
    miniCardProgreso: {
        width: (width - 60) / 3, backgroundColor: COLORES.tarjeta,
        padding: 15, borderRadius: 20, alignItems: 'center',
        borderWidth: 1, borderColor: COLORES.borde
    },
    filaProgreso: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    valorProgresoText: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginLeft: 6 },
    descProgresoText: { color: COLORES.textoSecundario, fontSize: 11, textAlign: 'center' },
});