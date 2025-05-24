import { View, Text, Image, Button, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API_URL, useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin, onRegister } = useAuth();

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
    const register = async () => {
        try {
            const result = await onRegister!(email, password);
            if (result.error) {
                alert(result.msg);
            } else {
                await login();
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
            <Image source={{ uri: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0' }} style={styles.image} />
            <View style={styles.form}>
                <TextInput style={styles.input} placeholder="Email" onChangeText={(text: string) => setEmail(text)} value={email} />
                <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} onChangeText={(text: string) => setPassword(text)} value={password} />
                <Button onPress={login} title="Sign In" />
                <Button onPress={register} title="Create Account" />
            </View>
        </View>
    );
};






const styles = StyleSheet.create({
    image: {
        width: '50%',
        height: '50%',
        resizeMode: 'contain',
    },
    form: {
        gap: 10,
        width: '60%',
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
    },
    container: {
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        top: 30
    },

});

export default Login;

