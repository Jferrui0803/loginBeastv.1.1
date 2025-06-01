import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../navigation/AppNavigator';


type Props = NativeStackScreenProps<MainStackParamList, 'ChangePasswordScreen'>;

export default function ChangePasswordScreen({ route, navigation }: Props) {
    const [newPassword, setNewPassword] = useState('');
    const { user } = route.params;
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validatePasswords = () => {

        if (!newPassword.trim()) {
            Alert.alert('Error', 'Por favor ingresa una nueva contraseña');
            return false;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return false;
        }

        return true;
    };

    const handleChangePassword = async () => {
        if (!validatePasswords()) return;

        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) throw new Error('Token no encontrado');

            await axios.put(
                `${API_URL}/api/users/${user.id}`,
                {
                    ...user,
                    password: newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Alert.alert(
                'Contraseña actualizada',
                'Tu contraseña ha sido cambiada exitosamente',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );

            setNewPassword('');
            setConfirmPassword('');

        } catch (err: any) {
            let errorMessage = 'Error al cambiar la contraseña';

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.msg) {
                errorMessage = err.response.data.msg;
            } else if (err.message) {
                errorMessage = err.message;
            }

            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.headerSection}>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>Cambiar contraseña</Text>
                        <Text style={styles.headerSubtitle}>Establece una nueva contraseña para tu cuenta</Text>
                    </View>
                    <View style={styles.headerIcon}>
                        <Icon name="lock-reset" size={30} color="#ffa500" />
                    </View>
                </View>

                <Card style={styles.formCard}>
                    <Card.Content style={styles.formContent}>
                        <View style={styles.formHeader}>
                            <Text style={styles.formTitle}>Nueva contraseña</Text>
                            <Icon name="shield-lock" size={24} color="#ffa500" />
                        </View>

                        <Text style={styles.instructionText}>
                            Ingresa tu nueva contraseña. Asegúrate de que sea segura y fácil de recordar.
                        </Text>

                        <TextInput
                            label="Nueva contraseña"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            mode="outlined"
                            style={styles.input}
                            secureTextEntry={!showNewPassword}
                            outlineColor="#E0E0E0"
                            activeOutlineColor="#ffa500"
                            left={<TextInput.Icon icon="lock-plus" />}
                            right={
                                <TextInput.Icon
                                    icon={showNewPassword ? "eye-off" : "eye"}
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                />
                            }
                        />

                        <TextInput
                            label="Confirmar nueva contraseña"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            mode="outlined"
                            style={styles.input}
                            secureTextEntry={!showConfirmPassword}
                            outlineColor="#E0E0E0"
                            activeOutlineColor="#ffa500"
                            left={<TextInput.Icon icon="lock-check" />}
                            right={
                                <TextInput.Icon
                                    icon={showConfirmPassword ? "eye-off" : "eye"}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                />
                            }
                        />

                        <View style={styles.requirementsContainer}>
                            <Text style={styles.requirementsTitle}>Requisitos de la contraseña:</Text>
                            <View style={styles.requirementItem}>
                                <Icon
                                    name={newPassword.length >= 6 ? "check-circle" : "circle-outline"}
                                    size={16}
                                    color={newPassword.length >= 6 ? "#4CAF50" : "#666666"}
                                />
                                <Text style={[
                                    styles.requirementText,
                                    { color: newPassword.length >= 6 ? "#4CAF50" : "#666666" }
                                ]}>
                                    Mínimo 6 caracteres
                                </Text>
                            </View>
                            <View style={styles.requirementItem}>
                                <Icon
                                    name={newPassword && newPassword === confirmPassword ? "check-circle" : "circle-outline"}
                                    size={16}
                                    color={newPassword && newPassword === confirmPassword ? "#4CAF50" : "#666666"}
                                />
                                <Text style={[
                                    styles.requirementText,
                                    { color: newPassword && newPassword === confirmPassword ? "#4CAF50" : "#666666" }
                                ]}>
                                    Las contraseñas coinciden
                                </Text>
                            </View>
                        </View>

                        <View style={styles.actionsContainer}>
                            <Button
                                mode="contained"
                                style={styles.saveButton}
                                labelStyle={styles.saveButtonText}
                                icon={() => <Icon name="content-save" size={16} color="#000000" />}
                                onPress={handleChangePassword}
                                loading={loading}
                                disabled={loading}
                            >
                                ACTUALIZAR CONTRASEÑA
                            </Button>

                            <Button
                                mode="outlined"
                                style={styles.cancelButton}
                                labelStyle={styles.cancelButtonText}
                                icon={() => <Icon name="close" size={16} color="#666666" />}
                                onPress={navigation.goBack}
                                disabled={loading}
                            >
                                CANCELAR
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5dc',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },

    // Header Section
    headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 24,
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666666',
        fontWeight: '400',
    },
    headerIcon: {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(255, 165, 0, 0.1)',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Form Card
    formCard: {
        marginHorizontal: 20,
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    formContent: {
        padding: 20,
    },
    formHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    instructionText: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
    },

    // Password Requirements
    requirementsContainer: {
        backgroundColor: 'rgba(255, 165, 0, 0.05)',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
    },
    requirementsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    requirementText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
    },

    // Actions
    actionsContainer: {
        gap: 12,
    },
    saveButton: {
        backgroundColor: '#ffa500',
        paddingVertical: 4,
        elevation: 0,
    },
    saveButtonText: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
        color: '#000000',
    },
    cancelButton: {
        borderColor: '#666666',
        paddingVertical: 4,
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
        color: '#666666',
    },

    
});