import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../authScreens/Home';
import Login from '../authScreens/Login';
import { useAuth } from '../context/AuthContext';

/*Imports de las pantallas*/
import HomeScreen from '../src/screens/HomeScreen'
import ClassBookingScreen from '../src/screens/ClassBookingScreen';
import GymMapScreen from '../src/screens/GymMapScreen';
import ProfileScreen from '../src/screens/ProfileScreen';
import ProgressScreen from '../src/screens/ProgressScreen';
import RoutinesScreen from '../src/screens/RoutinesScreen';
import WorkoutDetailScreen from '../src/screens/WorkoutDetailScreen';
import PersonalizedTrainingScreen from '../src/screens/PersonalizedTrainingScreen';


const Stack = createNativeStackNavigator();

// Change from named export to default export
const AppNavigator = () => {
  const { authState, onLogout } = useAuth();

  return (
    <NavigationContainer>
<Stack.Navigator screenOptions={{ headerShown: false }}>
  {authState?.authenticated ? (
    <>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{
          headerRight: () => (
            <View style={styles.headerButtonContainer}>
              <Button onPress={onLogout} title="Sign Out" />
            </View>
          ),
          headerShown: true,
        }}
      />
      <Stack.Screen name="PersonalizedTraining" component={PersonalizedTrainingScreen} options={{ headerShown: true, title: 'Entrenamiento Personalizado' }} />
      <Stack.Screen name="ClassBooking" component={ClassBookingScreen} />
      <Stack.Screen name="GymMap" component={GymMapScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Routines" component={RoutinesScreen} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
    </>
  ) : (
    <Stack.Screen name="Login" component={Login} />
  )}
</Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerButtonContainer: {
    marginBottom: 10,
  }
});


export default AppNavigator;

export { AppNavigator };