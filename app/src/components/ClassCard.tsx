// components/ClassCard.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Gym {
  id: string;
  name: string;
}

interface Props {
  id: string;
  name: string;
  startTime: string;
  instructor: string;
  gym: Gym;
  reserving: boolean;
  onReserve: () => void;
  formatearFecha: (isoDate: string) => string;
}

export default function ClassCard({
  id,
  name,
  startTime,
  instructor,
  gym,
  reserving,
  onReserve,
  formatearFecha,
}: Props) {
  return (
    <View style={styles.classCardContainer}>
      <View style={styles.classCard}>
        <View style={styles.cardHeader}>
          <Avatar.Icon
            size={56}
            icon="dumbbell"
            style={styles.avatar}
            color="#ffffff"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.className}>{name.toUpperCase()}</Text>
            <Text style={styles.instructor}>Instructor: {instructor}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Icon name="clock-outline" size={24} color="#ff6b35" />
            <Text style={styles.infoText}> {formatearFecha(startTime)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="map-marker" size={24} color="#ff6b35" />
            <Text style={styles.infoText}>Gimnasio: {gym.name}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <Button
            mode="contained"
            style={styles.reserveButton}
            loading={reserving}
            disabled={reserving}
            onPress={onReserve}
            textColor="#ffffff"
            icon={() => <Icon name="calendar-check" size={20} color="#ffffff" />}
          >
            {reserving ? 'RESERVANDO...' : 'RESERVAR AHORA'}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  classCardContainer: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
  },
  classCard: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#ff6b35',
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  className: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2c3e50',
    letterSpacing: 1,
    marginBottom: 4,
  },
  instructor: {
    color: '#666666',
    fontSize: 15,
    fontWeight: '500',
  },
  cardContent: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  infoText: {
    color: '#2c3e50',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
  },
  reserveButton: {
    backgroundColor: '#ff6b35',
    paddingVertical: 8,
    borderRadius: 0,
    elevation: 2,
  },
});
