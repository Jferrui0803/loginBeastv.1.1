// Configuración centralizada de URLs y constantes de la aplicación
// Este archivo permite cambiar fácilmente las IPs y URLs sin tocar múltiples archivos

// URLs base de los servicios
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.144:3000';
export const QR_SERVICE_URL = process.env.EXPO_PUBLIC_QR_SERVICE_URL || 'http://192.168.1.143:8000';

// Configuraciones de tiempo y funcionalidad
export const DEFAULT_TIMEOUT = 10000; // 10 segundos
export const QR_EXPIRY_HOURS = Number(process.env.EXPO_PUBLIC_QR_EXPIRY_HOURS) || 2; // Horas de expiración del QR
export const QR_EXPIRY_TIME = QR_EXPIRY_HOURS * 60 * 60 * 1000; // En millisegundos
export const QR_SIZE_FACTOR = 0.6; // Factor de tamaño del QR respecto al ancho de pantalla

// Configuración de desarrollo
export const IS_DEVELOPMENT = __DEV__;
export const DEBUG_MODE = process.env.EXPO_PUBLIC_DEBUG_MODE === 'true' || IS_DEVELOPMENT;

// Configuración de la aplicación
export const APP_CONFIG = {
  API_URL,
  QR_SERVICE_URL,
  QR_EXPIRY_HOURS,
  DEFAULT_TIMEOUT,
  DEBUG_MODE,
} as const;

// Log de configuración (solo en modo debug)
if (DEBUG_MODE) {
  console.log('🔧 === CONFIGURACIÓN DE BEASTMODE ===');
  console.log('📡 API Backend:', API_URL);
  console.log('🔄 QR Service:', QR_SERVICE_URL);
  console.log('⏰ QR Expiry:', `${QR_EXPIRY_HOURS} horas`);
  console.log('🐛 Debug Mode:', DEBUG_MODE ? 'ACTIVADO' : 'DESACTIVADO');
  console.log('🏗️ Development:', IS_DEVELOPMENT ? 'SÍ' : 'NO');
  console.log('=====================================');
}
