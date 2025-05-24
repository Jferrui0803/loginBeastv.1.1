import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, Card, Button } from 'react-native-paper';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="Perfil de Usuario"
          left={(props) => (
            <Avatar.Icon {...props} icon="account" />
          )}
        />
        <Card.Content>
          <Text variant="titleLarge">Nombre de Usuario</Text>
          <Text variant="bodyMedium">email@ejemplo.com</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => console.log('Editar perfil')}>
            Editar Perfil
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginVertical: 8,
  },
});