import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';


import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GymMapScreen from '../screens/GymMapScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import ClassBookingScreen from '../screens/ClassBookingScreen';
import ProgressScreen from '../screens/ProgressScreen';
import RoutinesScreen from '../screens/RoutinesScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Esto oculta todos los headers
          // O si prefieres personalizar:
          /*
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          */
        }}
      >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen 
  name="GymMap" 
  component={GymMapScreen}
  options={{
    title: 'Plano del Gimnasio',
    headerShown: true
  }}
/>
  <Stack.Screen 
    name="WorkoutDetail" 
    component={WorkoutDetailScreen}
    options={{
      title: 'Detalles del Entrenamiento',
      headerShown: true
    }}
  />
  <Stack.Screen 
  name="ClassBooking" 
  component={ClassBookingScreen}
  options={{
    title: 'Reserva de Clases',
    headerShown: true
  }}
/>
<Stack.Screen 
  name="Progress" 
  component={ProgressScreen}
  options={{
    title: 'Mi Progreso',
    headerShown: true
  }}
/>
<Stack.Screen 
  name="Routines" 
  component={RoutinesScreen}
  options={{
    title: 'Mis Rutinas',
    headerShown: true
  }}
/>
</Stack.Navigator>
    </NavigationContainer>
  );
}
