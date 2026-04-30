import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Alert, ActivityIndicator, Modal, TextInput, ScrollView 
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function ADMIN_Gestionperfiles() {
  const [listaUsuarios, setListaUsuarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para el Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [formNombre, setFormNombre] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState(''); // Estado para la contraseña
  const [formRol, setFormRol] = useState('user');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from('Usuarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } else {
      setListaUsuarios(data || []);
    }
    setCargando(false);
  };

  const abrirModal = (usuario?: any) => {
    if (usuario) {
      setEditandoId(usuario.id);
      setFormNombre(usuario.nombre_completo || '');
      setFormEmail(usuario.email || '');
      setFormRol(usuario.rol || 'user');
      setFormPassword(''); // No editamos password de otros por seguridad
    } else {
      setEditandoId(null);
      setFormNombre('');
      setFormEmail('');
      setFormPassword('');
      setFormRol('user');
    }
    setModalVisible(true);
  };

  const guardarUsuario = async () => {
    // Validación: si es nuevo, el password es obligatorio
    if (!formNombre || !formEmail || (!editandoId && !formPassword)) {
      return Alert.alert("Error", "Todos los campos son obligatorios");
    }

    setCargando(true);
    try {
      if (editandoId) {
        // --- MODO EDICIÓN ---
        const { error } = await supabase
          .from('Usuarios')
          .update({ 
            nombre_completo: formNombre, 
            rol: formRol 
          })
          .eq('id', editandoId);
        
        if (error) throw error;
      } else {
        // --- MODO CREACIÓN ---
        // 1. Crear usuario en Supabase Auth (Sistema de entrada)
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formEmail,
          password: formPassword,
          options: {
            data: { 
                nombre_completo: formNombre, 
                rol: formRol 
            }
          }
        });

        if (authError) throw authError;

        // 2. Insertar en tu tabla de Usuarios vinculando el ID
        if (authData.user) {
            const { error: tablaError } = await supabase
              .from('Usuarios')
              .insert([{ 
                id: authData.user.id,
                nombre_completo: formNombre, 
                email: formEmail, 
                rol: formRol 
              }]);
            
            if (tablaError) throw tablaError;
        }
      }
      
      setModalVisible(false);
      cargarUsuarios();
      Alert.alert("Éxito", editandoId ? "Perfil actualizado" : "Usuario creado correctamente");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setCargando(false);
    }
  };

  const borrarUsuario = async (id: string, nombre: string) => {
  Alert.alert(
    "Confirmar eliminación",
    `¿Seguro que quieres eliminar a ${nombre}? Esta acción borrará también sus credenciales de acceso.`,
    [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Eliminar", 
        style: "destructive", 
        onPress: async () => {
          setCargando(true); // Mostrar carga mientras procesa
          try {
            const { error } = await supabase
              .from('Usuarios')
              .delete()
              .eq('id', id);

            if (error) throw error;

            // Actualizar el estado local inmediatamente
            setListaUsuarios(prev => prev.filter(u => u.id !== id));
            Alert.alert("Éxito", "Usuario eliminado correctamente del sistema.");
          } catch (error: any) {
            Alert.alert("Error de eliminación", error.message || "No se pudo eliminar el registro");
          } finally {
            setCargando(false);
          }
        } 
      }
    ]
  );
};

  if (cargando && listaUsuarios.length === 0) {
    return <ActivityIndicator style={{flex: 1, backgroundColor: '#000'}} color="#C5FF2A" />;
  }

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.header}>
        <Text style={estilos.titulo}>Usuarios</Text>
        <TouchableOpacity style={estilos.botonNuevo} onPress={() => abrirModal()}>
          <Ionicons name="add-circle" size={24} color="#000" />
          <Text style={estilos.textoBotonNuevo}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={listaUsuarios}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={estilos.tarjeta}>
            <View style={{ flex: 1 }}>
              <Text style={estilos.nombre}>{item.nombre_completo || 'Sin nombre'}</Text>
              <Text style={estilos.email}>{item.email}</Text>
              <View style={[estilos.badge, { backgroundColor: item.rol === 'admin' ? '#C5FF2A' : '#333' }]}>
                <Text style={[estilos.rolText, { color: item.rol === 'admin' ? '#000' : '#fff' }]}>
                  {item.rol?.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={estilos.acciones}>
              <TouchableOpacity onPress={() => abrirModal(item)} style={estilos.iconoAccion}>
                <Ionicons name="pencil" size={20} color="#C5FF2A" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => borrarUsuario(item.id, item.nombre_completo)} style={estilos.iconoAccion}>
                <Ionicons name="trash-outline" size={20} color="#FF5757" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

     <Modal visible={modalVisible} transparent animationType="slide">
        <View style={estilos.modalOverlay}>
          <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
            <View style={estilos.modalContent}>
              <Text style={estilos.modalTitulo}>
                {editandoId ? 'Editar Usuario' : 'Nuevo Usuario'}
              </Text>
              
              <Text style={estilos.label}>NOMBRE COMPLETO</Text>
              <TextInput 
                style={estilos.input} 
                value={formNombre} 
                onChangeText={setFormNombre} 
                placeholder="Ej. Juan Perez"
                placeholderTextColor="#444"
              />

              <Text style={estilos.label}>CORREO ELECTRÓNICO</Text>
              <TextInput 
                style={[estilos.input, editandoId ? { opacity: 0.5 } : {}]} 
                value={formEmail} 
                onChangeText={setFormEmail}
                editable={!editandoId}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#444"
              />

              {/* CAMBIO CLAVE: Forzamos la visibilidad comparando estrictamente con null */}
              {editandoId === null && (
                <View key="campo-password">
                  <Text style={estilos.label}>CONTRASEÑA TEMPORAL</Text>
                  <TextInput 
                    style={estilos.input} 
                    value={formPassword} 
                    onChangeText={setFormPassword}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="#444"
                    secureTextEntry={true}
                    autoCapitalize="none"
                  />
                </View>
              )}

              <Text style={estilos.label}>ROL DEL SISTEMA</Text>
              <View style={estilos.contenedorRoles}>
                {['user', 'admin'].map((r) => (
                  <TouchableOpacity 
                    key={r} 
                    style={[estilos.botonRol, formRol === r && estilos.botonRolActivo]}
                    onPress={() => setFormRol(r)}
                  >
                    <Text style={[estilos.textoRol, formRol === r && { color: '#000' }]}>
                      {r.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={estilos.modalBotones}>
                <TouchableOpacity 
                  style={estilos.btnCancelar} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{color: '#fff'}}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={estilos.btnGuardar} 
                  onPress={guardarUsuario}
                  disabled={cargando}
                >
                  {cargando ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={{color: '#000', fontWeight: 'bold'}}>Guardar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  titulo: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  botonNuevo: { backgroundColor: '#C5FF2A', flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, alignItems: 'center' },
  textoBotonNuevo: { fontWeight: 'bold', marginLeft: 5 },
  tarjeta: { backgroundColor: '#111', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderColor: '#222', borderWidth: 1 },
  nombre: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  email: { color: '#888', fontSize: 14 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, marginTop: 8 },
  rolText: { fontSize: 10, fontWeight: 'bold' },
  acciones: { flexDirection: 'row' },
  iconoAccion: { marginLeft: 15, padding: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#121212', borderRadius: 20, padding: 25, borderWidth: 1, borderColor: '#333' },
  modalTitulo: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { color: '#8E8E93', fontSize: 11, fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: '#1C1C1E', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  contenedorRoles: { flexDirection: 'row', marginBottom: 25 },
  botonRol: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#333', marginRight: 5 },
  botonRolActivo: { backgroundColor: '#C5FF2A', borderColor: '#C5FF2A' },
  textoRol: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  modalBotones: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btnCancelar: { flex: 1, padding: 15, alignItems: 'center' },
  btnGuardar: { flex: 1, backgroundColor: '#C5FF2A', padding: 15, alignItems: 'center', borderRadius: 10 }
});