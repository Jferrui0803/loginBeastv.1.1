import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Surface, Text, Card, Badge, IconButton, Button, Portal, Modal, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const GymMapScreen = () => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const exercises = [
    { name: 'Press de Banca', duration: 180, machine: 'PB1' },
    { name: 'Leg Press', duration: 180, machine: 'LP1' },
    { name: 'Lat Pulldown', duration: 180, machine: 'LC1' },
    // Añade más ejercicios según tu rutina
  ];

  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer((timer) => {
          if (timer <= 1) {
            // Pasar al siguiente ejercicio
            if (currentExerciseIndex < exercises.length - 1) {
              setCurrentExerciseIndex(prev => prev + 1);
              return exercises[currentExerciseIndex + 1].duration;
            } else {
              setIsTimerActive(false);
              return 0;
            }
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, currentExerciseIndex]);

  const machines = [
    { id: 'PB1', name: 'Press Banca', isAvailable: true, position: { top: 50, left: 20 } },
    { id: 'LP1', name: 'Leg Press', isAvailable: true, position: { top: 50, left: 100 } },
    { id: 'LC1', name: 'Lat Pulldown', isAvailable: false, position: { top: 120, left: 20 } },
    // Añade más máquinas según tu gimnasio
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMachine = (machine) => (
    <Surface
      key={machine.id}
      style={[styles.machine, machine.position, 
        { backgroundColor: machine.isAvailable ? '#4CAF50' : '#f44336' }]}
      onTouchStart={() => setSelectedMachine(machine)}
    >
      <Text style={styles.machineText}>{machine.name}</Text>
      <Badge size={8} style={styles.statusBadge} />
    </Surface>
  );

  return (
    <View style={styles.container}>
      {/* Timer flotante */}
      {isTimerActive && (
        <Surface style={styles.timerContainer} elevation={4}>
          <Text style={styles.timerText}>
            {exercises[currentExerciseIndex].name}
          </Text>
          <Text style={styles.timerCounter}>
            {formatTime(timer)}
          </Text>
          <ProgressBar 
            progress={timer / exercises[currentExerciseIndex].duration} 
            style={styles.progressBar} 
          />
        </Surface>
      )}

      <ScrollView 
        horizontal={true} 
        maximumZoomScale={2.0} 
        minimumZoomScale={0.5}
      >
        <Surface style={styles.mapContainer} elevation={4}>
          {/* Áreas del gimnasio */}
          <View style={styles.areaContainer}>
            <Text style={styles.areaTitle}>Área de Musculación</Text>
            {machines.map(renderMachine)}
          </View>
        </Surface>
      </ScrollView>

      {/* Modal de detalles de máquina */}
      <Portal>
        <Modal
          visible={selectedMachine !== null}
          onDismiss={() => setSelectedMachine(null)}
          contentContainerStyle={styles.modalContent}
        >
          {selectedMachine && (
            <Card>
              <Card.Title
                title={selectedMachine.name}
                subtitle={selectedMachine.isAvailable ? 'Disponible' : 'En uso'}
                left={(props) => (
                  <Icon 
                    {...props} 
                    name={selectedMachine.isAvailable ? 'check-circle' : 'clock'} 
                    size={24} 
                  />
                )}
              />
              <Card.Content>
                <Text variant="bodyMedium">
                  {selectedMachine.isAvailable 
                    ? 'Puedes usar esta máquina' 
                    : 'Tiempo estimado de espera: 5 min'}
                </Text>
              </Card.Content>
              <Card.Actions>
                {!isTimerActive && selectedMachine.isAvailable && (
                  <Button 
                    mode="contained" 
                    onPress={() => {
                      setTimer(exercises[currentExerciseIndex].duration);
                      setIsTimerActive(true);
                      setSelectedMachine(null);
                    }}
                  >
                    Comenzar ejercicio
                  </Button>
                )}
              </Card.Actions>
            </Card>
          )}
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapContainer: {
    width: Dimensions.get('window').width * 1.5,
    height: Dimensions.get('window').height - 100,
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
  },
  areaContainer: {
    padding: 10,
  },
  areaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black',
  },
  machine: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 4,
  },
  machineText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  timerContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 16,
    borderRadius: 8,
    zIndex: 1000,
    backgroundColor: 'white',
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerCounter: {
    fontSize: 24,
    marginVertical: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  modalContent: {
    padding: 16,
    margin: 16,
  },
});

export default GymMapScreen;