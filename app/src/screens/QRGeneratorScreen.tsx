import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Card, Text, Button, Divider } from 'react-native-paper';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL, useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCode from 'react-native-qrcode-svg';
import { jwtDecode } from 'jwt-decode';

const { width } = Dimensions.get('window');

interface QRResponse {
  qr_code: string;
  qr_token: string;
  expires_at: string;
  user_info: {
    id: string;
    name: string;
    email: string;
    role: string;
    gym?: any;
  };
}

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  gymId?: string;
  exp: number;
}

export default function QRGeneratorScreen() {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<QRResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  // Calcular tiempo restante
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (qrData?.expires_at) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(qrData.expires_at).getTime();
        const difference = expiry - now;

        if (difference > 0) {
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setTimeRemaining('Expirado');
          setQrData(null);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [qrData]);
  const generateQR = async () => {
    setLoading(true);
    setError(null);
      try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      // Decodificar el token para obtener el gymId
      const decoded = jwtDecode<JwtPayload>(token);
      const userGymId = decoded.gymId;
      
      if (!userGymId) {
        throw new Error('gymId no encontrado en el token');
      }

      // URL del servicio QR de Python
      const QR_SERVICE_URL = 'http://192.168.1.144:8000'; // Servicio QR corriendo en Docker
      console.log('Generando QR para el gimnasio:', userGymId);
      console.log('Token de autenticación:', token);
      const response = await axios.post(
        `${QR_SERVICE_URL}/generate-qr`,
        
        { gymId: userGymId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setQrData(response.data);
    } catch (err: any) {
      console.error('Error generando QR:', err);
      let errorMessage = 'Error al generar el código QR';
      
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderQRSection = () => {
    if (!qrData) return null;

    return (
      <Card style={styles.qrCard}>
        <Card.Content style={styles.qrContent}>
          <View style={styles.qrHeader}>
            <Text style={styles.qrTitle}>Tu código QR</Text>
            <Icon name="qrcode" size={24} color="#ffa500" />
          </View>
            <View style={styles.qrContainer}>
            {qrData.qr_code ? (
              <QRCode
                value={qrData.qr_token}
                size={width * 0.6}
                backgroundColor="white"
                color="black"
              />
            ) : (
              <ActivityIndicator size="large" color="#ffa500" />
            )}
          </View>
          
          <View style={styles.qrInfo}>
            <View style={styles.infoItem}>
              <Icon name="clock-outline" size={20} color="#ffa500" />
              <Text style={styles.infoText}>
                Tiempo restante: <Text style={styles.timeText}>{timeRemaining}</Text>
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="shield-check" size={20} color="#4CAF50" />
              <Text style={styles.infoText}>Código de un solo uso</Text>
            </View>
          </View>
            <Divider style={styles.divider} />
          
          <Text style={styles.instructionsTitle}>Instrucciones:</Text>
          <Text style={styles.instructionsText}>
            1. Presenta este código QR en la entrada del gimnasio
            2. El personal escaneará el código para validar tu acceso
            3. El código expira en 15 minutos y es de un solo uso
            4. Genera un nuevo código si necesitas acceder nuevamente
          </Text>
        </Card.Content>
      </Card>
    );
  };

  const renderGenerateSection = () => (
    <Card style={styles.generateCard}>
      <Card.Content style={styles.generateContent}>
        <View style={styles.generateHeader}>
          <Text style={styles.generateTitle}>Acceso al gimnasio</Text>
          <Icon name="dumbbell" size={24} color="#ffa500" />
        </View>
          <Text style={styles.generateDescription}>
          Genera un código QR para acceder al gimnasio. El código es válido por 15 minutos 
          y solo puede ser usado una vez.
        </Text>
          <Button
          mode="contained"
          style={styles.generateButton}
          labelStyle={styles.generateButtonText}
          icon="qrcode"
          onPress={generateQR}
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Generando...' : 'GENERAR CÓDIGO QR'}
        </Button>
        
        {error && (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={20} color="#F44336" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Código QR</Text>
            <Text style={styles.headerSubtitle}>Acceso rápido al gimnasio</Text>
          </View>
          <View style={styles.headerIcon}>
            <Icon name="qrcode-scan" size={32} color='#ffa500' />
          </View>
        </View>

        {qrData ? renderQRSection() : renderGenerateSection()}        {qrData && (
          <Button
            mode="outlined"
            style={styles.newQRButton}
            labelStyle={styles.newQRButtonText}
            icon="refresh"
            onPress={generateQR}
            disabled={loading}
          >
            GENERAR NUEVO CÓDIGO
          </Button>
        )}
      </ScrollView>
    </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Generate Card
  generateCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  generateContent: {
    padding: 24,
    alignItems: 'center',
  },
  generateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  generateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginRight: 8,
  },
  generateDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  generateButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 4,
    paddingHorizontal: 20,
    minWidth: 200,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#000000',
  },

  // QR Card
  qrCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  qrContent: {
    padding: 24,
    alignItems: 'center',
  },
  qrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginRight: 8,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 24,
  },
  qrInfo: {
    width: '100%',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 8,
  },
  timeText: {
    fontWeight: '700',
    color: '#ffa500',
  },
  divider: {
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    textAlign: 'left',
  },

  // New QR Button
  newQRButton: {
    marginHorizontal: 20,
    borderColor: '#ffa500',
    paddingVertical: 4,
  },
  newQRButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#ffa500',
  },

  // Error
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#F44336',
    marginLeft: 8,
    flex: 1,
  },
});
