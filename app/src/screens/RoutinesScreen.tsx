import React, { useState, useEffect, useLayoutEffect } from 'react'; // Agregué useLayoutEffect
import { View, StyleSheet, ScrollView, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
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
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RoutinesScreen() {
  const navigation = useNavigation<NavigationProp>();


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
  
  // Estados para la calculadora de IMC
  const [showIMCModal, setShowIMCModal] = useState(false);
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setIMC] = useState<number | null>(null);
  const [categoriaIMC, setCategoriaIMC] = useState('');

  // Estados para el contador de entrenamiento
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isActive, setIsActive] = useState(false);
  const [activeRoutineIndex, setActiveRoutineIndex] = useState<number | null>(null);

  const weeklyStats = [
    { icon: 'fire', value: '2,450', label: 'Calorías quemadas', color: '#ffa500' },
    { icon: 'clock-outline', value: '8.5h', label: 'Tiempo total', color: '#ffa500' },
    { icon: 'dumbbell', value: '12', label: 'Entrenamientos', color: '#ffa500' },
    { icon: 'trophy', value: '95%', label: 'Objetivos cumplidos', color: '#ffa500' },
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
      setActiveRoutineIndex(routineIndex);
      setShowTimer(true);
      setTimeLeft(180);
      setIsActive(true);
    } else if (activeRoutineIndex === routineIndex) {
      toggleTimer();
    } else {
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
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 120) return '#4CAF50';
    if (timeLeft > 60) return '#FF9800';
    return '#F44336';
  };

  // Funciones para IMC
  const calcularIMC = () => {
    Keyboard.dismiss(); 
    
    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura) / 100;

    if (!pesoNum || !alturaNum || pesoNum <= 0 || alturaNum <= 0) {
      Alert.alert('Error', 'Por favor ingresa valores válidos para peso y altura');
      return;
    }

    const imcCalculado = pesoNum / (alturaNum * alturaNum);
    setIMC(parseFloat(imcCalculado.toFixed(1)));

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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section - Estilo Hero Section como otras pantallas */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Rutinas de entrenamiento</Text>
            <Text style={styles.headerSubtitle}>Encuentra tu rutina perfecta</Text>
          </View>
          <View style={styles.headerIcon}>
            <Icon name="dumbbell" size={32} color="#ffa500" />
          </View>
        </View>

        {/* Estadísticas semanales */}
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsContent}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Resumen semanal</Text>
              <Icon name="chart-box" size={24} color="#ffa500" />
            </View>
            <View style={styles.statsGrid}>
              {weeklyStats.map((stat, index) => (
                <View key={index} style={styles.statBox}>
                  <View style={styles.statIconContainer}>
                    <Icon name={stat.icon} size={20} color="#ffa500" />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Rutinas de entrenamiento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rutinas disponibles</Text>
          {workoutPlans.map((plan, index) => (
            <Card key={index} style={styles.workoutCard}>
              <Card.Content style={styles.workoutCardContent}>
                <View style={styles.workoutHeader}>
                  <View style={styles.workoutIconContainer}>
                    <Icon name={plan.icon} size={24} color="#ffa500" />
                  </View>
                  <View style={styles.workoutInfo}>
                    <Text style={styles.workoutTitle}>{plan.title}</Text>
                    <Text style={styles.workoutSubtitle}>{plan.subtitle}</Text>
                  </View>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(plan.difficulty) }]}>
                    <Text style={styles.difficultyText}>{plan.difficulty}</Text>
                  </View>
                </View>
                
                <View style={styles.workoutDetails}>
                  <View style={styles.workoutDetailItem}>
                    <Icon name="clock-outline" size={18} color="#666" />
                    <Text style={styles.workoutDetailText}>{plan.duration}</Text>
                  </View>
                  <View style={styles.workoutDetailItem}>
                    <Icon name="format-list-numbered" size={18} color="#666" />
                    <Text style={styles.workoutDetailText}>{plan.exercises}</Text>
                  </View>
                </View>

                {(isActive || timeLeft < 180) && activeRoutineIndex === index && (
                  <View style={styles.timerInfo}>
                    <Icon name="clock-outline" size={18} color="#ffa500" />
                    <Text style={styles.timerInfoText}>
                      Tiempo restante: {formatTime(timeLeft)}
                    </Text>
                  </View>
                )}
              </Card.Content>

              <Card.Actions style={styles.workoutCardActions}>
                <Button
                  mode="contained"
                  style={styles.startButton}
                  labelStyle={styles.startButtonText}
                  icon={() => (
                    <Icon 
                      name={activeRoutineIndex === index && isActive ? "pause" : "play"} 
                      size={16} 
                      color="#000000" 
                    />
                  )}
                  onPress={() => iniciarEntrenamiento(index)}
                >
                  {activeRoutineIndex === index && isActive ? 'PAUSAR' : 
                   activeRoutineIndex === index && timeLeft < 180 ? 'CONTINUAR' : 
                   'INICIAR RUTINA'}
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>

        {/* Herramientas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Herramientas útiles</Text>
          <Card style={styles.toolsCard}>
            <Card.Content style={styles.toolsContent}>
              <View style={styles.toolHeader}>
                <View style={styles.toolIconContainer}>
                  <Icon name="calculator" size={24} color="#ffa500" />
                </View>
                <View style={styles.toolInfo}>
                  <Text style={styles.toolTitle}>Calculadora de IMC</Text>
                  <Text style={styles.toolSubtitle}>Calcula tu índice de masa corporal</Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions style={styles.toolCardActions}>
              <Button
                mode="contained"
                style={styles.toolButton}
                labelStyle={styles.toolButtonText}
                icon={() => <Icon name="calculator" size={16} color="#000000" />}
                onPress={() => setShowIMCModal(true)}
              >
                CALCULAR IMC
              </Button>
            </Card.Actions>
          </Card>
        </View>

        {/* Nutrición personalizada */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrición personalizada</Text>
          <Card style={styles.nutritionCard}>
            <Card.Content style={styles.nutritionContent}>
              <View style={styles.nutritionHeader}>
                <View style={styles.nutritionIconContainer}>
                  <Icon name="food-apple" size={24} color="#ffa500" />
                </View>
                <View style={styles.nutritionInfo}>
                  <Text style={styles.nutritionTitle}>Plan alimenticio personalizado</Text>
                  <Text style={styles.nutritionSubtitle}>Alcanza tus objetivos con una dieta equilibrada</Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions style={styles.nutritionCardActions}>
              <Button
                mode="contained"
                style={styles.nutritionButton}
                labelStyle={styles.nutritionButtonText}
                icon={() => <Icon name="chat" size={16} color="#000000" />}
                onPress={() => navigation.navigate('IAChatList', { chatType: 'nutrition' })}
              >
                CONSULTAR IA
              </Button>
            </Card.Actions>
          </Card>
        </View>
        
        {/* Entrenamiento personalizado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entrenamiento personalizado</Text>
          <Card style={styles.trainingCard}>
            <Card.Content style={styles.trainingContent}>
              <View style={styles.trainingHeader}>
                <View style={styles.trainingIconContainer}>
                  <Icon name="account-supervisor" size={24} color="#ffa500" />
                </View>
                <View style={styles.trainingInfo}>
                  <Text style={styles.trainingTitle}>Plan de entrenamiento personalizado</Text>
                  <Text style={styles.trainingSubtitle}>Diseña tu entrenamiento basado en tu anatomía</Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions style={styles.trainingCardActions}>
              <Button
                mode="contained"
                style={styles.trainingButton}
                labelStyle={styles.trainingButtonText}
                icon={() => <Icon name="robot" size={16} color="#000000" />}
                onPress={() => navigation.navigate('IAChatList', { chatType: 'training' })}
              >
                CONSULTAR ENTRENADOR IA
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
              titleStyle={styles.timerModalTitle}
              subtitleStyle={styles.timerModalSubtitle}
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
                <Icon name="fire" size={24} color="#ffa500" />
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
                labelStyle={styles.timerResetButtonText}
                icon={() => <Icon name="restart" size={16} color="#666" />}
              >
                REINICIAR
              </Button>
              <Button
                mode="contained"
                onPress={toggleTimer}
                style={[styles.timerActionButton, { backgroundColor: '#ffa500' }]}
                labelStyle={styles.timerToggleButtonText}
                icon={() => <Icon name={isActive ? "pause" : "play"} size={16} color="#000000" />}
              >
                {isActive ? 'PAUSAR' : 'CONTINUAR'}
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
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View>
              <Card style={styles.imcCard}>
                <Card.Title
                  title="Calculadora de IMC"
                  subtitle="Índice de Masa Corporal"
                  titleStyle={styles.imcModalTitle}
                  subtitleStyle={styles.imcModalSubtitle}
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
                
                <Card.Content style={styles.imcContent}>
                  <TextInput
                    label="Peso (kg)"
                    value={peso}
                    onChangeText={setPeso}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.inputField}
                    activeOutlineColor="#ffa500"
                    textColor="#1A1A1A"
                    left={<TextInput.Icon icon="weight" iconColor="#ffa500" />}
                  />

                  <TextInput
                    label="Altura (cm)"
                    value={altura}
                    onChangeText={setAltura}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.inputField}
                    activeOutlineColor="#ffa500"
                    textColor="#1A1A1A"
                    left={<TextInput.Icon icon="human-male-height" iconColor="#ffa500" />}
                  />

                  {imc && (
                    <View style={[styles.resultadoContainer, { borderLeftColor: getIMCColor() }]}>
                      <View style={styles.resultadoHeader}>
                        <Icon name="chart-line" size={32} color="#ffa500" />
                        <View style={styles.resultadoTexto}>
                          <Text style={styles.imcValor}>
                            IMC: {imc}
                          </Text>
                          <Text style={styles.categoriaTexto}>
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
                    </View>
                  )}
                </Card.Content>
                
                <Card.Actions style={styles.modalActions}>
                  <Button
                    mode="outlined"
                    onPress={resetearCalculadora}
                    style={styles.actionButton}
                    labelStyle={styles.resetButtonText}
                  >
                    LIMPIAR
                  </Button>
                  <Button
                    mode="contained"
                    onPress={calcularIMC}
                    style={[styles.actionButton, { backgroundColor: '#ffa500' }]}
                    labelStyle={styles.calculateButtonText}
                    icon={() => <Icon name="calculator" size={16} color="#000000" />}
                  >
                    CALCULAR
                  </Button>
                </Card.Actions>
              </Card>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Portal>

      {/* Bottom Navigation - Sin el ícono de perfil aquí */}
      <View style={styles.bottomBar}>
        <IconButton
          icon="home"
          size={28}
          iconColor="rgba(255, 255, 255, 0.7)"
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate('HomeScreen')}
        />
        <IconButton
          icon="calendar"
          size={28}
          iconColor="rgba(255, 255, 255, 0.7)"
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate('ClassBooking')}
        />
        <IconButton
          icon="chart-line"
          size={28}
          iconColor="rgba(255, 255, 255, 0.7)"
          style={styles.bottomBarButton}
          onPress={() => navigation.navigate('ProgressScreen')}
        />
        <IconButton
          icon="dumbbell"
          size={28}
          iconColor="#FFFFFF" // Activo porque estamos en RoutinesScreen
          style={styles.bottomBarButton}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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

  // Header Button - Para el ícono de perfil
  headerButton: {
    marginRight: 8,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    marginHorizontal: 20,
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
    flexWrap: 'wrap',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    marginBottom: 8,
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
    fontSize: 16,
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

  // Workout Cards
  workoutCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  workoutCardContent: {
    padding: 20,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 0, 
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  workoutSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 0, 
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  workoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  workoutDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workoutDetailText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  timerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 0, 
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  timerInfoText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'monospace',
  },
  workoutCardActions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'flex-start',
  },
  startButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 2, 
    paddingHorizontal: 12, 
    elevation: 0,
    minWidth: 120,
    alignSelf: 'flex-start',
  },
  startButtonText: {
    fontSize: 12, 
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#000000',
  },

  // Tools Card
  toolsCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  toolsContent: {
    padding: 20,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 0, 
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toolInfo: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  toolSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  toolCardActions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'flex-start',
  },
  toolButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 2, 
    paddingHorizontal: 12,
    elevation: 0,
    alignSelf: 'flex-start',
  },
  toolButtonText: {
    fontSize: 12, 
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#000000',
  },

  // Nutrition Card
  nutritionCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  nutritionContent: {
    padding: 20,
  },
  nutritionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutritionIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nutritionInfo: {
    flex: 1,
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  nutritionSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  nutritionCardActions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'flex-start',
  },
  nutritionButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 2, 
    paddingHorizontal: 12,
    elevation: 0,
    alignSelf: 'flex-start',
  },
  nutritionButtonText: {
    fontSize: 12, 
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#000000',
  },

  // Training Card
  trainingCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  trainingContent: {
    padding: 20,
  },
  trainingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainingIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 0, 
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trainingInfo: {
    flex: 1,
  },
  trainingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  trainingSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  trainingCardActions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'flex-start',
  },
  trainingButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 2, 
    paddingHorizontal: 12, 
    elevation: 0,
    alignSelf: 'flex-start',
  },
  trainingButtonText: {
    fontSize: 12, 
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#000000',
  },

  // Timer Modal
  timerModalContainer: {
    margin: 20,
    backgroundColor: 'transparent',
  },
  timerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
  },
  timerModalTitle: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
  timerModalSubtitle: {
    color: '#666666',
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
    fontSize: 48,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 16,
    color: '#666666',
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
    borderRadius: 0, 
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 0, 
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    fontWeight: '600',
  },
  motivationalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 0, 
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 10,
  },
  motivationalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  timerActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  timerActionButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 2, 
  },
  timerResetButtonText: {
    fontSize: 12, 
    fontWeight: '700',
    color: '#666666',
  },
  timerToggleButtonText: {
    fontSize: 12, 
    fontWeight: '700',
    color: '#000000',
  },

  // IMC Modal
  modalContainer: {
    margin: 20,
    backgroundColor: 'transparent',
  },
  imcCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
  },
  imcModalTitle: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
  imcModalSubtitle: {
    color: '#666666',
  },
  imcContent: {
    padding: 20,
  },
  inputField: {
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
  },
  resultadoContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 0, 
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
  imcValor: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  categoriaTexto: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    color: '#1A1A1A',
  },
  referenciasContainer: {
    marginTop: 12,
  },
  referenciasTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
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
    marginRight: 8,
  },
  referenciaTexto: {
    fontSize: 12,
    color: '#666666',
  },
  modalActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 2,
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666666',
  },
  calculateButtonText: {
    fontSize: 12, 
    fontWeight: '700',
    color: '#000000',
  },

  // Bottom Bar - Estilo idéntico a otras pantallas (sin perfil)
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