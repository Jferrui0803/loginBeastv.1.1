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
import ProfileScreen from '../src/screens/ProfileScreen';
import ProgressScreen from '../src/screens/ProgressScreen';
import RoutinesScreen from '../src/screens/RoutinesScreen';
import WorkoutDetailScreen from '../src/screens/WorkoutDetailScreen';
import PersonalizedTrainingScreen from '../src/screens/PersonalizedTrainingScreen';
import NutritionScreen from '../src/screens/NutritionScreen';
import ChatListScreen from '../src/screens/ChatListScreen';
import ChatScreen from '../src/screens/ChatScreen';
import NewChatScreen from '../src/screens/NewChatScreen';
import IAChatListScreen from '../src/screens/IAChatListScreen';
import IAChatDetailScreen from '../src/screens/IAChatDetailScreen';
import EditProfileScreen from '../src/screens/EditProfileScreen';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { User } from "../src/screens/ProfileScreen";
import { IconButton } from 'react-native-paper';

// Definir los parámetros de navegación del stack principal
type MainStackParamList = {
  Login: undefined;
  HomeScreen: undefined;
  ChatList: undefined;
  NewChat: undefined;
  Chat: { chatId: string; chatName?: string };
  Nutrition: undefined;
  PersonalizedTraining: undefined;
  ClassBooking: undefined;
  ProgressScreen: undefined;
  GymMap: undefined;
  Profile: undefined;
  Routines: undefined;
  WorkoutDetail: undefined;
  IAChatList: { chatType: 'nutrition' | 'training' };
  IAChatDetail: { chatId: string; chatTitle: string; chatType: 'nutrition' | 'training' };
  EditProfile: { user: User }
};

export type { MainStackParamList };

// Crear stack tipado
const Stack = createNativeStackNavigator<MainStackParamList>();

// Change from named export to default export
const AppNavigator = () => {
  const { authState, onLogout } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerRight: () => (
            <IconButton
              icon="account-circle"
              size={28}
              iconColor="#ffa500"
              onPress={() => navigation.navigate('Profile')}
              style={{ marginRight: 8 }}
            />
          ),
          headerShown: true,
        })}
      >
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
                title: 'Inicio',
                headerStyle: {
                  backgroundColor: '#1A1A1A'
                },
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 20,
                  color: '#fff',
                },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen 
              name="ChatList" 
              component={ChatListScreen} 
              options={{ 
                headerShown: true, 
                title: 'Chats',
                headerStyle: {
                  backgroundColor: '#1A1A1A',
                },
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 20,
                  color: '#fff',
                },
                headerTintColor: '#fff',
              }} 
            />
            <Stack.Screen 
              name="NewChat" 
              component={NewChatScreen} 
              options={{ 
                headerShown: true, 
                title: 'Nuevo Chat',
                headerStyle: {
                  backgroundColor: '#1A1A1A',
                },
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 20,
                  color: '#fff',
                },
                headerTintColor: '#fff',
              }} 
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={({ route }: { route: RouteProp<MainStackParamList, 'Chat'> }) => ({
                headerShown: true,
                title: route.params.chatName ?? 'Chat',
                headerStyle: {
                  backgroundColor: '#1A1A1A',
                },
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 20,
                  color: '#fff',
                },
                headerTintColor: '#fff',
              })}
            />
            <Stack.Screen 
              name="Nutrition" 
              component={NutritionScreen} 
              options={{ 
                headerShown: true, 
                title: 'Nutrición',
                headerStyle: {
                  backgroundColor: '#1A1A1A',
                },
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 20,
                  color: '#fff',
                },
                headerTintColor: '#fff',
              }} 
            />
            <Stack.Screen 
              name="PersonalizedTraining" 
              component={PersonalizedTrainingScreen} 
              options={{ 
                headerShown: true, 
                title: 'Entrenamiento Personalizado',
                headerStyle: {
                  backgroundColor: '#1A1A1A',
                },
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 20,
                  color: '#fff',
                },
                headerTintColor: '#fff',
              }} 
            />
            <Stack.Screen
              name="ClassBooking"
              component={ClassBookingScreen}
              options={{
                headerShown: true,
                title: 'Reservar Clases',
                headerStyle: {
                  backgroundColor: '#1A1A1A',
                },
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 20,
                  color: '#fff',
                },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen
              name="Routines"
              component={RoutinesScreen}
              options={{
                headerShown: true,
                title: 'Rutinas',
                headerStyle: {
                  backgroundColor: '#1A1A1A',
                },
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 20,
                  color: '#fff',
                },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="ProgressScreen"
              component={ProgressScreen}
              options={{
                headerShown: true,
                title: 'Progreso',
                headerStyle: {
                  backgroundColor: '#1A1A1A',
                },
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 20,
                  color: '#fff',
                },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            {/* IA Chat Screens */}
            <Stack.Screen
              name="IAChatList"
              component={IAChatListScreen}
              options={({ route }) => ({
                headerShown: true,
                title: route.params?.chatType === 'training' ? 'Chat Entrenamiento' : 'Chat Nutrición',
                headerStyle: {
                  backgroundColor: '#1A1A1A',
                },
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 20,
                  color: '#fff',
                },
                headerTintColor: '#fff',
              })}
            />
            <Stack.Screen 
              name="IAChatDetail" 
              component={IAChatDetailScreen} 
              options={({ route }) => ({ 
                headerShown: true, 
                title: route.params.chatTitle,
                headerStyle: {
                  backgroundColor: '#1A1A1A',
                },
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 20,
                  color: '#fff',
                },
                headerTintColor: '#fff',
              })} 
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login}
          options={{ headerShown: false }} />
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