import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Clase {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  maxUsers: number;
  gym: {
    id: string;
    name: string;
    address: string;
  };
}

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  gymId?: string;
  exp: number;
}

const ClassesSection: React.FC<{ reloadTrigger?: number }> = ({ reloadTrigger }) => {
  const [clases, setClases] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatearFecha = (isoDate: string) => {
    const fecha = new Date(isoDate);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
  };

  const fetchClases = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) throw new Error('Token no encontrado.');
      const decoded = jwtDecode<JwtPayload>(token);
      const gymId = decoded.gymId;
      if (!gymId) throw new Error('gymId no presente en el token.');
      const { data } = await axios.get<Clase[]>(`${API_URL}/api/classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const clasesDelGimnasio = data.filter((clase) => clase.gym.id === gymId);
      setClases(clasesDelGimnasio);
    } catch (err: any) {
      setError(err.message ?? 'Error al cargar clases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClases();
  }, [reloadTrigger]);

  // Función para mapear el nombre de la clase a un icono relevante
  const getClassIcon = (className: string) => {
    const lower = className.toLowerCase();
    if (lower.includes('yoga')) return 'yoga';
    if (lower.includes('spinning') || lower.includes('ciclismo')) return 'bike';
    if (lower.includes('pilates')) return 'human-handsup';
    if (lower.includes('zumba') || lower.includes('baile')) return 'music-note';
    if (lower.includes('fuerza') || lower.includes('pesas') || lower.includes('musculación')) return 'dumbbell';
    if (lower.includes('cardio')) return 'heart-pulse';
    if (lower.includes('boxeo')) return 'boxing-glove';
    if (lower.includes('crossfit')) return 'weight-lifter';
    if (lower.includes('estiramiento')) return 'run-fast';
    // Default
    return 'account-group';
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Clases disponibles</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {clases.map((clase) => {
          return (
            <Card key={clase.id} style={styles.classCard}>
              <View style={{ alignItems: 'center', marginTop: 15 }}>
                <MaterialCommunityIcons
                  name={getClassIcon(clase.name)}
                  size={64}
                  color="#ffa500"
                />
              </View>
              <Card.Content>
                <Text variant="titleMedium" style={styles.text}>{clase.name}</Text>
                <Text variant="bodySmall" style={styles.text}>
                  {formatearFecha(clase.startTime)}
                </Text>
                <Text variant="bodySmall" style={styles.text}>Gimnasio: {clase.gym.name}</Text>
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ClassesSection;

const styles = StyleSheet.create({
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: 'black',
  },
  classCard: {
    width: 200,
    height: 200, // Reducido para que la tarjeta no sea tan alta
    marginRight: 12,
    justifyContent: 'flex-start',
  },
  text: {
    color: 'black',
  },
  loader: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
