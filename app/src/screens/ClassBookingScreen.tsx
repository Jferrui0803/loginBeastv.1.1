import React, { useEffect, useState, useLayoutEffect } from 'react'; // Agregué useLayoutEffect
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Text, Button, Surface, Avatar, IconButton } from 'react-native-paper';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ClassCard from "../components/ClassCard"

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
  ProgressScreen: undefined;
  Profile: undefined; 
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


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="account-circle"
          size={28}
          iconColor="#ffa500"
          onPress={() => navigation.navigate('Profile')}
          style={styles.headerButton}
        />
      ),
    });
  }, [navigation]);

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
          labelStyle={styles.retryButtonText}
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Reserva tu clase</Text>
            <Text style={styles.headerSubtitle}>Encuentra la clase perfecta para ti</Text>
          </View>
          <View style={styles.headerIcon}>
            <Icon name="calendar" size={32} color="#ffa500" />
          </View>
        </View>

        {/* Classes List */}
        <View style={styles.classesSection}>
          <Text style={styles.sectionTitle}>Clases disponibles</Text>
          
          {clases.map((clase) => (
            <Card key={clase.id} style={styles.classCard}>
              <Card.Content style={styles.classCardContent}>
                <View style={styles.classHeader}>
                  <View style={styles.classIconContainer}>
                    <Icon name="account-group" size={24} color="#ffa500" />
                  </View>
                  <View style={styles.classInfo}>
                    <Text style={styles.className}>{clase.name}</Text>
                    <Text style={styles.classInstructor}>Instructor: {clase.instructor}</Text>
                  </View>
                </View>

                <View style={styles.classDetails}>
                  <View style={styles.classDetailItem}>
                    <Icon name="clock-outline" size={18} color="#666" />
                    <Text style={styles.classDetailText}>{formatearFecha(clase.startTime)}</Text>
                  </View>
                  <View style={styles.classDetailItem}>
                    <Icon name="map-marker" size={18} color="#666" />
                    <Text style={styles.classDetailText}>{clase.gym.name}</Text>
                  </View>
                </View>
              </Card.Content>

              <Card.Actions style={styles.classCardActions}>
                <Button
                  mode="contained"
                  style={styles.reserveButton}
                  labelStyle={styles.reserveButtonText}
                  icon={() => <Icon name="calendar-check" size={16} color="#000000" />}
                  loading={reserving === clase.id}
                  disabled={reserving === clase.id}
                  onPress={() => reservarClase(clase.id)}
                >
                  {reserving === clase.id ? 'RESERVANDO...' : 'RESERVAR'}
                </Button>
              </Card.Actions>
            </Card>
          ))}

          {!clases.length && (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <View style={styles.emptyIconContainer}>
                  <Icon name="calendar-remove" size={48} color="#666666" />
                </View>
                <Text style={styles.emptyTitle}>No hay clases disponibles</Text>
                <Text style={styles.emptySubtitle}>Consulta más tarde o contacta con el gimnasio</Text>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc', 
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header Button - Para el ícono de perfil
  headerButton: {
    marginRight: 8,
  },

  // Header Section - Estilo como Hero Section de HomeScreen
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 0, 
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
  },
  headerIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 0, 
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Classes Section
  classesSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },

  // Class Cards - Estilo consistente con WorkoutDetailScreen
  classCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  classCardContent: {
    padding: 20,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  classIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 0, 
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  classInstructor: {
    fontSize: 14,
    color: '#666666',
  },
  classDetails: {
    gap: 8,
  },
  classDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classDetailText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  classCardActions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'flex-start',
  },
  reserveButton: {
    backgroundColor: '#ffa500',
    borderRadius: 0, 
    paddingVertical: 4,
    elevation: 0,
    minWidth: 120,
    alignSelf: 'flex-start',
  },
  reserveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#000000',
  },

  // Empty State
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 0, 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Loading and Error States
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5dc',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#ffa500',
    borderRadius: 0, 
    paddingVertical: 4,
    elevation: 0,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },

  // Bottom Bar 
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    backgroundColor: '#1A1A1A',
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  bottomBarButton: {
    margin: 0,
  },
});