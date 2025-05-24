import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation();

  const handleLogin = () => {
    console.log('Login:', email, password);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.formContainer} elevation={2}>
        <Image 
          source={require('../../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>GYMFIT</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry={secureTextEntry}
          right={
            <TextInput.Icon
              icon={secureTextEntry ? "eye" : "eye-off"}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
        />
        <Button 
          mode="contained" 
          onPress={handleLogin}
          style={{ backgroundColor: '#ffa500' }}
          textColor="white" 
        >
          Iniciar Sesión
        </Button>
        <Button 
          mode="text" 
          onPress={() => navigation.navigate('Register')}
          style={styles.linkButton}
          textColor="#ffa500"  
        >
          ¿No tienes cuenta? Regístrate
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5dc', 
    },
    formContainer: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'white',
    },
    button: {
        marginTop: 10,
        paddingVertical: 6,
    },
    linkButton: {
        marginTop: 10,
    },
});