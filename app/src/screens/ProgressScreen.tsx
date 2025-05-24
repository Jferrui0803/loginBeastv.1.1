import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Surface, SegmentedButtons, Card, DataTable, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';

export default function ProgressScreen() {
  const [timeRange, setTimeRange] = useState('week');
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    setIsChartReady(true);
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const chartData = {
    labels: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"],
    datasets: [
      {
        data: [450, 500, 450, 600, 450, 700, 500],
        color: (opacity = 1) => `rgba(255, 69, 0, ${opacity})`,
        strokeWidth: 2,
      }
    ]
  };

  const workoutHistory = [
    { date: '2024-01-15', type: 'Full Body', duration: '60 min', calories: 450 },
    { date: '2024-01-14', type: 'Cardio', duration: '45 min', calories: 350 },
    { date: '2024-01-12', type: 'Piernas', duration: '50 min', calories: 400 },
  ];

  const personalRecords = [
    { exercise: 'Press Banca', weight: '80 kg', date: '2024-01-10' },
    { exercise: 'Sentadilla', weight: '100 kg', date: '2024-01-08' },
    { exercise: 'Peso Muerto', weight: '120 kg', date: '2024-01-15' },
  ];

  const renderChart = () => {
    if (!isChartReady) return null;

    try {
      return (
        <LineChart
          data={chartData}
          width={dimensions.width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffa500',
            backgroundGradientFrom: '#ffa500',
            backgroundGradientTo: '#ffa500',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#000"
            },
            propsForBackgroundLines: {
              strokeWidth: 1,
              stroke: "rgba(0, 0, 0, 0.1)",
            }
          }}
          bezier
          style={styles.chart}
          withDots={true}
          withShadow={false}
          withInnerLines={true}
          withOuterLines={true}
        />
      );
    } catch (error) {
      console.log('Error rendering chart:', error);
      return (
        <View style={styles.chartError}>
          <Text>No se pudo cargar el gráfico</Text>
        </View>
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
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
            onSecondaryContainer: 'black',
            primary: 'black',
            onSurface: 'black',
            outline: 'black'
          }
        }}
      />

      <Surface style={styles.statsContainer} elevation={1}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Icon name="fire" size={24} color="#FF0000" />
            <Text style={styles.statValue}>3,200</Text>
            <Text style={styles.statLabel}>Calorías</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="clock-outline" size={24} color="#FF0000" />
            <Text style={styles.statValue}>6.5h</Text>
            <Text style={styles.statLabel}>Tiempo Total</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="dumbbell" size={24} color="#FF0000" />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Entrenamientos</Text>
          </View>
        </View>
      </Surface>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Calorías Quemadas</Text>
          {renderChart()}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Récords Personales</Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title textStyle={styles.dataHeader}>Ejercicio</DataTable.Title>
              <DataTable.Title numeric textStyle={styles.dataHeader}>Peso</DataTable.Title>
              <DataTable.Title numeric textStyle={styles.dataHeader}>Fecha</DataTable.Title>
            </DataTable.Header>

            {personalRecords.map((record, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{record.exercise}</DataTable.Cell>
                <DataTable.Cell numeric>{record.weight}</DataTable.Cell>
                <DataTable.Cell numeric>{record.date}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Historial de Entrenamientos</Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title textStyle={styles.dataHeader}>Fecha</DataTable.Title>
              <DataTable.Title textStyle={styles.dataHeader}>Tipo</DataTable.Title>
              <DataTable.Title numeric textStyle={styles.dataHeader}>Duración</DataTable.Title>
              <DataTable.Title numeric textStyle={styles.dataHeader}>Calorías</DataTable.Title>
            </DataTable.Header>

            {workoutHistory.map((workout, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{workout.date}</DataTable.Cell>
                <DataTable.Cell>{workout.type}</DataTable.Cell>
                <DataTable.Cell numeric>{workout.duration}</DataTable.Cell>
                <DataTable.Cell numeric>{workout.calories}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
          <Button 
            mode="text" 
            onPress={() => {}}
            style={styles.viewMoreButton}
            textColor="black"
          >
            Ver más
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
  },
  segmentedButtons: {
    margin: 16,
    backgroundColor: '#f5f5dc',
  },
  statsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffa500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    color: 'black',
  },
  statLabel: {
    color: 'black',
    marginTop: 4,
  },
  chartCard: {
    margin: 16,
    elevation: 2,
    backgroundColor: '#ffa500',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartError: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffa500',
    borderRadius: 16,
  },
  card: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
    backgroundColor: '#ffa500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black',
  },
  dataHeader: {
    color: 'black',
    fontWeight: 'bold',
  },
  viewMoreButton: {
    marginTop: 8,
  },
});