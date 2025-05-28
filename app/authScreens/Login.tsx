import { View, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { API_URL, useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const { onLogin } = useAuth(); 
    
    useEffect(() => {
        const testCall = async () => {
            const result = await axios.get(`${API_URL}/api/auth/login`);
        }
        testCall();
    }, []);

    const login = async () => {
        try {
            const result = await onLogin!(email, password);
            if (result.error) {
                alert(result.msg);
            } else {
                console.log('Login successful', result.data);
            }
        } catch (error) {
            if (error instanceof Error) {
                alert('Error inesperado: ' + error.message);
            } else {
                alert('Error inesperado');
            }
            console.error(error);
        }
    };



    return (
        <View style={styles.container}>
            <Surface style={styles.formContainer} elevation={2}>
                <Image 
                    source={require('../assets/image.png')} 
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
                    outlineColor="black"
                    activeOutlineColor="black"
                />
                <TextInput
                    label="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    style={styles.input}
                    secureTextEntry={secureTextEntry}
                    outlineColor="black"
                    activeOutlineColor="black"
                    right={
                        <TextInput.Icon
                            icon={secureTextEntry ? "eye" : "eye-off"}
                            onPress={() => setSecureTextEntry(!secureTextEntry)}
                        />
                    }
                />
                <Button 
                    mode="contained" 
                    onPress={login}
                    style={{ backgroundColor: '#ffa500' }}
                    textColor="white" 
                >
                    Iniciar Sesión

                </Button>
                    

            </Surface>
        </View>
    );
};

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
        width: 150,
        height: 150,
        alignSelf: 'center',

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: -20,
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

export default Login;