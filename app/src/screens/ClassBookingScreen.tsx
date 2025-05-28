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
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={styles.loadingText}>Cargando clases...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={fetchClases}
          style={styles.retryButton}
          textColor="#ffffff"
        >
          Reintentar
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={{ paddingVertical: 24, paddingBottom: 90 }}
      >
        <Text style={styles.headerTitle}>RESERVA TU CLASE</Text>
        
        {clases.map((clase) => {
          const hora = new Date(clase.startTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          return (
            <View key={clase.id} style={styles.classCardContainer}>
              <View style={styles.classCard}>
                <View style={styles.cardHeader}>
                  <Avatar.Icon
                    size={56}
                    icon="dumbbell"
                    style={styles.avatar}
                    color="#ffffff"
                  />
                  <View style={styles.titleContainer}>
                    <Text style={styles.className}>{clase.name.toUpperCase()}</Text>
                    <Text style={styles.instructor}>Instructor: {clase.instructor}</Text>
                  </View>
                </View>
                
                <View style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <Icon name="clock-outline" size={24} color="#ff6b35" />
                    <Text style={styles.infoText}>Hora: {hora}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Icon name="map-marker" size={24} color="#ff6b35" />
                    <Text style={styles.infoText}>Gimnasio: {clase.gym.name}</Text>
                  </View>
                </View>
                
                <View style={styles.cardActions}>
                  <Button
                    mode="contained"
                    style={styles.reserveButton}
                    loading={reserving === clase.id}
                    disabled={reserving === clase.id}
                    onPress={() => reservarClase(clase.id)}
                    textColor="#ffffff"
                    icon={() => <Icon name="calendar-check" size={20} color="#ffffff" />}
                  >
                    {reserving === clase.id ? 'RESERVANDO...' : 'RESERVAR AHORA'}
                  </Button>
                </View>
              </View>
            </View>
          );
        })}
        
        {!clases.length && (
          <View style={styles.emptyContainer}>
            <Icon name="calendar-remove" size={64} color="#cccccc" />
            <Text style={styles.emptyText}>NO HAY CLASES DISPONIBLES</Text>
            <Text style={styles.emptySubtext}>Consulta más tarde o contacta con el gimnasio</Text>
          </View>
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
    backgroundColor: '#f8f9fa', // Fondo claro profesional
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2c3e50',
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 2,
  },
  classCardContainer: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
  },
  classCard: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#ff6b35',
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  className: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2c3e50',
    letterSpacing: 1,
    marginBottom: 4,
  },
  instructor: {
    color: '#666666',
    fontSize: 15,
    fontWeight: '500',
  },
  cardContent: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  infoText: {
    color: '#2c3e50',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
  },
  reserveButton: {
    backgroundColor: '#ff6b35',
    paddingVertical: 8,
    borderRadius: 0,
    elevation: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 64,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#666666',
    marginTop: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    backgroundColor: '#b8860b',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 3,
    borderColor: '#ff6b35',
    elevation: 10,
  },
});