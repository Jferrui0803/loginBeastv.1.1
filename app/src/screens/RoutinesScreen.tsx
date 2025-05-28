import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, IconButton, Surface, Chip, Portal, Modal, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  HomeScreen: undefined;
  ClassBooking: undefined;
  Routines: undefined;
  IAChatList: { chatType: 'nutrition' | 'training' };
  ChatList: undefined;
  WorkoutDetail: undefined;
  GymMap: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RoutinesScreen() {
  const navigation = useNavigation<NavigationProp>();
  
  // Estados para la calculadora de IMC
  const [showIMCModal, setShowIMCModal] = useState(false);
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setIMC] = useState<number | null>(null);
  const [categoriaIMC, setCategoriaIMC] = useState('');

  // Estados para el contador de entrenamiento
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutos = 180 segundos
  const [isActive, setIsActive] = useState(false);
  const [activeRoutineIndex, setActiveRoutineIndex] = useState<number | null>(null); // Nuevo estado

  const weeklyStats = [
    { icon: 'fire', value: '2,450', label: 'Calorías quemadas', color: '#FF4444' },
    { icon: 'clock-outline', value: '8.5h', label: 'Tiempo total', color: '#4444FF' },
    { icon: 'dumbbell', value: '12', label: 'Entrenamientos', color: '#44FF44' },
    { icon: 'trophy', value: '95%', label: 'Objetivos cumplidos', color: '#FFD700' },
  ];

  const workoutPlans = [
    {
      title: "Rutina Full Body",
      subtitle: "Principiante • 3 días/semana",
      duration: "45 min",
      exercises: "8 ejercicios",
      difficulty: "Fácil",
      icon: "account"
    },
    {
      title: "Push/Pull/Legs",
      subtitle: "Intermedio • 6 días/semana", 
      duration: "60 min",
      exercises: "12 ejercicios",
      difficulty: "Intermedio",
      icon: "arm-flex"
    },
    {
      title: "Cardio Intenso",
      subtitle: "Avanzado • 4 días/semana",
      duration: "30 min", 
      exercises: "6 ejercicios",
      difficulty: "Difícil",
      icon: "run"
    }
  ];

  // Efecto para el contador
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      Alert.alert('¡Tiempo terminado!', '¡Tu entrenamiento de 3 minutos ha finalizado!', [
        { text: 'OK', onPress: () => {
          setTimeLeft(180);
          setShowTimer(false);
          setActiveRoutineIndex(null);
        }}
      ]);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Fácil': return '#4CAF50';
      case 'Intermedio': return '#FF9800';
      case 'Difícil': return '#F44336';
      default: return '#757575';
    }
  };

  // Funciones para el timer
  const iniciarEntrenamiento = (routineIndex: number) => {
    if (!isActive && timeLeft === 180) {
      // Si no está activo y está en tiempo inicial, abrir modal
      setActiveRoutineIndex(routineIndex);
      setShowTimer(true);
      setTimeLeft(180);
      setIsActive(true);
    } else if (activeRoutineIndex === routineIndex) {
      // Si ya está en progreso y es la misma rutina, solo cambiar el estado
      toggleTimer();
    } else {
      // Si es una rutina diferente, cambiar la rutina activa
      setActiveRoutineIndex(routineIndex);
      setShowTimer(true);
      setTimeLeft(180);
      setIsActive(true);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTimeLeft(180);
    setIsActive(false);
    setActiveRoutineIndex(null);
  };

  const cerrarTimer = () => {
    setShowTimer(false);
    // NO resetear el timer ni isActive aquí para mantener el estado
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 120) return '#4CAF50'; // Verde
    if (timeLeft > 60) return '#FF9800';  // Naranja
    return '#F44336'; // Rojo
  };

  // Funciones para IMC
  const calcularIMC = () => {
    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura) / 100; // convertir cm a metros

    if (!pesoNum || !alturaNum || pesoNum <= 0 || alturaNum <= 0) {
      Alert.alert('Error', 'Por favor ingresa valores válidos para peso y altura');
      return;
    }

    const imcCalculado = pesoNum / (alturaNum * alturaNum);
    setIMC(parseFloat(imcCalculado.toFixed(1)));

    // Determinar categoría
    let categoria = '';
    if (imcCalculado < 18.5) {
      categoria = 'Bajo peso';
    } else if (imcCalculado < 25) {
      categoria = 'Peso normal';
    } else if (imcCalculado < 30) {
      categoria = 'Sobrepeso';
    } else {
      categoria = 'Obesidad';
    }
    setCategoriaIMC(categoria);
  };

  const resetearCalculadora = () => {
    setPeso('');
    setAltura('');
    setIMC(null);
    setCategoriaIMC('');
  };

  const cerrarModal = () => {
    setShowIMCModal(false);
    resetearCalculadora();
  };

  const getIMCColor = () => {
    if (!imc) return '#666';
    if (imc < 18.5) return '#2196F3';
    if (imc < 25) return '#4CAF50';
    if (imc < 30) return '#FF9800';
    return '#F44336';
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{ paddingVertical: 24, paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Estadísticas semanales */}
        <Surface style={styles.statsContainer} elevation={2}>
          <Text style={styles.sectionTitle}>Resumen semanal</Text>
          <View style={styles.statsGrid}>
            {weeklyStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Icon name={stat.icon} size={28} color={stat.color} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Surface>

        {/* Rutinas recomendadas */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: 'black' }]}>Rutinas de entrenamiento</Text>
          {workoutPlans.map((plan, index) => (
            <Card key={index} style={styles.workoutCard}>
              <Card.Content>
                <View style={styles.workoutHeader}>
                  <View style={styles.workoutIconContainer}>
                    <Icon name={plan.icon} size={32} color="white" />
                  </View>
                  <View style={styles.workoutInfo}>
                    <Text style={styles.workoutTitle}>{plan.title}</Text>
                    <Text style={styles.workoutSubtitle}>{plan.subtitle}</Text>
                  </View>
                  <Chip 
                    style={[styles.difficultyChip, { backgroundColor: getDifficultyColor(plan.difficulty) }]}
                    textStyle={{ color: 'white', fontWeight: 'bold' }}
                  >
                    {plan.difficulty}
                  </Chip>
                </View>
                
                <View style={styles.workoutDetails}>
                  <View style={styles.workoutDetailItem}>
                    <Icon name="clock-outline" size={20} color="#666" />
                    <Text style={styles.workoutDetailText}>{plan.duration}</Text>
                  </View>
                  <View style={styles.workoutDetailItem}>
                    <Icon name="format-list-numbered" size={20} color="#666" />
                    <Text style={styles.workoutDetailText}>{plan.exercises}</Text>
                  </View>
                </View>
              </Card.Content>
              <Card.Actions>
                <View style={styles.cardActionContainer}>
                  {(isActive || timeLeft < 180) && activeRoutineIndex === index && (
                    <View style={styles.timerInfo}>
                      <Icon name="clock-outline" size={20} color="#333" />
                      <Text style={styles.timerInfoText}>
                        {formatTime(timeLeft)}
                      </Text>
                    </View>
                  )}
                  <Button
                    mode="contained-tonal"
                    style={[styles.routineButton, { backgroundColor: '#f5f5dc' }]}
                    textColor="black"
                    onPress={() => iniciarEntrenamiento(index)}
                    icon={() => (
                      <Icon 
                        name={activeRoutineIndex === index && isActive ? "pause" : "play"} 
                        size={20} 
                        color="black" 
                      />
                    )}
                  >
                    {activeRoutineIndex === index && isActive ? 'Pausar' : 
                     activeRoutineIndex === index && timeLeft < 180 ? 'Continuar' : 
                     'Iniciar rutina'}
                  </Button>
                </View>
              </Card.Actions>
            </Card>
          ))}
        </View>

        {/* ...existing code... resto del código igual... */}
        {/* Herramientas adicionales */}
        <Surface style={styles.toolsContainer} elevation={1}>
          <Text style={styles.sectionTitle}>Herramientas</Text>
          <View style={styles.toolsGrid}>
            <Button
              mode="contained-tonal"
              icon={() => <Icon name="calculator" size={24} color="black" />}
              style={styles.toolButton}
              textColor="black"
              onPress={() => setShowIMCModal(true)}
            >
              Calculadora IMC
            </Button>
          </View>
        </Surface>

        {/* Sección de nutrición */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: 'black' }]}>Nutrición personalizada</Text>
          <Card style={styles.nutritionCard}>
            <Card.Content>
              <View style={styles.cardIconHeader}>
                <Icon name="food-apple" size={32} color="black" />
                <View style={styles.cardTextContent}>
                  <Text variant="titleMedium" style={{ color: 'black' }}>
                    Plan alimenticio personalizado
                  </Text>
                  <Text variant="bodySmall" style={{ color: 'black' }}>
                    Alcanza tus objetivos con una dieta equilibrada
                  </Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained-tonal"
                style={{ backgroundColor: '#f5f5dc' }}
                textColor="black"
                onPress={() => navigation.navigate('IAChatList', { chatType: 'nutrition' })}
                icon={() => <Icon name="chat" size={20} color="black" />}
              >
                Consultar nutricionista IA
              </Button>
            </Card.Actions>
          </Card>
        </View>
        
        {/* Sección de entrenamiento personalizado */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: 'black' }]}>Entrenamiento personalizado</Text>
          <Card style={styles.nutritionCard}>
            <Card.Content>
              <View style={styles.cardIconHeader}>
                <Icon name="account-supervisor" size={32} color="black" />
                <View style={styles.cardTextContent}>
                  <Text variant="titleMedium" style={{ color: 'black' }}>
                    Plan de entrenamiento personalizado
                  </Text>
                  <Text variant="bodySmall" style={{ color: 'black' }}>
                    Diseña tu entrenamiento basado en tu anatomía
                  </Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained-tonal"
                style={{ backgroundColor: '#f5f5dc' }}
                textColor="black"
                onPress={() => navigation.navigate('IAChatList', { chatType: 'training' })}
                icon={() => <Icon name="robot" size={20} color="black" />}
              >
                Consultar entrenador IA
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </ScrollView>

      {/* Modal del Timer de Entrenamiento */}
      <Portal>
        <Modal
          visible={showTimer}
          onDismiss={cerrarTimer}
          contentContainerStyle={styles.timerModalContainer}
        >
          <Card style={styles.timerCard}>
            <Card.Title
              title="Entrenamiento en Progreso"
              subtitle="Mantén el ritmo y concéntrate"
              titleStyle={{ color: 'black', fontWeight: 'bold' }}
              subtitleStyle={{ color: '#666' }}
              left={(props) => <Icon {...props} name="dumbbell" size={32} color="#ffa500" />}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="close"
                  onPress={cerrarTimer}
                  iconColor="#666"
                />
              )}
            />
            
            <Card.Content style={styles.timerContent}>
              <View style={styles.timerDisplay}>
                <Text style={[styles.timerText, { color: getTimerColor() }]}>
                  {formatTime(timeLeft)}
                </Text>
                <Text style={styles.timerLabel}>
                  {timeLeft > 60 ? 'Tiempo restante' : '¡Último minuto!'}
                </Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${((180 - timeLeft) / 180) * 100}%`,
                        backgroundColor: getTimerColor()
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(((180 - timeLeft) / 180) * 100)}% completado
                </Text>
              </View>

              <View style={styles.motivationalContainer}>
                <Icon name="fire" size={24} color="#FF4444" />
                <Text style={styles.motivationalText}>
                  {timeLeft > 120 ? '¡Empezamos fuerte!' : 
                   timeLeft > 60 ? '¡Vas por buen camino!' : 
                   '¡Último esfuerzo!'}
                </Text>
              </View>
            </Card.Content>
            
            <Card.Actions style={styles.timerActions}>
              <Button
                mode="outlined"
                onPress={resetTimer}
                style={styles.timerActionButton}
                textColor="#666"
                icon={() => <Icon name="restart" size={20} color="#666" />}
              >
                Reiniciar
              </Button>
              <Button
                mode="contained"
                onPress={toggleTimer}
                style={[styles.timerActionButton, { backgroundColor: isActive ? '#FF9800' : '#4CAF50' }]}
                textColor="white"
                icon={() => <Icon name={isActive ? "pause" : "play"} size={20} color="white" />}
              >
                {isActive ? 'Pausar' : 'Continuar'}
              </Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>

      {/* Modal de Calculadora IMC */}
      <Portal>
        <Modal
          visible={showIMCModal}
          onDismiss={cerrarModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Card style={styles.imcCard}>
            <Card.Title
              title="Calculadora de IMC"
              subtitle="Índice de Masa Corporal"
              titleStyle={{ color: 'black', fontWeight: 'bold' }}
              subtitleStyle={{ color: '#666' }}
              left={(props) => <Icon {...props} name="calculator" size={32} color="#ffa500" />}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="close"
                  onPress={cerrarModal}
                  iconColor="#666"
                />
              )}
            />
            
            <Card.Content>
              <TextInput
                label="Peso (kg)"
                value={peso}
                onChangeText={setPeso}
                keyboardType="numeric"
                mode="outlined"
                style={styles.inputField}
                activeOutlineColor="#ffa500"
                textColor="black"
                left={<TextInput.Icon icon="weight" iconColor="black" />}
              />

              <TextInput
                label="Altura (cm)"
                value={altura}
                onChangeText={setAltura}
                keyboardType="numeric"
                mode="outlined"
                style={styles.inputField}
                activeOutlineColor="#ffa500"
                textColor="black"
                left={<TextInput.Icon icon="human-male-height" iconColor="black" />}
              />

              {imc && (
                <Surface style={[styles.resultadoContainer, { borderLeftColor: getIMCColor() }]} elevation={1}>
                  <View style={styles.resultadoHeader}>
                    <Icon name="chart-line" size={32} color="black" />
                    <View style={styles.resultadoTexto}>
                      <Text style={[styles.imcValor, { color: 'black' }]}>
                        IMC: {imc}
                      </Text>
                      <Text style={[styles.categoriaTexto, { color: 'black' }]}>
                        {categoriaIMC}
                      </Text>
                    </View>
                  </View>
                    
                    <View style={styles.referenciasContainer}>
                      <Text style={styles.referenciasTitle}>Referencias:</Text>
                      <View style={styles.referenciaItem}>
                        <View style={[styles.colorIndicator, { backgroundColor: '#2196F3' }]} />
                        <Text style={styles.referenciaTexto}>Bajo peso: &lt; 18.5</Text>
                      </View>
                      <View style={styles.referenciaItem}>
                        <View style={[styles.colorIndicator, { backgroundColor: '#4CAF50' }]} />
                        <Text style={styles.referenciaTexto}>Normal: 18.5 - 24.9</Text>
                      </View>
                      <View style={styles.referenciaItem}>
                        <View style={[styles.colorIndicator, { backgroundColor: '#FF9800' }]} />
                        <Text style={styles.referenciaTexto}>Sobrepeso: 25 - 29.9</Text>
                      </View>
                      <View style={styles.referenciaItem}>
                        <View style={[styles.colorIndicator, { backgroundColor: '#F44336' }]} />
                        <Text style={styles.referenciaTexto}>Obesidad: ≥ 30</Text>
                      </View>
                    </View>
                  </Surface>
                )}
              </Card.Content>
              
              <Card.Actions style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={resetearCalculadora}
                  style={styles.actionButton}
                  textColor="#666"
                >
                  Limpiar
                </Button>
                <Button
                  mode="contained"
                  onPress={calcularIMC}
                  style={[styles.actionButton, { backgroundColor: '#ffa500' }]}
                  textColor="white"
                  icon={() => <Icon name="calculator" size={20} color="white" />}
                >
                  Calcular
                </Button>
              </Card.Actions>
            </Card>
        </Modal>
      </Portal>

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

// ...existing code... estilos igual...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
  },
  scrollView: {
    flex: 1,
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
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    minWidth: '45%',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: 'black',
  },
  statLabel: {
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
    fontSize: 12,
  },
  workoutCard: {
    marginVertical: 8,
    backgroundColor: '#ffa500'
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#b8860b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  workoutSubtitle: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  difficultyChip: {
    marginLeft: 8,
  },
  workoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  workoutDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutDetailText: {
    marginLeft: 6,
    color: '#333',
    fontWeight: '500',
  },
  toolsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffa500'
  },
  toolsGrid: {
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    flexWrap: 'wrap',
  },
  toolButton: {
    backgroundColor: '#f5f5dc',
    marginHorizontal: 4,
    marginVertical: 4,
    minWidth: '45%',
  },
  cardIconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContent: {
    marginLeft: 12,
    flex: 1,
  },
  // Nuevos estilos para el timer en las cards
  cardActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  timerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  timerInfoText: {
    marginLeft: 6,
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  routineButton: {
    flex: 1,
    maxWidth: 150,
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
  // Estilos para el modal de IMC
  modalContainer: {
    margin: 20,
    backgroundColor: 'transparent',
  },
  imcCard: {
    backgroundColor: '#f5f5dc',
    borderRadius: 12,
  },
  inputField: {
    marginVertical: 8,
    backgroundColor: 'white',
  },
  imcValor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black', 
  },
  categoriaTexto: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    color: 'black', 
  },
  resultadoContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  resultadoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultadoTexto: {
    marginLeft: 12,
    flex: 1,
  },
  referenciasContainer: {
    marginTop: 12,
  },
  referenciasTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  referenciaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  referenciaTexto: {
    fontSize: 12,
    color: '#666',
  },
  modalActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  // Estilos para el timer
  timerModalContainer: {
    margin: 20,
    backgroundColor: 'transparent',
  },
  timerCard: {
    backgroundColor: '#f5f5dc',
    borderRadius: 12,
  },
  timerContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontWeight: '600',
  },
  motivationalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  motivationalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  timerActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  timerActionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});