import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../src/screens/HomeScreen';
import ClassBookingScreen from '../src/screens/ClassBookingScreen';
import ProgressScreen from '../src/screens/ProgressScreen';
import RoutinesScreen from '../src/screens/RoutinesScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    initialRouteName="HomeScreen"
    screenOptions={({ route }: { route: any }) => ({
      headerShown: true,
      headerStyle: {
        backgroundColor: '#1A1A1A',
      },
      headerTitleStyle: {
        fontWeight: '700',
        fontSize: 20,
        color: '#fff',
      },
      headerTintColor: '#fff',
      tabBarActiveTintColor: '#ffa500',
      tabBarInactiveTintColor: '#fff',
      tabBarStyle: {
        backgroundColor: '#1A1A1A',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        height: 70,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarIcon: ({ color, size }: { color: string; size: number }) => {
        let iconName = '';
        if (route.name === 'HomeScreen') iconName = 'home';
        if (route.name === 'ClassBooking') iconName = 'calendar';
        if (route.name === 'ProgressScreen') iconName = 'chart-line';
        if (route.name === 'Routines') iconName = 'dumbbell';
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Inicio' }} />
    <Tab.Screen name="ClassBooking" component={ClassBookingScreen} options={{ title: 'Clases' }} />
    <Tab.Screen name="ProgressScreen" component={ProgressScreen} options={{ title: 'Progreso' }} />
    <Tab.Screen name="Routines" component={RoutinesScreen} options={{ title: 'Rutinas' }} />
  </Tab.Navigator>
);

export default MainTabNavigator;
