import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Surface, SegmentedButtons, Card, DataTable, Button, List, Divider, ProgressBar, Portal, Modal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


export default function ProgressScreen() {
  const navigation = useNavigation();
  const [timeRange, setTimeRange] = useState('week');

  const userStats = {
    totalWorkouts: 25,
    totalCalories: 3200,
    totalHours: 6.5,
    streak: 7,
    progressPercent: 0.75,
    nextGoal: 'Completar 30 entrenamientos',
  };

  const workoutHistory = [
    { date: '2024-01-15', type: 'Full Body', duration: '60 min', calories: 450 },
    { date: '2024-01-14', type: 'Cardio', duration: '45 min', calories: 350 },
    { date: '2024-01-12', type: 'Piernas', duration: '50 min', calories: 400 },
  ];

  const personalRecords = [
    { exercise: 'Press Banca', weight: '80 kg', date: '2024-01-10', improvement: '+5kg' },
    { exercise: 'Sentadilla', weight: '100 kg', date: '2024-01-08', improvement: '+7.5kg' },
    { exercise: 'Peso Muerto', weight: '120 kg', date: '2024-01-15', improvement: '+10kg' },
  ];

  const achievements = [
    { title: '¡Primera semana completada!', description: 'Has completado tu primera semana de entrenamiento', icon: 'trophy', earned: true },
    { title: 'Maestro del peso', description: 'Has superado tu récord personal en press banca', icon: 'weight-lifter', earned: true },
    { title: 'Corredor constante', description: '5 sesiones de cardio completadas', icon: 'run', earned: false },
  ];

  const onShareProgress = () => {
    alert('Función de compartir progreso aún no implementada.');
  };

  return (
    <View style={styles.container}>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Streak */}
        <Surface style={styles.headerContainer} elevation={2}>
          <View style={styles.streakContainer}>
            <Icon name="fire" size={28} color="#d2691e" />
            <Text style={styles.streakText}>{userStats.streak} días seguidos</Text>
          </View>
        </Surface>

        {/* Time Range Selector */}
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
              secondaryContainer: '#ff8c00',
              onSecondaryContainer: '#000',
              primary: '#000',
              onSurface: '#000',
              outline: '#d2691e',
            },
          }}
        />

        {/* Progress Summary */}
        <Surface style={styles.progressSummary} elevation={2}>
          <Text style={styles.summaryTitle}>¡Estás mejorando!</Text>
          <Text style={styles.summaryText}>Has completado el {Math.round(userStats.progressPercent * 100)}% de tu objetivo semanal.</Text>
          <ProgressBar progress={userStats.progressPercent} color="#d2691e" style={{ height: 10, borderRadius: 5, marginTop: 8 }} />
          <Text style={styles.nextGoal}>Siguiente meta: {userStats.nextGoal}</Text>
          <Button 
            mode="outlined" 
            onPress={onShareProgress} 
            textColor="#d2691e" 
            style={styles.shareButton}
            uppercase={false}
          >
            Compartir progreso
          </Button>
        </Surface>

        {/* Key Stats */}
        <Surface style={styles.statsContainer} elevation={3}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="fire" size={32} color="#d2691e" />
              <Text style={styles.statValue}>{userStats.totalCalories}</Text>
              <Text style={styles.statLabel}>Calorías</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon name="clock-outline" size={32} color="#d2691e" />
              <Text style={styles.statValue}>{userStats.totalHours}h</Text>
              <Text style={styles.statLabel}>Tiempo Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon name="dumbbell" size={32} color="#d2691e" />
              <Text style={styles.statValue}>{userStats.totalWorkouts}</Text>
              <Text style={styles.statLabel}>Entrenamientos</Text>
            </View>
          </View>
        </Surface>

        {/* Achievements */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Logros Desbloqueados</Text>
            <List.Section>
              {achievements.map((ach, i) => (
                <List.Item
                  key={i}
                  title={ach.title}
                  titleStyle={{ color: '#000', fontWeight: '700' }}
                  description={ach.description}
                  descriptionStyle={{ color: '#000' }}
                  left={props => (
                    <List.Icon {...props} icon={ach.icon} color={ach.earned ? "#d2691e" : "#a9a9a9"} />
                  )}
                />
              ))}
            </List.Section>
          </Card.Content>
        </Card>

        {/* Personal Records */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Récords Personales</Text>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title textStyle={{ color: '#000', fontWeight: '700' }}>Ejercicio</DataTable.Title>
                <DataTable.Title numeric textStyle={{ color: '#000', fontWeight: '700' }}>Peso</DataTable.Title>
                <DataTable.Title numeric textStyle={{ color: '#000', fontWeight: '700' }}>Mejora</DataTable.Title>
              </DataTable.Header>
              {personalRecords.map((record, i) => (
                <DataTable.Row key={i}>
                  <DataTable.Cell textStyle={{ color: '#000' }}>{record.exercise}</DataTable.Cell>
                  <DataTable.Cell numeric textStyle={{ color: '#000' }}>{record.weight}</DataTable.Cell>
                  <DataTable.Cell numeric textStyle={{ fontWeight: '700', color: '#228B22' }}>
                    {record.improvement}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card.Content>
        </Card>

        {/* Workout History */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Historial de Entrenamientos</Text>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title textStyle={{ color: '#000', fontWeight: '700' }}>Fecha</DataTable.Title>
                <DataTable.Title textStyle={{ color: '#000', fontWeight: '700' }}>Tipo</DataTable.Title>
                <DataTable.Title numeric textStyle={{ color: '#000', fontWeight: '700' }}>Duración</DataTable.Title>
                <DataTable.Title numeric textStyle={{ color: '#000', fontWeight: '700' }}>Calorías</DataTable.Title>
              </DataTable.Header>
              {workoutHistory.map((workout, i) => (
                <DataTable.Row key={i}>
                  <DataTable.Cell textStyle={{ color: '#000' }}>{workout.date}</DataTable.Cell>
                  <DataTable.Cell textStyle={{ color: '#000' }}>{workout.type}</DataTable.Cell>
                  <DataTable.Cell numeric textStyle={{ color: '#000' }}>{workout.duration}</DataTable.Cell>
                  <DataTable.Cell numeric textStyle={{ color: '#000' }}>{workout.calories}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
            <Button
              mode="contained"
              onPress={() => {}}
              style={styles.viewMoreButton}
              buttonColor="#d2691e"
              textColor="#000"
              uppercase={false}
            >
              Ver más
            </Button>
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
  header: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerContainer: {
    marginVertical: 16,
    paddingVertical: 16,
    backgroundColor: '#ff8c00',
    elevation: 2,
    borderRadius: 0,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  segmentedButtons: {
    marginHorizontal: 16,
    backgroundColor: '#f5f5dc',
    borderRadius: 0,
    marginBottom: 12,
  },
  progressSummary: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    elevation: 2,
    borderRadius: 0,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#d2691e',
  },
  summaryText: {
    fontSize: 16,
    marginTop: 6,
    color: '#000',
  },
  nextGoal: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#d2691e',
  },
  shareButton: {
    marginTop: 14,
    borderRadius: 0,
    borderColor: '#d2691e',
    borderWidth: 1,
  },
  statsContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#ff8c00',
    elevation: 3,
    borderRadius: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 12,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 10,
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 20,
    elevation: 2,
    borderRadius: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  dataHeader: {
    color: '#000',
    fontWeight: '700',
  },
  viewMoreButton: {
    marginTop: 16,
    borderRadius: 0,
  },
  achievementTitle: {
    color: '#000',
    fontWeight: '700',
  },
  achievementDescription: {
    color: '#000',
  },
  achievementLocked: {
    color: '#a9a9a9',
  },
  improvement: {
    color: '#228B22',
  },
});
