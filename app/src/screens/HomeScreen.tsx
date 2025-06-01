import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, RefreshControl, ActivityIndicator, Dimensions } from 'react-native';
import { Text, Card, Button, Surface, FAB, Chip, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

import { useCameraPermissions } from 'expo-camera';
import HomeClassCard from '../components/HomeClassCard';

const { width } = Dimensions.get('window');

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    HomeScreen: undefined;
    ProgressScreen: undefined;
    Profile: undefined;
    GymMap: undefined;
    WorkoutDetail: undefined;
    PersonalizedTraining: undefined;
    ClassBooking: undefined;
    Routines: undefined;
    Nutrition: undefined;
    ChatList: undefined;
    Chat: { chatId: string; chatName?: string };
    QRGenerator: undefined;
    IAChatList: { chatType: 'nutrition' | 'training' };
    IAChatDetail: { chatId: string; chatTitle: string; chatType: 'nutrition' | 'training' };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [refreshing, setRefreshing] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [userRole, setUserRole] = useState<'USER' | 'ADMIN' | 'TRAINER' | null>(null);
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const isPermissionGranted = cameraPermission?.granted || false;

    const getUserRole = async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');

            if (token) {
                // Primero intentar obtener el rol del token JWT
                try {
                    const decoded = jwtDecode<JwtPayload>(token);
                    if (decoded.role) {
                        setUserRole(decoded.role);

                        return;
                    }
                } catch (jwtError) {
                    console.log('Error decoding JWT, fetching from API:', jwtError);
                }

            }
        } catch (error) {
            console.error('Error getting user role:', error);
            setUserRole('USER'); // Default a user si hay error
        }
    };

    // Cargar el rol al montar el componente
    useEffect(() => {
        getUserRole();
    }, []);
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                const { data } = await axios.get(`${API_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (data.token) {
                    await SecureStore.setItemAsync('userToken', data.token);
                }
            }
        } catch (e) {
            // Si falla, sigue con la recarga visual
        }
        setReloadKey(prev => prev + 1);
        const start = Date.now();
        const elapsed = Date.now() - start;
        if (elapsed < 400) {
            setTimeout(() => setRefreshing(false), 400 - elapsed);
        } else {
            setRefreshing(false);
        }
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (event.nativeEvent.contentOffset.y <= 0 && !refreshing) {
            onRefresh();
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    icon="account-circle"
                    size={28}
                    iconColor='#ffa500'
                    onPress={() => navigation.navigate('Profile')}
                    style={styles.headerButton}
                />
            ),
            headerShown: true,
            headerTitleStyle: {
                fontWeight: '700',
                fontSize: 20,
                color: '#fff',
            },
        });
    }, [navigation]);

    const renderHeroSection = () => (
        <View style={styles.heroSection}>
            <View style={styles.heroContent}>
                <Text style={styles.welcomeText}>¡Bienvenido de vuelta!</Text>
                <Text style={styles.motivationText}>Es hora de superar tus límites</Text>
            </View>
            <View style={styles.heroIcon}>
                <Icon name="fire" size={32} color='#ffa500' />
            </View>
        </View>
    );

    const renderWorkoutCard = () => (
        <Card style={styles.workoutCard}>
            <View style={styles.cardImageContainer}>
                <Card.Cover
                    source={require('../../assets/workout.webp')}
                    style={styles.cardImage}
                />
                <View style={styles.cardOverlay}>
                    <View style={styles.difficultyBadge}>
                        <Text style={styles.difficultyText}>INTERMEDIO</Text>
                    </View>
                </View>
            </View>
            <Card.Content style={styles.workoutCardContent}>
                <Text style={styles.workoutTitle}>Entrenamiento del día</Text>
                <Text style={styles.workoutSubtitle}>Full Body • Fuerza y resistencia</Text>

                <View style={styles.workoutStats}>
                    <View style={styles.statItem}>
                        <Icon name="clock-outline" size={18} color="#666" />
                        <Text style={styles.statText}>60 min</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Icon name="fire" size={18} color="#FF4444" />
                        <Text style={styles.statText}>350 kcal</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Icon name="dumbbell" size={18} color="#666" />
                        <Text style={styles.statText}>8 ejercicios</Text>
                    </View>
                </View>
            </Card.Content>
            <Card.Actions style={styles.workoutCardActions}>
                <Button
                    mode="contained"
                    style={styles.startButton}
                    labelStyle={styles.startButtonText}
                    icon={() => <Icon name="play" size={16} color="#FFFFFF" />}
                    onPress={() => navigation.navigate('WorkoutDetail')}>
                    
                    <Text>COMENZAR</Text>
                </Button>
            </Card.Actions>
        </Card>
    ); const renderQuickActions = () => (
        <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Acciones rápidas</Text>
            <View style={styles.quickActionsGrid}>
                <Button
                    mode="outlined"
                    icon={() => <Icon name="calendar" size={24} color="#ffa500" />}
                    style={styles.quickActionButton}
                    labelStyle={styles.quickActionLabel}
                    onPress={() => navigation.navigate('ClassBooking')}
                >
                    
                    <Text>Clases</Text>
                </Button>
                <Button
                    mode="outlined"
                    icon={() => <Icon name="chart-line" size={24} color="#ffa500" />}
                    style={styles.quickActionButton}
                    labelStyle={styles.quickActionLabel}
                    onPress={() => navigation.navigate('ProgressScreen')}
                >
                    
                    <Text>Progreso</Text>
                </Button>
                <Button
                    mode="outlined"
                    icon={() => <Icon name="dumbbell" size={24} color="#ffa500" />}
                    style={styles.quickActionButton}
                    labelStyle={styles.quickActionLabel}
                    onPress={() => navigation.navigate('Routines')}
                >
                    
                    <Text>Rutinas</Text>
                </Button>
            </View>
            <View style={[styles.quickActionsGrid, { marginTop: 16 }]}>
                <Button
                    mode="outlined"
                    icon={() => <Icon name="qrcode" size={24} color="#ffa500" />}
                    style={styles.quickActionButton}
                    labelStyle={styles.quickActionLabel}
                    onPress={() => navigation.navigate('QRGenerator')}>
                    
                    <Text>Acceso QR</Text>
                </Button>
                <Button
                    mode="outlined"
                    icon={() => <Icon name="food-apple" size={24} color="#ffa500" />}
                    style={styles.quickActionButton}
                    labelStyle={styles.quickActionLabel}
                    onPress={() => handleNewIAChat('nutrition')}>
                    
                   <Text>Chat Nutrición</Text>
                </Button>
                <Button
                    mode="outlined"
                    icon={() => <Icon name="robot" size={24} color="#ffa500" />}
                    style={styles.quickActionButton}
                    labelStyle={styles.quickActionLabel}
                    onPress={() => handleNewIAChat('training')}>
                    
                    <Text>Chat Entrenamiento</Text>
                </Button>
            </View>
        </View>
    );

    const renderQrScannerButton = () => (
        <Button
            mode="outlined"
            icon={() => <Icon name="qrcode-scan" size={24} color="#ffa500" />}
            style={styles.scannerButton}
            labelStyle={styles.quickActionLabel}
            onPress={ async () => {
                const permission = await requestCameraPermission();

                if (permission.granted) {
                    navigation.navigate('ScannerScreen'); 
                } else {
                    alert('Permiso de cámara denegado. No puedes escanear el código QR.');
                }
            }}>
            <Text>Escanear QR</Text> 
        </Button>
    );
    const renderWeeklyStats = () => (
        <Card style={styles.statsCard}>
            <Card.Content style={styles.statsContent}>
                <View style={styles.statsHeader}>
                    <Text style={styles.statsTitle}>Esta semana</Text>
                    <Icon name="trending-up" size={24} color="#ffa500" />
                </View>
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <View style={styles.statIconContainer}>
                            <Icon name="clock-outline" size={20} color="#ffa500" />
                        </View>
                        <Text style={styles.statValue}>5.2h</Text>
                        <Text style={styles.statLabel}>Tiempo</Text>
                    </View>
                    <View style={styles.statBox}>
                        <View style={styles.statIconContainer}>
                            <Icon name="fire" size={20} color="#ffa500" />
                        </View>
                        <Text style={styles.statValue}>2,450</Text>
                        <Text style={styles.statLabel}>Calorías</Text>
                    </View>
                    <View style={styles.statBox}>
                        <View style={styles.statIconContainer}>
                            <Icon name="run" size={20} color="#ffa500" />
                        </View>
                        <Text style={styles.statValue}>4</Text>
                        <Text style={styles.statLabel}>Sesiones</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    const handleNewIAChat = async (chatType: 'nutrition' | 'training') => {
        const getStorageKey = (type: 'nutrition' | 'training') =>
            type === 'nutrition' ? 'iaChats_nutrition' : 'iaChats_training';
        const storageKey = getStorageKey(chatType);
        const chatsRaw = await AsyncStorage.getItem(storageKey);
        const chats = chatsRaw ? JSON.parse(chatsRaw) : [];
        const newChat = {
            id: Date.now().toString(),
            title: chatType === 'nutrition' ? 'Nuevo Chat Nutrición' : 'Nuevo Chat Entrenamiento',
            messages: [],
        };
        const updatedChats = [newChat, ...chats];
        await AsyncStorage.setItem(storageKey, JSON.stringify(updatedChats));
        navigation.navigate('IAChatDetail', {
            chatId: newChat.id,
            chatTitle: newChat.title,
            chatType,
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#FF4444"]}
                        progressBackgroundColor="#FFFFFF"
                        tintColor="#FF4444"
                    />
                }
                scrollEventThrottle={16}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {renderHeroSection()}
                {renderWorkoutCard()}
                {userRole !== 'USER' ? (renderQrScannerButton()) : null}
                {renderQuickActions()}
                {renderWeeklyStats()}
                <HomeClassCard reloadTrigger={reloadKey} />
            </ScrollView>

            <FAB
                icon="message"
                style={styles.fab}
                color="#FFFFFF"
                onPress={() => navigation.navigate('ChatList')}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5dc',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    headerButton: {
        marginRight: 8,
    },

    // Hero Section
    heroSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 24,
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
        borderRadius: 0,
    },
    heroContent: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    motivationText: {
        fontSize: 16,
        color: '#666666',
        fontWeight: '400',
    },
    heroIcon: {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(255, 165, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Workout Card
    workoutCard: {
        marginHorizontal: 20,
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 0,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardImageContainer: {
        position: 'relative',
        overflow: 'hidden',

    },
    cardImage: {
        height: 200,
        borderRadius: 0,
    },
    cardOverlay: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    difficultyBadge: {
        backgroundColor: 'rgba(255, 165, 0, 0.95)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    difficultyText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    workoutCardContent: {
        padding: 20,

    },
    workoutTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    workoutSubtitle: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 16,
        textAlign: 'center',

    },
    workoutStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    workoutCardActions: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        justifyContent: 'center',
    },
    startButton: {
        backgroundColor: '#ffa500',
        paddingVertical: 2,
        paddingHorizontal: 16,
        borderRadius: 0,
        elevation: 0,
        minWidth: 120,
        alignSelf: 'flex-start',
    },
    startButtonText: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
        color: '#000000',
    },

    // Quick Actions
    quickActionsContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    quickActionButton: {
        flex: 1,
        borderColor: '#ffa500',
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
    },
    quickActionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1A1A1A',
    },

    // Stats Card
    statsCard: {
        marginHorizontal: 20,
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        elevation: 2,
        borderRadius: 0,
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
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666666',
        fontWeight: '500',
    },

    // FAB
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 10,
        backgroundColor: '#ffa500',
        elevation: 8,
        shadowColor: '#ffa500',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
        scannerButton: {
        marginHorizontal: 20,
        marginBottom: 16,
        borderColor: '#ffa500',
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
    },
});