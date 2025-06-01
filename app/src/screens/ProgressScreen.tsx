import React, { useState, useLayoutEffect } from 'react'; // Agregué useLayoutEffect
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Share } from 'react-native';
import { Surface, SegmentedButtons, Card, DataTable, Button, List, Divider, ProgressBar, Portal, Modal, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function ProgressScreen() {
  const navigation = useNavigation();
  const [timeRange, setTimeRange] = useState('week');

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

  // Función para obtener datos dinámicos según el período
  const getStatsForPeriod = (period: string) => {
    switch (period) {
      case 'week':
        return {
          totalWorkouts: 4,
          totalCalories: 1800,
          totalHours: 3.2,
          streak: 7,
          progressPercent: 0.75,
          nextGoal: 'Completar 5 entrenamientos esta semana',
          periodLabel: 'Esta semana'
        };
      case 'month':
        return {
          totalWorkouts: 16,
          totalCalories: 7200,
          totalHours: 12.8,
          streak: 7,
          progressPercent: 0.64,
          nextGoal: 'Completar 20 entrenamientos este mes',
          periodLabel: 'Este mes'
        };
      case 'year':
        return {
          totalWorkouts: 156,
          totalCalories: 78000,
          totalHours: 124.8,
          streak: 7,
          progressPercent: 0.52,
          nextGoal: 'Completar 200 entrenamientos este año',
          periodLabel: 'Este año'
        };
      default:
        return {
          totalWorkouts: 4,
          totalCalories: 1800,
          totalHours: 3.2,
          streak: 7,
          progressPercent: 0.75,
          nextGoal: 'Completar 5 entrenamientos esta semana',
          periodLabel: 'Esta semana'
        };
    }
  };

  const getWorkoutHistoryForPeriod = (period: string) => {
    switch (period) {
      case 'week':
        return [
          { date: '15/01/2024', type: 'Full Body', duration: '60 min', calories: 450 },
          { date: '14/01/2024', type: 'Cardio', duration: '45 min', calories: 350 },
          { date: '12/01/2024', type: 'Piernas', duration: '50 min', calories: 400 },
          { date: '10/01/2024', type: 'Espalda', duration: '55 min', calories: 420 },
        ];
      case 'month':
        return [
          { date: 'Semana 3', type: 'Promedio', duration: '52 min', calories: 415 },
          { date: 'Semana 2', type: 'Promedio', duration: '48 min', calories: 380 },
          { date: 'Semana 1', type: 'Promedio', duration: '55 min', calories: 425 },
        ];
      case 'year':
        return [
          { date: 'Diciembre', type: 'Promedio', duration: '50 min', calories: 400 },
          { date: 'Noviembre', type: 'Promedio', duration: '45 min', calories: 385 },
          { date: 'Octubre', type: 'Promedio', duration: '52 min', calories: 410 },
          { date: 'Septiembre', type: 'Promedio', duration: '48 min', calories: 395 },
        ];
      default:
        return [];
    }
  };

  const getPersonalRecordsForPeriod = (period: string) => {
    switch (period) {
      case 'week':
        return [
          { exercise: 'Press Banca', weight: '80 kg', date: '10/01/2024', improvement: '+2.5kg' },
          { exercise: 'Sentadilla', weight: '100 kg', date: '12/01/2024', improvement: '+5kg' },
        ];
      case 'month':
        return [
          { exercise: 'Press Banca', weight: '80 kg', date: '10/01/2024', improvement: '+7.5kg' },
          { exercise: 'Sentadilla', weight: '100 kg', date: '08/01/2024', improvement: '+10kg' },
          { exercise: 'Peso Muerto', weight: '120 kg', date: '15/01/2024', improvement: '+15kg' },
        ];
      case 'year':
        return [
          { exercise: 'Press Banca', weight: '80 kg', date: 'Enero 2024', improvement: '+20kg' },
          { exercise: 'Sentadilla', weight: '100 kg', date: 'Marzo 2024', improvement: '+25kg' },
          { exercise: 'Peso Muerto', weight: '120 kg', date: 'Mayo 2024', improvement: '+30kg' },
          { exercise: 'Dominadas', weight: '+15 kg', date: 'Julio 2024', improvement: '+15kg' },
        ];
      default:
        return [];
    }
  };

  const getAchievementsForPeriod = (period: string) => {
    const baseAchievements = [
      { title: '¡Primera semana completada!', description: 'Has completado tu primera semana de entrenamiento', icon: 'trophy', earned: true },
      { title: 'Maestro del peso', description: 'Has superado tu récord personal en press banca', icon: 'weight-lifter', earned: true },
      { title: 'Corredor constante', description: '5 sesiones de cardio completadas', icon: 'run', earned: false },
    ];

    if (period === 'year') {
      return [
        ...baseAchievements,
        { title: 'Atleta del año', description: 'Has completado más de 150 entrenamientos', icon: 'medal', earned: true },
        { title: 'Máquina de quemar calorías', description: 'Has quemado más de 75,000 calorías', icon: 'fire', earned: true },
      ];
    }

    return baseAchievements;
  };

  // Obtener datos dinámicos
  const currentStats = getStatsForPeriod(timeRange);
  const currentWorkoutHistory = getWorkoutHistoryForPeriod(timeRange);
  const currentPersonalRecords = getPersonalRecordsForPeriod(timeRange);
  const currentAchievements = getAchievementsForPeriod(timeRange);

  const onShareProgress = async () => {
    try {
      const message = `¡Mira mi progreso en el gym!\n\n${currentStats.periodLabel}:\n- Entrenamientos: ${currentStats.totalWorkouts}\n- Calorías: ${currentStats.totalCalories}\n- Tiempo total: ${currentStats.totalHours}h\n- Racha: ${currentStats.streak} días\n\nSiguiente meta: ${currentStats.nextGoal}`;
      await Share.share({
        message,
      });
    } catch (error) {
      alert('No se pudo compartir el progreso.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Header Section - Estilo como Hero Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Tu progreso</Text>
            <Text style={styles.headerSubtitle}>Sigue mejorando cada día</Text>
          </View>
          <View style={styles.headerIcon}>
            <Icon name="trending-up" size={32} color="#ffa500" />
          </View>
        </View>

        {/* Streak Card - Solo se muestra en vista semanal */}
        {timeRange === 'week' && (
          <Card style={styles.streakCard}>
            <Card.Content style={styles.streakContent}>
              <View style={styles.streakContainer}>
                <View style={styles.streakIconContainer}>
                  <Icon name="fire" size={28} color="#ffa500" />
                </View>
                <View style={styles.streakInfo}>
                  <Text style={styles.streakValue}>{currentStats.streak} días</Text>
                  <Text style={styles.streakLabel}>Racha actual</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Time Range Selector */}
        <View style={styles.selectorSection}>
          <Text style={styles.sectionTitle}>Período de tiempo</Text>
          <SegmentedButtons
            value={timeRange}
            onValueChange={setTimeRange}
            buttons={[
              { value: 'week', label: 'Semana' },
              { value: 'month', label: 'Mes' },
              { value: 'year', label: 'Año' },
            ]}
            style={styles.segmentedButtons}
            theme={{
              colors: {
                secondaryContainer: '#ffa500',
                onSecondaryContainer: '#000',
                primary: '#000',
                onSurface: '#000',
                outline: '#ffa500',
              },
            }}
          />
        </View>

        {/* Progress Summary */}
        <Card style={styles.progressCard}>
          <Card.Content style={styles.progressContent}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>¡Estás mejorando!</Text>
              <Icon name="chart-line" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.progressText}>
              Has completado el {Math.round(currentStats.progressPercent * 100)}% de tu objetivo {timeRange === 'week' ? 'semanal' : timeRange === 'month' ? 'mensual' : 'anual'}.
            </Text>
            <ProgressBar 
              progress={currentStats.progressPercent} 
              color="#ffa500" 
              style={styles.progressBar}
            />
            <Text style={styles.nextGoal}>Siguiente meta: {currentStats.nextGoal}</Text>
            <Button 
              mode="outlined" 
              onPress={onShareProgress} 
              style={styles.shareButton}
              labelStyle={styles.shareButtonText}
              icon={() => <Icon name="share" size={16} color="#ffa500" />}
            >
              Compartir progreso
            </Button>
          </Card.Content>
        </Card>

        {/* Key Stats */}
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsContent}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>{currentStats.periodLabel}</Text>
              <Icon name="chart-box" size={24} color="#ffa500" />
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <View style={styles.statIconContainer}>
                  <Icon name="fire" size={20} color="#ffa500" />
                </View>
                <Text style={styles.statValue}>{currentStats.totalCalories.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Calorías</Text>
              </View>
              <View style={styles.statBox}>
                <View style={styles.statIconContainer}>
                  <Icon name="clock-outline" size={20} color="#ffa500" />
                </View>
                <Text style={styles.statValue}>{currentStats.totalHours}h</Text>
                <Text style={styles.statLabel}>Tiempo Total</Text>
              </View>
              <View style={styles.statBox}>
                <View style={styles.statIconContainer}>
                  <Icon name="dumbbell" size={20} color="#ffa500" />
                </View>
                <Text style={styles.statValue}>{currentStats.totalWorkouts}</Text>
                <Text style={styles.statLabel}>Entrenamientos</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Logros {timeRange === 'week' ? 'de la Semana' : timeRange === 'month' ? 'del Mes' : 'del Año'}
          </Text>
          <Card style={styles.achievementsCard}>
            <Card.Content style={styles.achievementsContent}>
              {currentAchievements.map((ach, i) => (
                <React.Fragment key={i}>
                  <View style={styles.achievementItem}>
                    <View style={styles.achievementIconContainer}>
                      <Icon 
                        name={ach.icon} 
                        size={24} 
                        color={ach.earned ? "#ffa500" : "#999"} 
                      />
                    </View>
                    <View style={styles.achievementInfo}>
                      <Text style={[styles.achievementTitle, { opacity: ach.earned ? 1 : 0.5 }]}>
                        {ach.title}
                      </Text>
                      <Text style={[styles.achievementDescription, { opacity: ach.earned ? 1 : 0.5 }]}>
                        {ach.description}
                      </Text>
                    </View>
                  </View>
                  {i < currentAchievements.length - 1 && <Divider style={styles.divider} />}
                </React.Fragment>
              ))}
            </Card.Content>
          </Card>
        </View>

        {/* Personal Records */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Récords {timeRange === 'week' ? 'de la Semana' : timeRange === 'month' ? 'del Mes' : 'del Año'}
          </Text>
          <Card style={styles.recordsCard}>
            <Card.Content style={styles.recordsContent}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title textStyle={styles.tableHeader}>Ejercicio</DataTable.Title>
                  <DataTable.Title numeric textStyle={styles.tableHeader}>Peso</DataTable.Title>
                  <DataTable.Title numeric textStyle={styles.tableHeader}>Mejora</DataTable.Title>
                </DataTable.Header>
                {currentPersonalRecords.map((record, i) => (
                  <DataTable.Row key={i}>
                    <DataTable.Cell textStyle={styles.tableCell}>{record.exercise}</DataTable.Cell>
                    <DataTable.Cell numeric textStyle={styles.tableCell}>{record.weight}</DataTable.Cell>
                    <DataTable.Cell numeric textStyle={styles.improvementCell}>
                      {record.improvement}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </Card.Content>
          </Card>
        </View>

        {/* Workout History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Historial {timeRange === 'week' ? 'Semanal' : timeRange === 'month' ? 'Mensual' : 'Anual'}
          </Text>
          <Card style={styles.historyCard}>
            <Card.Content style={styles.historyContent}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title textStyle={styles.tableHeader}>
                    {timeRange === 'week' ? 'Fecha' : 'Período'}
                  </DataTable.Title>
                  <DataTable.Title textStyle={styles.tableHeader}>Tipo</DataTable.Title>
                  <DataTable.Title numeric textStyle={styles.tableHeader}>Duración</DataTable.Title>
                  <DataTable.Title numeric textStyle={styles.tableHeader}>Calorías</DataTable.Title>
                </DataTable.Header>
                {currentWorkoutHistory.map((workout, i) => (
                  <DataTable.Row key={i}>
                    <DataTable.Cell textStyle={styles.tableCell}>{workout.date}</DataTable.Cell>
                    <DataTable.Cell textStyle={styles.tableCell}>{workout.type}</DataTable.Cell>
                    <DataTable.Cell numeric textStyle={styles.tableCell}>{workout.duration}</DataTable.Cell>
                    <DataTable.Cell numeric textStyle={styles.tableCell}>{workout.calories}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
              <Button
                mode="contained"
                onPress={() => {}}
                style={styles.viewMoreButton}
                labelStyle={styles.viewMoreButtonText}
              >
                Ver historial completo
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc', 
  },
  scrollContainer: {
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

  // Header Button
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
  selectorSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  // Streak Card
  streakCard: {
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
  streakContent: {
    padding: 20,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 0, 
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  streakInfo: {
    flex: 1,
  },
  streakValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  streakLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },

  // Segmented Buttons
  segmentedButtons: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
  },

  // Progress Card
  progressCard: {
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
  progressContent: {
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 0, 
    marginBottom: 12,
  },
  nextGoal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffa500',
    marginBottom: 16,
  },
  shareButton: {
    borderColor: '#ffa500',
    borderRadius: 0,
    alignSelf: 'flex-start',
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffa500',
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

  // Achievements Card
  achievementsCard: {
    marginHorizontal: 20,
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
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666666',
  },

  // Records and History Cards
  recordsCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 0, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  recordsContent: {
    padding: 20,
  },
  historyCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  historyContent: {
    padding: 20,
  },
  tableHeader: {
    color: '#1A1A1A',
    fontWeight: '700',
    fontSize: 14,
  },
  tableCell: {
    color: '#1A1A1A',
    fontSize: 14,
  },
  improvementCell: {
    fontWeight: '700',
    color: '#4CAF50',
    fontSize: 14,
  },
  viewMoreButton: {
    backgroundColor: '#ffa500',
    borderRadius: 0, 
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  viewMoreButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },

  // Divider
  divider: {
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
});