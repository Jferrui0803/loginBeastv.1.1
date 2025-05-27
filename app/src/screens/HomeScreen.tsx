import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { Text, Card, Button, Surface, FAB, Chip, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import HomeClassCard from '../components/HomeClassCard';

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
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
    const onRefresh = async () => {
        setRefreshing(true);
        // Aquí puedes recargar datos desde API o AsyncStorage si lo necesitas
        // Mantener el spinner visible al menos 1.5 segundos
        setTimeout(() => setRefreshing(false), 1500);
    };
    // Detectar scroll al tope superior para recargar
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
                Reservar clase
            </Button>
            <Button
                mode="contained-tonal"
                icon="chart-line"
                style={styles.actionButton}
                textColor="black"
                onPress={() => alert('Que no está implementado todavía, ansias')}>
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
    );    return (
        <View style={styles.container}>
            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {renderWorkoutCard()}
                {renderQuickActions()}
                {renderStats()}
                <HomeClassCard />
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: 'black' }]}>Nutrición</Text>
                    <Card style={styles.nutritionCard}>
                        <Card.Content>
                            <Text variant="titleMedium" style={{ color: 'black' }}>
                                Plan alimenticio personalizado
                            </Text>
                            <Text variant="bodySmall" style={{ color: 'black' }}>
                                Alcanza tus objetivos con una dieta equilibrada
                            </Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button
                                mode="contained-tonal"
                                style={{ backgroundColor: '#f5f5dc' }}
                                textColor="black"
                                onPress={() => navigation.navigate('IAChatList', { chatType: 'nutrition' })}
                            >
                                Ver plan
                            </Button>
                        </Card.Actions>
                    </Card>
                </View>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: 'black' }]}>Entrenamiento personalizado</Text>
                    <Card style={styles.nutritionCard}>
                        <Card.Content>
                            <Text variant="titleMedium" style={{ color: 'black' }}>
                                Plan de entrenamiento personalizado
                            </Text>
                            <Text variant="bodySmall" style={{ color: 'black' }}>
                                Diseña tu entrenamiento basado en tu anatomía
                            </Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button
                                mode="contained-tonal"
                                style={{ backgroundColor: '#f5f5dc' }}
                                textColor="black"
                                onPress={() => navigation.navigate('IAChatList', { chatType: 'training' })}
                            >
                                Ver plan
                            </Button>
                        </Card.Actions>
                    </Card>
                </View>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: 'black' }]}>Mensajes</Text>
                    <Card style={styles.nutritionCard}>
                        <Card.Content>
                            <Text variant="titleMedium" style={{ color: 'black' }}>Chats</Text>
                            <Text variant="bodySmall" style={{ color: 'black' }}>Comunícate con otros usuarios</Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button
                                mode="contained-tonal"
                                style={{ backgroundColor: '#f5f5dc' }}
                                textColor="black"
                                onPress={() => navigation.navigate('ChatList')}
                            >Abrir chats</Button>
                        </Card.Actions>
                    </Card>                </View>
            </ScrollView>
            
            {refreshing && (
                <View style={styles.refreshingOverlay} pointerEvents="none">
                    <ActivityIndicator size="large" color="#ffa500" />
                    <Text style={styles.refreshingText}>Recargando...</Text>
                </View>
            )}
            
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => console.log('Agregar nuevo entrenamiento')}
            />
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
    },    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffa500',
    },
    refreshingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(245,245,220,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    refreshingText: {
        marginTop: 16,
        fontSize: 18,
        color: '#ffa500',
        fontWeight: 'bold',
    },
});