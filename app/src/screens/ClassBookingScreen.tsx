import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Text, Button, Surface, Avatar, IconButton } from 'react-native-paper';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Clase {
  id: string;
  name: string;
  startTime: string;
  instructor: string;
  gym: { id: string; name: string };
}

type RootStackParamList = {
  HomeScreen: undefined;
  ClassBooking: undefined;
  Routines: undefined;
};

interface JwtPayload {
  gymId: string;
}

export default function ClassBookingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [clases, setClases] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reserving, setReserving] = useState<string | null>(null);


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
        headers: { Authorization: `Bearer ${token}` },
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
  }, []);

  const reservarClase = async (claseId: string) => {
    try {
      setReserving(claseId);
      const token = await SecureStore.getItemAsync('userToken');
      await axios.post(
        `${API_URL}/api/classes/${claseId}/reserve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Reserva realizada con éxito');
    } catch (err: any) {
      alert(err?.response?.data?.msg || 'Error al reservar la clase');
    } finally {
      setReserving(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ffa500" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <Button onPress={fetchClases}>Reintentar</Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingVertical: 24, paddingBottom: 90 }}>
        <Text style={styles.headerTitle}>Reserva tu clase</Text>
        {clases.map((clase) => {
          const hora = new Date(clase.startTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          return (
            <Surface key={clase.id} style={styles.surface} elevation={4}>
              <Card style={styles.classCard}>
                <Card.Title
                  title={clase.name}
                  titleStyle={styles.className}
                  subtitle={`Instructor: ${clase.instructor}`}
                  subtitleStyle={styles.instructor}
                  left={() => (
                    <Avatar.Icon
                      size={48}
                      icon="dumbbell"
                      style={{ backgroundColor: '#b8860b' }}
                      color="#fff"
                    />
                  )}
                />
                <Card.Content>
                  <View style={styles.infoRow}>
                    <Icon name="clock-outline" size={22} color="#ffa500" />
                    <Text style={styles.infoText}>Hora: {hora}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Icon name="map-marker" size={22} color="#ffa500" />
                    <Text style={styles.infoText}>Gimnasio: {clase.gym.name}</Text>
                  </View>
                </Card.Content>
                <Card.Actions>
                  <Button
                    mode="contained"
                    style={styles.reserveButton}
                    loading={reserving === clase.id}
                    disabled={reserving === clase.id}
                    onPress={() => reservarClase(clase.id)}
                    icon={() => <Icon name="calendar-check" size={20} color="#fff" />}
                    textColor="#fff"
                  >
                    Reservar
                  </Button>
                </Card.Actions>
              </Card>
            </Surface>
          );
        })}
        {!clases.length && (
          <Text style={{ textAlign: 'center', marginTop: 32, color: '#b8860b', fontWeight: 'bold' }}>
            No hay clases disponibles.
          </Text>
        )}
      </ScrollView>

      {/* Barra de navegación inferior fija */}
      <View style={styles.bottomBar}>
        <IconButton
          icon="home"
          size={32}
          iconColor="white"
          onPress={() => navigation.navigate('HomeScreen')}
        />
        <IconButton
          icon="calendar"
          size={32}
          iconColor="white"
          onPress={() => navigation.navigate('ClassBooking')}
        />
        <IconButton
          icon="chart-line"
          size={32}
          iconColor="white"
          onPress={() => alert('Que no está implementado todavía, ansias')}
        />
        <IconButton
          icon="dumbbell"
          size={32}
          iconColor="white"
          onPress={() => navigation.navigate('Routines')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323',
    paddingHorizontal: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#232323',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffa500',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 1,
  },
  surface: {
    borderRadius: 18,
    marginHorizontal: 8,
    marginBottom: 24,
    backgroundColor: '#2d2d2d',
    elevation: 4,
  },
  classCard: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    overflow: 'hidden',
  },
  className: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffa500',
    letterSpacing: 0.5,
  },
  instructor: {
    color: '#fff',
    fontSize: 15,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  reserveButton: {
    backgroundColor: '#ffa500',
    marginTop: 12,
    borderRadius: 8,
    flex: 1,
    elevation: 2,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    backgroundColor: '#b8860b',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    zIndex: 100,
    elevation: 10,
  },
});