# 🔧 Configuración de URLs y Variables de Entorno - BeastMode

## 📁 Archivos de Configuración

### `.env`
Contiene las variables de entorno para desarrollo local. **Este archivo no debe ser versionado.**

### `.env.example`
Plantilla de ejemplo que muestra qué variables están disponibles.

### `app/config/config.ts`
Archivo de configuración centralizada que lee las variables de entorno y proporciona valores por defecto.

## 🚀 Configuración Inicial

### 1. Configurar Variables de Entorno
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita el archivo .env con tus URLs específicas
```

### 2. Variables Disponibles

| Variable | Descripción | Valor por Defecto | Ejemplo |
|----------|-------------|-------------------|---------|
| `EXPO_PUBLIC_API_URL` | URL del backend principal | `http://192.168.1.144:3000` | `http://192.168.1.100:3000` |
| `EXPO_PUBLIC_QR_SERVICE_URL` | URL del servicio de QR | `http://192.168.1.143:8000` | `http://192.168.1.101:8000` |
| `EXPO_PUBLIC_QR_EXPIRY_HOURS` | Horas de expiración del QR | `2` | `1`, `4`, `24` |
| `EXPO_PUBLIC_DEBUG_MODE` | Modo de depuración | `true` | `true` o `false` |

## 🛠️ Scripts Útiles

### Cambiar IPs Rápidamente
```bash
# Cambiar ambas IPs de una vez
npm run change-ips 192.168.1.100 192.168.1.101

# O usar el script directamente
node scripts/change-ips.js 192.168.1.100 192.168.1.101
```

### Verificar Configuración
```bash
# Ver variables de entorno actuales
npm run env:check

# Mostrar configuración completa (en desarrollo)
npm run config:show
```

## 📱 Uso en el Código

### Importar Configuración
```typescript
import { API_URL, QR_SERVICE_URL, QR_EXPIRY_HOURS } from '../config/config';

// También disponible como objeto
import { APP_CONFIG } from '../config/config';
console.log(APP_CONFIG.API_URL);
```

### Ejemplo de Uso
```typescript
// En lugar de hardcodear:
const apiUrl = 'http://192.168.1.144:3000'; // ❌ No hacer esto

// Usar configuración centralizada:
import { API_URL } from '../config/config'; // ✅ Correcto
const response = await axios.get(`${API_URL}/users`);
```

## 🔄 Cambiar IPs

### Método 1: Editar .env
```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
EXPO_PUBLIC_QR_SERVICE_URL=http://192.168.1.101:8000
```

### Método 2: Script automático
```bash
npm run change-ips 192.168.1.100 192.168.1.101
```

### Método 3: Durante desarrollo
Para pruebas rápidas, puedes cambiar los valores por defecto en `config.ts` temporalmente.

## 📄 Archivos Afectados

- ✅ `app/context/AuthContext.tsx` - Usa `API_URL` del config
- ✅ `app/src/screens/QRGeneratorScreen.tsx` - Usa `QR_SERVICE_URL` y `QR_EXPIRY_HOURS` del config
- ⚠️ Cualquier nuevo archivo debe importar de `app/config/config.ts`

## 🚨 Notas Importantes

- **Prefijo Expo**: Las variables de entorno deben comenzar con `EXPO_PUBLIC_`
- **Seguridad**: El archivo `.env` no debe ser versionado (está en `.gitignore`)
- **Valores por defecto**: Siempre proporciona valores por defecto en `config.ts`
- **Reinicio**: Después de cambiar `.env`, reinicia la aplicación con `expo start`

## 🐛 Troubleshooting

### Las variables no se cargan
1. Verifica que comiencen con `EXPO_PUBLIC_`
2. Reinicia completamente Expo (`expo start`)
3. Verifica que el archivo `.env` esté en la raíz del proyecto

### IPs no se conectan
1. Verifica que los servicios estén corriendo en esas IPs
2. Usa `npm run env:check` para ver las URLs configuradas
3. Prueba las URLs directamente en el navegador

### Script change-ips no funciona
```bash
# Asegúrate de que el directorio scripts existe
mkdir scripts

# Verifica que tienes Node.js instalado
node --version
```

## 🎯 Beneficios de esta Configuración

- ✅ **Centralizado**: Todas las URLs en un solo lugar
- ✅ **Flexible**: Fácil cambio entre entornos (dev/prod)
- ✅ **Automatizado**: Scripts para cambios rápidos
- ✅ **Documentado**: Variables claramente explicadas
- ✅ **Seguro**: Variables sensibles no versionadas
