import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './app/authScreens/Home';
import Login from './app/authScreens/Login';
import { PaperProvider } from 'react-native-paper';

import AppNavigator from './app/navigation/AppNavigator';

const Stack = createNativeStackNavigator();

// export const Layout = () => {
//   const { authState, onLogout } = useAuth();
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {authState?. authenticated ? 
//           <Stack.Screen name="Home" component={Home} options={{
//             headerRight: () => <Button onPress={onLogout} title="Sign Out"  />}}
//           ></Stack.Screen> : 
//           <Stack.Screen name="Login" component={Login}></Stack.Screen>
//         }
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}

