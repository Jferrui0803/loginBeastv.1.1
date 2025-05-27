import { View, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin } = useAuth();
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const result = await onLogin!(email, password);
            if (result && result.error) {
                alert(result.msg);
            }
        } catch (error) {
            if (error instanceof Error) {
                alert('Error al iniciar sesión: ' + error.message);
            } else {
                alert('Error al iniciar sesión');
            }
            console.error(error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.container}>
                <Surface style={styles.formContainer} elevation={2}>
                    <Text style={styles.title}>Iniciar Sesión</Text>
                    
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
                        secureTextEntry
                    />

                    <Button 
                        mode="contained"
                        onPress={handleLogin}
                        style={styles.button}
                        buttonColor="#ffa500"
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5dc',
        justifyContent: 'center',
    },
    formContainer: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#ffa500',
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'white',
    },
    button: {
        marginTop: 8,
        marginBottom: 16,
    },
    linkButton: {
        marginTop: 8,
    }
});

export default Login;