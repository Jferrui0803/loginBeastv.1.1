import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../context/AuthContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type  { MainStackParamList } from '../../navigation/AppNavigator';

type RootStackParamList = {
  EditProfile: { user: { id: string; name: string; email: string; phone: string } };
};

type Props = NativeStackScreenProps<MainStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ route, navigation }: Props) {
  const { user } = route.params;
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [phone, setPhone] = React.useState(user?.phone || '');
  const [loading, setLoading] = React.useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) throw new Error('Token no encontrado');
      await axios.put(
        `${API_URL}/api/users/${user.id}`,
        { name, email, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Perfil actualizado', 'Tus datos han sido guardados correctamente.');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.msg || err.message || 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Editar Perfil</Text>
      <TextInput label="Nombre" value={name} onChangeText={setName} style={styles.input} />
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput label="Teléfono" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
      <Button mode="contained" onPress={handleSave} style={styles.button} loading={loading} disabled={loading}>
        Guardar
      </Button>
      <Button onPress={() => navigation.goBack()} style={[styles.button, { backgroundColor: '#ccc', marginTop: 8 }]} textColor="black">
        Cancelar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f5f5dc' },
  input: { marginVertical: 8, backgroundColor: 'white' },
  button: { marginTop: 16, backgroundColor: '#ffa500' },
});