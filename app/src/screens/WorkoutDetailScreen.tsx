import React from 'react';
import { View, StyleSheet, ScrollView, Modal, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
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
            sets: '4',
            reps: '12',
            rest: '90s',
            icon: 'weight-lifter',
            muscles: 'Piernas, Glúteos',
        },
        {
            name: 'Press de Banca',
            sets: '4',
            reps: '10',
            rest: '90s',
            icon: 'dumbbell',
            muscles: 'Pecho, Tríceps',
        },
        {
            name: 'Peso Muerto',
            sets: '3',
            reps: '8',
            rest: '120s',
            icon: 'weight',
            muscles: 'Espalda, Piernas',
        },
        {
            name: 'Dominadas',
            sets: '3',
            reps: 'Max',
            rest: '90s',
            icon: 'arm-flex',
            muscles: 'Espalda, Bíceps',
        },
    ];

    const [infoVisible, setInfoVisible] = React.useState<number | null>(null);

    const exerciseImages: { [key: number]: any } = {
        0: require('../../assets/sentadilla.jpg'), 
        1: require('../../assets/press-banca.jpg'), 
        2: require('../../assets/peso-muerto.jpg'), 
        3: require('../../assets/dominada.jpg'), 
    };

    const renderWorkoutHeader = () => (
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
                <Text style={styles.workoutTitle}>Entrenamiento Full Body</Text>
                <Text style={styles.workoutSubtitle}>Fuerza y resistencia • Nivel intermedio</Text>
                
                <View style={styles.workoutStats}>
                    <View style={styles.statItem}>
                        <Icon name="clock-outline" size={18} color="#666" />
                        <Text style={styles.statText}>60 min</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Icon name="fire" size={18} color="#ffa500" />
                        <Text style={styles.statText}>350 kcal</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Icon name="dumbbell" size={18} color="#666" />
                        <Text style={styles.statText}>4 ejercicios</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    const renderExercisesList = () => (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Lista de ejercicios</Text>
            <Card style={styles.exercisesCard}>
                <Card.Content style={styles.exercisesContent}>
                    {exercises.map((exercise, index) => (
                        <View key={index} style={styles.exerciseItem}>
                            <View style={styles.exerciseHeader}>
                                <View style={styles.exerciseIconContainer}>
                                    <Icon name={exercise.icon} size={20} color="#ffa500" />
                                </View>
                                <View style={styles.exerciseInfo}>
                                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                                    <Text style={styles.exerciseMuscles}>{exercise.muscles}</Text>
                                </View>
                                <TouchableOpacity onPress={() => setInfoVisible(index)} style={styles.infoButton}>
                                    <Icon name="information-outline" size={22} color="#ffa500" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.exerciseStats}>
                                <View style={styles.exerciseStatItem}>
                                    <Text style={styles.exerciseStatLabel}>Series</Text>
                                    <Text style={styles.exerciseStatValue}>{exercise.sets}</Text>
                                </View>
                                <View style={styles.exerciseStatItem}>
                                    <Text style={styles.exerciseStatLabel}>Reps</Text>
                                    <Text style={styles.exerciseStatValue}>{exercise.reps}</Text>
                                </View>
                                <View style={styles.exerciseStatItem}>
                                    <Text style={styles.exerciseStatLabel}>Descanso</Text>
                                    <Text style={styles.exerciseStatValue}>{exercise.rest}</Text>
                                </View>
                            </View>
                            {index < exercises.length - 1 && <View style={styles.exerciseDivider} />}
                        </View>
                    ))}
                </Card.Content>
            </Card>
            <Modal
                visible={infoVisible !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setInfoVisible(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.modalClose} onPress={() => setInfoVisible(null)}>
                            <Icon name="close" size={28} color="#ffa500" />
                        </TouchableOpacity>
                        {infoVisible !== null && (
                            <Image
                                source={exerciseImages[infoVisible]}
                                style={styles.modalImage}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );

    const renderInstructions = () => (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Recomendaciones</Text>
            <Card style={styles.instructionsCard}>
                <Card.Content style={styles.instructionsContent}>
                    <View style={styles.instructionItem}>
                        <View style={styles.instructionIconContainer}>
                            <Icon name="run" size={20} color="#ffa500" />
                        </View>
                        <View style={styles.instructionText}>
                            <Text style={styles.instructionTitle}>Calentamiento previo</Text>
                            <Text style={styles.instructionDescription}>5-10 minutos de cardio ligero antes de empezar</Text>
                        </View>
                    </View>
                    
                    <View style={styles.instructionItem}>
                        <View style={styles.instructionIconContainer}>
                            <Icon name="clock-outline" size={20} color="#ffa500" />
                        </View>
                        <View style={styles.instructionText}>
                            <Text style={styles.instructionTitle}>Tiempo de descanso</Text>
                            <Text style={styles.instructionDescription}>Respeta los tiempos entre series para mejores resultados</Text>
                        </View>
                    </View>

                    <View style={styles.instructionItem}>
                        <View style={styles.instructionIconContainer}>
                            <Icon name="water" size={20} color="#ffa500" />
                        </View>
                        <View style={styles.instructionText}>
                            <Text style={styles.instructionTitle}>Mantente hidratado</Text>
                            <Text style={styles.instructionDescription}>Bebe agua regularmente durante el entrenamiento</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {renderWorkoutHeader()}
                {renderExercisesList()}
                {renderInstructions()}
            </ScrollView>
            
            <View style={styles.buttonContainer}>
                <Button 
                    mode="contained"
                    style={styles.startButton}
                    labelStyle={styles.startButtonText}
                    icon={() => <Icon name="play" size={16} color="#000000" />}
                    onPress={() => navigation.navigate('GymMap')}>
                    COMENZAR ENTRENAMIENTO
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5dc', 
    },
    scrollContent: {
        paddingBottom: 100,
    },

    // Workout Card (Header) - Estilo idéntico a HomeScreen
    workoutCard: {
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        elevation: 4,
        borderRadius: 0,
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
    },
    workoutSubtitle: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 16,
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

    // Sections - Estilo idéntico a HomeScreen
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 16,
        marginHorizontal: 20,
    },

    // Exercises Card
    exercisesCard: {
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        elevation: 2,
        borderRadius: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    exercisesContent: {
        padding: 20,
    },
    exerciseItem: {
        paddingVertical: 12,
    },
    exerciseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    exerciseIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 165, 0, 0.1)', 
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    exerciseMuscles: {
        fontSize: 12,
        color: '#666666',
        fontWeight: '500',
    },
    exerciseStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 52,
    },
    exerciseStatItem: {
        alignItems: 'center',
        flex: 1,
    },
    exerciseStatLabel: {
        fontSize: 12,
        color: '#666666',
        fontWeight: '500',
        marginBottom: 4,
    },
    exerciseStatValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    exerciseDivider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginTop: 16,
        marginHorizontal: -20,
    },

    // Instructions Card - Estilo consistente
    instructionsCard: {
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        elevation: 2,
        borderRadius: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    instructionsContent: {
        padding: 20,
    },
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    instructionIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 165, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    instructionText: {
        flex: 1,
        paddingTop: 4,
    },
    instructionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    instructionDescription: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
    },

    // Button - Estilo idéntico a HomeScreen
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#f5f5dc',
        paddingTop: 16,
    },
    startButton: {
        backgroundColor: '#ffa500',
        paddingVertical: 4,
        borderRadius: 0,
        elevation: 0,
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
        color: '#000000',
    },
    infoButton: {
        marginLeft: 8,
        padding: 4,
        alignSelf: 'flex-start',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        maxWidth: '90%',
        maxHeight: '80%',
    },
    modalImage: {
        width: 250,
        height: 250,
        marginTop: 12,
    },
    modalClose: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 2,
    },
});

export default WorkoutDetailScreen;