import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card, Avatar, Divider, Text, Button } from 'react-native-paper';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL, useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  gymId: string | null;
}

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  gymId?: string;
  exp: number;
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { onLogout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await onLogout!();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) throw new Error('Token no encontrado.');

        const decoded = jwtDecode<JwtPayload>(token);

        const { data } = await axios.get<User>(`${API_URL}/api/users/${decoded.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(data);
      } catch (err: any) {
        setError(err.message ?? 'Error al cargar el usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Avatar.Icon size={120} icon="account" style={styles.avatar} />
        <TouchableOpacity style={styles.changePhotoBtn}>
          <Icon name="camera" size={20} color="#ffa500" />
          <Text style={styles.changePhotoText}>Cambiar foto</Text>
        </TouchableOpacity>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <Card style={styles.card}>
        <Card.Title title="Información Personal" titleStyle={styles.cardTitle} />
        <Card.Content>
          <View style={styles.infoRow}>
            <Icon name="phone" size={20} color="#ffa500" />
            <Text style={styles.infoText}>+34 XXX XXX XXX</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.infoRow}>
            <Icon name="calendar" size={20} color="#ffa500" />
            <Text style={styles.infoText}>Fecha de nacimiento: DD/MM/AAAA</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.infoRow}>
            <Icon name="map-marker" size={20} color="#ffa500" />
            <Text style={styles.infoText}>Ciudad, País</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Estadísticas" titleStyle={styles.cardTitle} />
        <Card.Content style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Icon name="dumbbell" size={28} color="#ffa500" />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Entrenamientos</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="fire" size={28} color="#ffa500" />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Calorías</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="clock-outline" size={28} color="#ffa500" />
            <Text style={styles.statNumber}>0h</Text>
            <Text style={styles.statLabel}>Tiempo total</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content style={styles.actionsContainer}>
          <Button
            mode="contained-tonal"
            icon="account-edit"
            onPress={() => console.log('Editar perfil')}
            buttonColor="#ffa500"
            textColor="black"
            style={styles.actionButton}
          >
          Editar Perfil 
          </Button>
          <Button
            mode="contained-tonal"
            icon="lock-reset"
            onPress={() => console.log('Cambiar contraseña')}
            buttonColor="#ffa500"
            textColor="black"
            style={styles.actionButton}
          >
            Cambiar Contraseña
          </Button>
          <Button
            mode="contained-tonal"
            icon="logout"
            onPress={handleLogout}
            buttonColor="#ffa500"
            textColor="black"
            style={styles.actionButton}
          >
            Cerrar Sesión
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: '#ffa500',
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  changePhotoText: {
    marginLeft: 6,
    color: '#ffa500',
    fontWeight: '600',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    color: 'black',
  },
  userEmail: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  card: {
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#ffa500',
    elevation: 3,
  },
  cardTitle: {
    color: 'black',
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: 'black',
  },
  divider: {
    height: 1,
    backgroundColor: '#f5f5dc',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: 'black',
    marginTop: 4,
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    marginVertical: 6,
    borderRadius: 8,
  },
  loader: {
    flex: 1,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});