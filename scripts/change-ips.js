#!/usr/bin/env node
/**
 * Script de ayuda para cambiar las IPs de desarrollo
 * Uso: node scripts/change-ips.js <nueva_ip_api> <nueva_ip_qr>
 * Ejemplo: node scripts/change-ips.js 192.168.1.100 192.168.1.101
 */

const fs = require('fs');
const path = require('path');

// Obtener argumentos
const [,, newApiIp, newQrIp] = process.argv;

if (!newApiIp || !newQrIp) {
  console.log('❌ Error: Debes proporcionar ambas IPs');
  console.log('📋 Uso: node scripts/change-ips.js <ip_api> <ip_qr>');
  console.log('📋 Ejemplo: node scripts/change-ips.js 192.168.1.100 192.168.1.101');
  process.exit(1);
}

// Validar formato de IP
const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
if (!ipRegex.test(newApiIp) || !ipRegex.test(newQrIp)) {
  console.log('❌ Error: Formato de IP inválido');
  process.exit(1);
}

// Construir nuevas URLs
const newApiUrl = `http://${newApiIp}:3000`;
const newQrUrl = `http://${newQrIp}:8000`;

// Ruta del archivo .env
const envPath = path.join(__dirname, '..', '.env');

try {
  // Leer archivo .env actual
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Reemplazar URLs
  envContent = envContent.replace(
    /EXPO_PUBLIC_API_URL=.*/,
    `EXPO_PUBLIC_API_URL=${newApiUrl}`
  );
  envContent = envContent.replace(
    /EXPO_PUBLIC_QR_SERVICE_URL=.*/,
    `EXPO_PUBLIC_QR_SERVICE_URL=${newQrUrl}`
  );
  
  // Escribir archivo actualizado
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ IPs actualizadas correctamente:');
  console.log(`📡 API Backend: ${newApiUrl}`);
  console.log(`🔄 QR Service: ${newQrUrl}`);
  console.log('');
  console.log('🔄 Reinicia la aplicación para aplicar los cambios.');
  
} catch (error) {
  if (error.code === 'ENOENT') {
    console.log('❌ Error: Archivo .env no encontrado');
    console.log('💡 Crea el archivo .env copiando de .env.example');
  } else {
    console.log('❌ Error:', error.message);
  }
  process.exit(1);
}
