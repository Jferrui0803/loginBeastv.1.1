import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Chip, Button, Surface, Searchbar, FAB, Portal, Modal, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: undefined;
  WorkoutDetail: undefined;
};

const routines = [
  {
    id: '1',
    name: 'Full Body',
    difficulty: 'Intermedio',
    duration: '60 min',
    frequency: '3 veces/semana',
    calories: '400-500 kcal',
    muscles: ['Pecho', 'Espalda', 'Piernas'],
    image: require('../../assets/workout.webp'),
  },
  {
    id: '2',
    name: 'Push Pull Legs',
    difficulty: 'Avanzado',
    duration: '75 min',
    frequency: '6 veces/semana',
    calories: '500-600 kcal',
    muscles: ['Pecho', 'Hombros', 'Piernas'],
    image: require('../../assets/workout.webp'),
  },
  // Añade más rutinas aquí
];

export default function RoutinesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const navigation = useNavigation<NavigationProp>();

  const renderRoutineCard = (routine) => (
    <Card style={styles.routineCard} key={routine.id}>
      <Card.Cover source={routine.image} />
      <Card.Content>
        <Text style={styles.routineTitle}>{routine.name}</Text>
        <View style={styles.chipContainer}>
          <Chip 
            icon={() => <Icon name="clock" size={16} color="black" />} 
            style={styles.chip} 
            textStyle={{ color: 'black' }} 
            selectedColor="black">
            {routine.duration}
          </Chip>
          <Chip 
            icon={() => <Icon name="arm-flex" size={16} color="black" />} 
            style={styles.chip} 
            textStyle={{ color: 'black' }} 
            selectedColor="black">
            {routine.difficulty}
          </Chip>
        </View>
        <View style={styles.muscleContainer}>
          {routine.muscles.map((muscle, index) => (
            <Chip 
              key={index}
              style={styles.muscleChip}
              textStyle={styles.muscleChipText}
            >
              {muscle}
            </Chip>
          ))}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button 
          mode="contained"
          onPress={() => setSelectedRoutine(routine)}
          style={{ backgroundColor: '#f5f5dc' }}
          labelStyle={{ color: 'black' }}
        >
          Ver detalles
        </Button>
        
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar rutinas"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: 'all', label: 'Todas' },
          { value: 'beginner', label: 'Principiante' },
          { value: 'intermediate', label: 'Intermedio' },
          { value: 'advanced', label: 'Avanzado' },
        ]}
        style={styles.filterButtons}
        theme={{
            colors: {
            secondaryContainer: '#ffa500',
            onSecondaryContainer: 'black',
            primary: 'black',
            onSurface: 'black',  
            outline: 'black'     
            }
        }}
      />

      <ScrollView style={styles.scrollView}>
        {routines.map(renderRoutineCard)}
      </ScrollView>

      <Portal>
        <Modal
          visible={selectedRoutine !== null}
          onDismiss={() => setSelectedRoutine(null)}
          contentContainerStyle={styles.modalContent}
        >
          {selectedRoutine && (
            <Surface style={styles.modalSurface}>
              <Text style={styles.modalTitle}>{selectedRoutine.name}</Text>
              
              <View style={styles.modalInfo}>
                <Icon name="calendar-clock" size={24} color="#666" />
                <Text style={styles.modalInfoText}>
                  Frecuencia: {selectedRoutine.frequency}
                </Text>
              </View>

              <View style={styles.modalInfo}>
                <Icon name="fire" size={24} color="#666" />
                <Text style={styles.modalInfoText}>
                  Calorías: {selectedRoutine.calories}
                </Text>
              </View>

              <Text style={styles.sectionTitle}>Grupos musculares</Text>
              <View style={styles.muscleContainer}>
                {selectedRoutine.muscles.map((muscle, index) => (
                  <Chip 
                    key={index}
                    style={styles.muscleChip}
                    textStyle={styles.muscleChipText}
                  >
                    {muscle}
                  </Chip>
                ))}
              </View>

              <Button
                mode="contained"
                onPress={() => {
                  setSelectedRoutine(null);
                  // Aquí iría la navegación a la rutina detallada
                }}
                style={styles.modalButton}
              >
                Comenzar rutina
              </Button>
            </Surface>
          )}
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('Crear nueva rutina')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
  },
  searchbar: {
    margin: 16,
    backgroundColor: '#ffa500',
    elevation: 2,
  },
  filterButtons: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  routineCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
    backgroundColor: '#ffa500',
  },
  routineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    color: 'black',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5dc',
  },
  muscleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  muscleChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5dc',
  },
  muscleChipText: {
    fontSize: 12,
    color: 'black',
  },
  modalContent: {
    padding: 20,
  },
  modalSurface: {
    padding: 24,
    backgroundColor: '#ffa500',
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black',
  },
  modalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  modalInfoText: {
    marginLeft: 12,
    fontSize: 16,
    color: 'black',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: 'black',
  },
  modalButton: {
    marginTop: 24,
    backgroundColor: '#f5f5dc',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffa500',
  },
});
