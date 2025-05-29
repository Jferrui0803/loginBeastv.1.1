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

// Permitir recarga desde el padre (HomeScreen)
const ClassesSection: React.FC<{ reloadTrigger?: number }> = ({ reloadTrigger }) => {
  const [clases, setClases] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          const hora = new Date(clase.startTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <Card key={clase.id} style={styles.classCard}>
              <Card.Cover source={require('../../assets/class-placeholder.jpg')} />
              <Card.Content>
                <Text variant="titleMedium" style={styles.text}>{clase.name}</Text>
                <Text variant="bodySmall" style={styles.text}>Próxima clase: {hora}</Text>
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
    height: 315,
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
