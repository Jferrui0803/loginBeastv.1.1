import React, { useEffect, useState, useCallback } from 'react';
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../navigation/AppNavigator';
import * as ImagePicker from 'expo-image-picker';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  gymId: string | null;
  avatarUrl?: string; // Añadido para la URL del avatar
}

interface JwtPayload {
  id: string;
  email: string;
  phone: string;
  birthday: string;
  role: string;
  gymId?: string;
  exp: number;
}

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { onLogout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
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
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [fetchUser])
  );

  // Seleccionar imagen de la galería
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permiso denegado para acceder a la galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images', // Valor correcto para evitar warning y error
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await uploadImage(uri);
    }
  };

  // Subir imagen al backend
  const uploadImage = async (uri: string) => {
    try {
      setUploading(true);
      const token = await SecureStore.getItemAsync('userToken');
      if (!token || !user) throw new Error('No autenticado');
      const formData = new FormData();
      formData.append('avatar', {
        uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);
      await axios.post(`${API_URL}/api/users/${user.id}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileImage(null); // Limpiar imagen local para forzar recarga desde backend
      fetchUser(); // Refresca los datos del usuario
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        alert('Error al subir la imagen: ' + err.response.data.message);
      } else {
        alert('Error al subir la imagen: ' + (err.message || 'Error desconocido'));
      }
    } finally {
      setUploading(false);
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
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section - Estilo Hero Section como otras pantallas */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Mi perfil</Text>
            <Text style={styles.headerSubtitle}>Información personal y estadísticas</Text>
          </View>
          <View style={styles.headerIcon}>
            <Icon name="account-circle" size={32} color="#ffa500" />
          </View>
        </View>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              {profileImage || user?.avatarUrl ? (
                <Avatar.Image
                  size={100}
                  source={{
                    uri: profileImage || (user?.avatarUrl
                      ? user.avatarUrl.startsWith('http')
                        ? user.avatarUrl
                        : `${API_URL}${user.avatarUrl}`
                      : undefined)
                  }}
                  style={styles.avatar}
                />
              ) : (
                <Avatar.Icon 
                  size={100} 
                  icon="account" 
                  style={styles.avatar}
                  color="#000000"
                />
              )}
              <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage} disabled={uploading}>
                <Icon name="camera" size={16} color="#ffa500" />
                <Text style={styles.changePhotoText}>{uploading ? 'Subiendo...' : 'Cambiar foto'}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.userRole}>
                <Icon name="shield-account" size={16} color="#ffa500" />
                <Text style={styles.roleText}>
                  {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Personal Information Card */}
        <Card style={styles.infoCard}>
          <Card.Content style={styles.infoContent}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>Información personal</Text>
              <Icon name="account-details" size={24} color="#ffa500" />
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Icon name="phone" size={20} color="#ffa500" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{user?.phone || 'No especificado'}</Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Icon name="calendar" size={20} color="#ffa500" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Fecha de nacimiento</Text>
                <Text style={styles.infoValue}>
                  {user?.birthday 
                    ? new Date(user.birthday).toLocaleDateString('es-ES') 
                    : 'No especificada'
                  }
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Icon name="calendar-plus" size={20} color="#ffa500" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Miembro desde</Text>
                <Text style={styles.infoValue}>
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('es-ES')
                    : 'No disponible'
                  }
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Statistics Card */}
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsContent}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Estadísticas</Text>
              <Icon name="chart-box" size={24} color="#ffa500" />
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <View style={styles.statIconContainer}>
                  <Icon name="dumbbell" size={20} color="#ffa500" />
                </View>
                <Text style={styles.statValue}>156</Text>
                <Text style={styles.statLabel}>Entrenamientos</Text>
              </View>
              
              <View style={styles.statBox}>
                <View style={styles.statIconContainer}>
                  <Icon name="fire" size={20} color="#ffa500" />
                </View>
                <Text style={styles.statValue}>78,450</Text>
                <Text style={styles.statLabel}>Calorías</Text>
              </View>
              
              <View style={styles.statBox}>
                <View style={styles.statIconContainer}>
                  <Icon name="clock-outline" size={20} color="#ffa500" />
                </View>
                <Text style={styles.statValue}>124h</Text>
                <Text style={styles.statLabel}>Tiempo total</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Achievements Card */}
        <Card style={styles.achievementsCard}>
          <Card.Content style={styles.achievementsContent}>
            <View style={styles.achievementsHeader}>
              <Text style={styles.achievementsTitle}>Logros recientes</Text>
              <Icon name="trophy" size={24} color="#ffa500" />
            </View>
            
            <View style={styles.achievementItem}>
              <View style={styles.achievementIconContainer}>
                <Icon name="fire" size={24} color="#ffa500" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>Racha de 7 días</Text>
                <Text style={styles.achievementDescription}>Has entrenado 7 días seguidos</Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.achievementItem}>
              <View style={styles.achievementIconContainer}>
                <Icon name="medal" size={24} color="#ffa500" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>Atleta del mes</Text>
                <Text style={styles.achievementDescription}>Has completado todos tus objetivos</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Actions Card */}
        <Card style={styles.actionsCard}>
          <Card.Content style={styles.actionsContent}>
            <View style={styles.actionsHeader}>
              <Text style={styles.actionsTitle}>Configuración</Text>
              <Icon name="cog" size={24} color="#ffa500" />
            </View>
            
            <View style={styles.actionsGrid}>
              <Button
                mode="contained"
                style={styles.actionButton}
                labelStyle={styles.actionButtonText}
                icon={() => <Icon name="account-edit" size={16} color="#000000" />}
                onPress={() => {
                  if (user) {
                    navigation.navigate('EditProfile', { user });
                  }
                }}
              >
                EDITAR PERFIL
              </Button>

              <Button
                mode="outlined"
                style={styles.secondaryButton}
                labelStyle={styles.secondaryButtonText}
                icon={() => <Icon name="lock-reset" size={16} color="#666666" />}
                onPress={() => console.log('Cambiar contraseña')}
              >
                CAMBIAR CONTRASEÑA
              </Button>

              <Button
                mode="outlined"
                style={styles.logoutButton}
                labelStyle={styles.logoutButtonText}
                icon={() => <Icon name="logout" size={16} color="#F44336" />}
                onPress={onLogout}
              >
                CERRAR SESIÓN
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc', 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Header Section - Estilo Hero Section como HomeScreen
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

  // Profile Card
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  profileContent: {
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#ffa500',
    marginBottom: 12,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 0, 
  },
  changePhotoText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#ffa500',
    fontWeight: '600',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  userRole: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 0, 
  },
  roleText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },

  // Info Card
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoContent: {
    padding: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 0, 
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '600',
  },

  // Stats Card - Estilo como HomeScreen
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statsContent: {
    padding: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Achievements Card
  achievementsCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  achievementsContent: {
    padding: 20,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 0, 
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666666',
  },

  // Actions Card
  actionsCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionsContent: {
    padding: 20,
  },
  actionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  actionsGrid: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#ffa500',
    borderRadius: 0, 
    paddingVertical: 4,
    elevation: 0,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#000000',
  },
  secondaryButton: {
    borderColor: '#666666',
    borderRadius: 0, 
    paddingVertical: 4,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#666666',
  },
  logoutButton: {
    borderColor: '#F44336',
    borderRadius: 0, 
    paddingVertical: 4,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#F44336',
  },

  // Divider
  divider: {
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },

  // Loading and Error States
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5dc',
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
});