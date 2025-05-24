import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Chip, Button, Surface, Searchbar, Portal, Modal, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ClassType = {
  id: string;
  name: string;
  instructor: string;
  time: string;
  duration: string;
  room: string;
  capacity: number;
  available: number;
  level: string;
  calories: string;
};

const classes: ClassType[] = [
  {
    id: '1',
    name: 'Yoga',
    instructor: 'Ana García',
    time: '10:00',
    duration: '60 min',
    room: 'Sala 1',
    capacity: 20,
    available: 8,
    level: 'Todos los niveles',
    calories: '150-200 kcal'
  },
  {
    id: '2',
    name: 'CrossFit',
    instructor: 'Carlos Ruiz',
    time: '11:30',
    duration: '45 min',
    room: 'Sala CrossFit',
    capacity: 15,
    available: 5,
    level: 'Intermedio',
    calories: '400-600 kcal'
  },
    {
        id: '3',
        name: 'Zumba',
        instructor: 'Laura Martínez',
        time: '12:30',
        duration: '60 min',
        room: 'Sala 2',
        capacity: 25,
        available: 0,
        level: 'Principiante',
        calories: '300-400 kcal'
    },
    {
        id: '4',
        name: 'Pilates',
        instructor: 'Sofía López',
        time: '14:00',
        duration: '60 min',
        room: 'Sala 3',
        capacity: 20,
        available: 10,
        level: 'Todos los niveles',
        calories: '200-300 kcal'
    },
];

export default function ClassBookingScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [visible, setVisible] = useState(false);
  
  const showModal = (classItem: ClassType) => {
    setSelectedClass(classItem);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedClass(null);
  };

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classItem.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

const renderClassCard = (classItem: ClassType) => (
    <Card style={styles.classCard} key={classItem.id}>
        <Card.Content>
            <View style={styles.classHeader}>
            <View>
                <Text variant="titleLarge" style={{ color: 'black' }}>{classItem.name}</Text>
                <Text variant="bodyMedium" style={{ color: 'black' }}>{classItem.instructor}</Text>
            </View>
            <Surface style={styles.timeBadge} elevation={2}>
                <Text style={[styles.timeText, { color: 'black' }]}>{classItem.time}</Text>
            </Surface>
            </View>
            
            <View style={styles.chipContainer}>
            <Chip 
                icon={() => <Icon name="clock" size={20} color="black" />} 
                style={[styles.chip, { backgroundColor: '#f5f5dc' }]} 
                textStyle={{ color: 'black' }}
            >
                {classItem.duration}
            </Chip>
            <Chip 
                icon={() => <Icon name="account-group" size={20} color="black" />} 
                style={[styles.chip, { backgroundColor: '#f5f5dc' }]} 
                textStyle={{ color: 'black' }}
            >
                {classItem.available}/{classItem.capacity}
            </Chip>
            <Chip 
                icon={() => <Icon name="room-service" size={20} color="black" />} 
                style={[styles.chip, { backgroundColor: '#f5f5dc' }]} 
                textStyle={{ color: 'black' }}
            >
                {classItem.room}
            </Chip>
            </View>
        </Card.Content>
        <Card.Actions>
            <Button 
                mode="contained"
                onPress={() => showModal(classItem)}
                disabled={classItem.available === 0}
                style={{ backgroundColor: classItem.available > 0 ? '#f5f5dc' : 'red' }}
                textColor={classItem.available > 0 ? 'black' : 'white'}
            >
                {classItem.available > 0 ? 'Reservar' : 'Completo'}
            </Button>
        </Card.Actions>
    </Card>
);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar clases o instructores"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.filterChips}>
          <Chip 
            selected 
            onPress={() => {}} 
            style={[styles.filterChip, { backgroundColor: 'red' }]}
            textStyle={{ color: 'white' }}
          >
            Hoy
          </Chip>
          <Chip 
            onPress={() => {}} 
            style={[styles.filterChip, { backgroundColor: 'red' }]}
            textStyle={{ color: 'white' }}
          >
            Mañana
          </Chip>
          <Chip 
            onPress={() => {}} 
            style={[styles.filterChip, { backgroundColor: 'red' }]}
            textStyle={{ color: 'white' }}
          >
            Esta semana
          </Chip>
        </View>

        {filteredClasses.map(renderClassCard)}
      </ScrollView>

      <Portal>
        <Modal 
          visible={visible} 
          onDismiss={hideModal} 
          contentContainerStyle={styles.modalContent}
        >
          {selectedClass && (
            <Surface style={styles.modalSurface}>
                <Text variant="headlineMedium" style={{ color: 'black' }}>{selectedClass.name}</Text>
                <Divider style={styles.divider} />
                
                <View style={styles.modalInfo}>
                    <Icon name="account" size={24} color="black" />
                    <Text variant="bodyLarge" style={[styles.modalText, { color: 'black' }]}>
                    Instructor: {selectedClass.instructor}
                    </Text>
                </View>
                
                <View style={styles.modalInfo}>
                    <Icon name="clock-outline" size={24} color="black" />
                    <Text variant="bodyLarge" style={[styles.modalText, { color: 'black' }]}>
                    Horario: {selectedClass.time} ({selectedClass.duration})
                    </Text>
                </View>

                <View style={styles.modalInfo}>
                    <Icon name="fire" size={24} color="black" />
                    <Text variant="bodyLarge" style={[styles.modalText, { color: 'black' }]}>
                    Calorías estimadas: {selectedClass.calories}
                    </Text>
                </View>

                <View style={styles.modalInfo}>
                    <Icon name="stairs" size={24} color="black" />
                    <Text variant="bodyLarge" style={[styles.modalText, { color: 'black' }]}>
                    Nivel: {selectedClass.level}
                    </Text>
                </View>

                <View style={styles.modalInfo}>
                    <Icon name="information" size={24} color="black" />
                    <Text variant="bodyMedium" style={[styles.modalText, { color: 'black' }]}>
                    Plazas disponibles: {selectedClass.available} de {selectedClass.capacity}
                    </Text>
                </View>

                <Divider style={styles.divider} />
                
                <Button 
                    mode="contained"
                    onPress={() => {
                    console.log(`Reservando clase de ${selectedClass.name}`);
                    hideModal();
                    }}
                    style={[styles.modalButton, { backgroundColor: '#ffa500' }]}
                    textColor="black"
                >
                    Confirmar Reserva
                </Button>
                
                <Button 
                    mode="outlined"
                    onPress={hideModal}
                    style={[styles.modalButton, { borderColor: '#ffa500' }]}
                    textColor="black"
                >
                    Cancelar
                </Button>
                </Surface>
          )}
        </Modal>
      </Portal>
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
    elevation: 2,
    backgroundColor:   '#ffa500',
  },
  scrollView: {
    flex: 1,
  },
  filterChips: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  classCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
    backgroundColor:   '#ffa500',
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timeBadge: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e3f2fd',
  },
  timeText: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  modalContent: {
    padding: 20,
  },
  modalSurface: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  modalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  modalText: {
    marginLeft: 12,
    color: 'black',
  },
  divider: {
    marginVertical: 16,
  },
  modalButton: {
    marginTop: 8,
  },
});