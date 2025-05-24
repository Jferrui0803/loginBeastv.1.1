import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Surface, List, Divider, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    Profile: undefined;
    GymMap: undefined;
    WorkoutDetail: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WorkoutDetailScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const exercises = [
        {
            name: 'Sentadillas',
            sets: '4 series',
            reps: '12 repeticiones',
            rest: '90 seg',
            icon: 'weight-lifter',
            muscles: 'Piernas, Glúteos',
        },
        {
            name: 'Press de Banca',
            sets: '4 series',
            reps: '10 repeticiones',
            rest: '90 seg',
            icon: 'dumbbell',
            muscles: 'Pecho, Tríceps',
        },
        {
            name: 'Peso Muerto',
            sets: '3 series',
            reps: '8 repeticiones',
            rest: '120 seg',
            icon: 'weight',
            muscles: 'Espalda, Piernas',
        },
        {
            name: 'Dominadas',
            sets: '3 series',
            reps: 'Máximas',
            rest: '90 seg',
            icon: 'arm-flex',
            muscles: 'Espalda, Bíceps',
        },
    ];

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.headerCard}>
                <Card.Cover source={require('../../assets/workout.webp')} />
                <Card.Content style={styles.headerContent}>
                    <Text variant="headlineMedium" style={{ color: 'black' }}>Full Body</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.stat}>
                            <Icon name="clock-outline" size={24} color="#666" />
                            <Text style={[styles.statValue, { color: 'black' }]}>60 min</Text>
                        </View>
                        <View style={styles.stat}>
                            <Icon name="fire" size={24} color="#666" />
                            <Text style={[styles.statValue, { color: 'black' }]}>350 kcal</Text>
                        </View>
                        <View style={styles.stat}>
                            <Icon name="weight-lifter" size={24} color="#666" />
                            <Text style={[styles.statValue, { color: 'black' }]}>Intermedio</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>

            <Surface style={styles.exercisesList} elevation={1}>
                <Text style={[styles.sectionTitle, { color: 'black' }]}>Ejercicios</Text>
                {exercises.map((exercise, index) => (
                    <React.Fragment key={index}>
                        <List.Item
                            titleStyle={{ color: 'black' }}
                            descriptionStyle={{ color: 'black' }}
                            title={exercise.name}
                            description={exercise.muscles}
                            left={props => <List.Icon {...props} icon={exercise.icon} />}
                            right={props => (
                                <View style={styles.exerciseDetails}>
                                    <Text style={{ color: 'black' }}>{exercise.sets}</Text>
                                    <Text style={{ color: 'black' }}>{exercise.reps}</Text>
                                    <IconButton {...props} icon="information" onPress={() => {}} />
                                </View>
                            )}
                        />
                        {index < exercises.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </Surface>

            <Surface style={styles.instructions} elevation={1}>
                <Text style={[styles.sectionTitle, { color: 'black' }]}>Instrucciones</Text>
                <List.Item
                    title="Calentamiento"
                    description="5-10 minutos de cardio ligero"
                    titleStyle={{ color: 'black' }}
                    descriptionStyle={{ color: 'black' }}
                    left={props => <List.Icon {...props} icon="run" />}
                />
                <Divider />
                <List.Item
                    title="Descanso entre ejercicios"
                    description="60-90 segundos"
                    titleStyle={{ color: 'black' }}
                    descriptionStyle={{ color: 'black' }}
                    left={props => <List.Icon {...props} icon="clock-outline" />}
                />
                <Divider />
                <List.Item
                    title="Hidratación"
                    description="Bebe agua entre series"
                    titleStyle={{ color: 'black' }}
                    descriptionStyle={{ color: 'black' }}
                    left={props => <List.Icon {...props} icon="water" />}
                />
            </Surface>

            <View style={styles.buttonContainer}>
                <Button 
                    mode="contained" 
                    icon="play" 
                    onPress={() => navigation.navigate('GymMap')}
                    style={styles.startButton}
                    labelStyle={{ color: 'black' }}
                >
                    Comenzar Entrenamiento
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5dc', 
    },
    headerCard: {
        margin: 16,
        elevation: 2,
        backgroundColor:   '#ffa500',
    },
    headerContent: {
        paddingVertical: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
        backgroundColor:   '#ffa500',
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        marginTop: 4,
        fontSize: 16,
    },
    exercisesList: {
        margin: 16,
        padding: 16,
        borderRadius: 8,
        backgroundColor:   '#ffa500',
    },
    instructions: {
        margin: 16,
        padding: 16,
        borderRadius: 8,
        backgroundColor:   '#ffa500',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    exerciseDetails: {
        alignItems: 'flex-end',
    },
    buttonContainer: {
        padding: 16,
        marginBottom: 16,
        backgroundColor:   '#ffa500',
    },
    startButton: {
        padding: 8,
        backgroundColor:   '#ffa500',
    },
});

export default WorkoutDetailScreen;