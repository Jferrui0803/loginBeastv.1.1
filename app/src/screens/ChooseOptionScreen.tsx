import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_URL } from '../../context/AuthContext';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-camera';

const ChooseOptionScreen = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const navigation = useNavigation();
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const isPermissionGranted = cameraPermission?.granted || false;

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync('userToken');
            console.log('Guardado:', token);
            let userId = null;
            if (token) {
                try {
                    const decoded: any = jwtDecode(token);
                    userId = decoded?.id || decoded?.userId || null;
                    console.log('Decoded userId:', userId);
                } catch (e) {
                    userId = null;
                    console.log('Error decoding token:', e);
                }

            } else {
                console.log('No token found');
                return;
            }

            const result = await axios.get(`${API_URL}/api/users/${userId}`);
            console.log('User data:', result.data);

            if (result.data.role === 'ADMIN') {
                setIsAdmin(true);
                console.log('User is admin');
                console.log('isAdmin:', isAdmin);
            }
        }
        loadToken();
    }, []);



    console.log('isAdmin state:', isAdmin);

    return (
        <View style={styles.cardContainer}>
            <Card onPress={() => navigation.navigate('MainTabs')}>
                <Card.Title title="Entrar en el gimnasio" subtitle="BeastMode" />
                <Card.Content>
                    <Text>Contenido de la tarjeta</Text>
                </Card.Content>
            </Card>

            <Card onPress={() => console.log('Card presionada1')}>
                <Card.Title title="Generar código" subtitle="Genera tu código para entrar en el gimnasio" />
                <Card.Content>
                    <Text>Contenido de la tarjeta</Text>
                </Card.Content>
            </Card>
            {isAdmin ? (<Card onPress={async () => {
                const permission = await requestCameraPermission();

                if (permission.granted) {
                    navigation.navigate('ScannerScreen'); // <-- asegúrate que exista
                } else {
                    alert('Permiso de cámara denegado. No puedes escanear el código QR.');
                }
            }}>
                <Card.Title title="Escanar QR" />
                <Card.Content>
                    <Text>Escanear codigo</Text>
                </Card.Content>
            </Card>) : (null)}

        </View>
    )


};
const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        gap: 20,
    },
});
export default ChooseOptionScreen;