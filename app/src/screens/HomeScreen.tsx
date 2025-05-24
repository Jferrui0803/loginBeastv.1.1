import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Button, Surface, FAB, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
    const navigation = useNavigation<NavigationProp>();

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
    );

    return (
        <View style={styles.container}>
            <ScrollView>
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
                                onPress={() => navigation.navigate('Nutrition')}
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
                                onPress={() => navigation.navigate('PersonalizedTraining')}
                            >
                                Ver plan
                            </Button>
                        </Card.Actions>
                    </Card>
                </View>
            </ScrollView>
            
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
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffa500',
    },
});