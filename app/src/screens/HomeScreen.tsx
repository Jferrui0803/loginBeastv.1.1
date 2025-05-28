import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { Text, Card, Button, Surface, FAB, Chip, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../context/AuthContext';

import HomeClassCard from '../components/HomeClassCard';

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
    IAChatList: { chatType: 'nutrition' | 'training' };
    IAChatDetail: { chatId: string; chatTitle: string; chatType: 'nutrition' | 'training' };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [refreshing, setRefreshing] = useState(false);
    const [reloadKey, setReloadKey] = useState(0); // Para forzar recarga de clases
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            // Refresca el token del usuario antes de recargar las clases
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                // Cambia la ruta si tu backend usa otra para devolver el usuario y el nuevo token
                const { data } = await axios.get(`${API_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Si el backend devuelve un nuevo token actualizado:
                if (data.token) {
                    await SecureStore.setItemAsync('userToken', data.token);
                }
            }
        } catch (e) {
            // Si falla, sigue con la recarga visual
        }
        setReloadKey(prev => prev + 1); // Forzar recarga de clases
        const start = Date.now();
        // Mantener el spinner visible al menos 400ms para evitar parpadeos
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
                    size={24}
                    iconColor="#000000"
                    onPress={() => navigation.navigate('Profile')}
                    style={{ marginRight: 8 }}
                />
            ),
            headerShown: true,
        });
    }, [navigation]);

    const renderWorkoutCard = () => (
        <Card style={styles.card}>
            <Card.Cover source={require('../../assets/workout.webp')} />
            <Card.Title 
                title="Entrenamiento del día" 
                subtitle="Full Body" 
                titleStyle={{ color: 'black' }} 
                subtitleStyle={{ color: 'black' }} 
            />
            <Card.Content>
                <View style={styles.chipContainer}>
                    <Chip 
                        icon={() => <Icon name="clock" size={16} color="black" />} 
                        style={styles.chip} 
                        textStyle={{ color: 'black' }} 
                        selectedColor="black">
                        60 min
                    </Chip>
                    <Chip 
                        icon={() => <Icon name="fire" size={16} color="black" />} 
                        style={styles.chip} 
                        textStyle={{ color: 'black' }} 
                        selectedColor="black">
                        350 kcal
                    </Chip>
                    <Chip 
                        icon={() => <Icon name="weight-lifter" size={16} color="black" />} 
                        style={styles.chip} 
                        textStyle={{ color: 'black' }} 
                        selectedColor="black">
                        Intermedio
                    </Chip>
                </View>
            </Card.Content>
            <Card.Actions>
                <Button 
                    mode="contained"
                    textColor="black"
                    style={{ backgroundColor: '#f5f5dc' }}
                    onPress={() => navigation.navigate('WorkoutDetail')}>
                    Ver detalles
                </Button>
            </Card.Actions>
        </Card>
    );

    const renderQuickActions = () => (
        <Surface style={styles.quickActions} elevation={1}>
            <Button
                mode="contained-tonal"
                icon="calendar"
                style={styles.actionButton}
                textColor="black"
                onPress={() => navigation.navigate('ClassBooking')}>
                Reservar clases
            </Button>
            <Button
                mode="contained-tonal"
                icon="chart-line"
                style={styles.actionButton}
                textColor="black"
                onPress={() => navigation.navigate('ProgressScreen')}>  
                Progreso
            </Button>
            <Button
                mode="contained-tonal"
                icon="dumbbell"
                style={styles.actionButton}
                textColor="black"
                onPress={() => navigation.navigate('Routines')}>
                Rutinas
            </Button>
        </Surface>
    );

    const renderStats = () => (
        <Surface style={styles.statsContainer} elevation={1}>
            <Text style={styles.sectionTitle}>Estadísticas semanales</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                    <Icon name="clock-outline" size={24} color="#FF0000" />
                    <Text style={styles.statValue}>5.2h</Text>
                    <Text style={styles.statLabel}>Tiempo total</Text>
                </View>
                <View style={styles.statItem}>
                    <Icon name="fire" size={24} color="#FF0000" />
                    <Text style={styles.statValue}>2,450</Text>
                    <Text style={styles.statLabel}>Calorías</Text>
                </View>
                <View style={styles.statItem}>
                    <Icon name="run" size={24} color="#FF0000" />
                    <Text style={styles.statValue}>4</Text>
                    <Text style={styles.statLabel}>Sesiones</Text>
                </View>
            </View>
        </Surface>
    );

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#ffa500"]}
                        progressBackgroundColor="#f5f5dc"
                    />
                }
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingBottom: 80 }} 
            >
                {renderWorkoutCard()}
                {renderQuickActions()}
                {renderStats()}
                <HomeClassCard reloadTrigger={reloadKey} />
                {/* Sección de mensajes eliminada */}
            </ScrollView>
            
            {/* FAB con icono de mensaje */}
            <FAB
                icon="message"
                style={styles.fab}
                onPress={() => navigation.navigate('ChatList')}
            />

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
                    onPress={() => navigation.navigate('ProgressScreen')}
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
        backgroundColor: '#f5f5dc',
    },
    card: {
        margin: 16,
        elevation: 2,
        backgroundColor: '#ffa500',
    },
    chipContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    chip: {
        marginRight: 8,
        backgroundColor: '#f5f5dc',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        marginHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#ffa500'
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 4,
        backgroundColor: '#fff',
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    nutritionCard: {
        marginTop: 8,
        backgroundColor: '#ffa500'
    },
    statsContainer: {
        margin: 16,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#ffa500'
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
    },
    statLabel: {
        color: '#757575',
        marginTop: 4,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 80, 
        backgroundColor: '#ffa500',
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