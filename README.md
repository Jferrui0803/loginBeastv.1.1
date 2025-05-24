# BeastMode App - Frontend Mobile Login

Aplicación móvil de BeastModeApp

---

## Requisitos previos

- Node.js (v16+)
- npm
- Expo CLI 
- Backend: PostgreSQL configurado y corriendo
- Conexión en red entre móvil/emulador y backend (IP accesible)
- Editor de código (VSCode recomendado)

---

## 1. Correr el backend

Metete aquí y sigue los pasos.

[Repositorio Backend](https://github.com/antoniocmizv/BeastMode-App.git)

## 2. Para correr la interfaz

Copiate el Respositorio.

[Repositorio Movil](https://github.com/Mariortega83/loginBeastv.1.git)
y ejecuta lo siguiente:
```bash
git clone https://github.com/Mariortega83/loginBeastv.1.git

cd loginBeastv.1

npm install
```
## 3. Con las dependencias instaladas 

Crea un .env en la raíz del proyecto con la URL de la API, no pongas localhost. (Saltaros esto, leer abajo)

   ```env
     API_URL='http://tuIP:3000'
   ```

Nada no hagais caso de esto, me las he dado de listo y usar el dotenv el solo para el back con node, abrir el proyecto en el VS CODE id a AuthContext.tsx y cambiar la API_URL con vuestra IP sin usar el localhost eeee ya lo digo. En android va bien, hay que añadir verificación de campos y si queremos añadir usuarios desde ahí otro formulario con el nombre, que es lo que pide el POST.

## 4. Correr la interfaz

Depende de lo que tengas se hará de una forma u otra, de momento con un emulador de android se hace así:

```bash
npx expo start
```

Cuando este arrancado en la terminal, le damos a la ' a ', para que detecte el emulador, si no escanea el QR anda. Si no funciona contacta conmigo.

## Stay Tunned comming soon...

### 5. Cambios metidos

Junto con mi compañero Carlos(wasap carli), hemos creado la interfaz de movil, el ha hecho el diseño y yo voy a encargarme de meterlo en el contexto de autenticación, posteriormente insertaré los datos de la base de datos en los respectivos campos de la interfaz. Bien trabajado niño.

### 6. Implementación de base de datos

He usado la base de datos para mostrar los datos correspondientes en las tarjetas de las clases en el home, lo he sacado a un componente externo. Problemas que he tenido: No sabía como comparar el id del gimnasio asignado al user y el id del gimnasio donde se imparte la clase, buscando info, y para arroarme otra llamada para obtener los datos, he concluido conque la mejor opción para hacerlo era mandarlo en el Token, pues así al descodificarlo se pueda obtener de forma rápida. Una vez arreglado el proeblema de comparar los id, la info de las clases se saca bien. Tengo que darle una vuelta a la forma en la que se crea el componente. Looking forward to empezar a tocar más partes de la interfaz, creación de planos y la parte web para los admin, muy sencilla de hacer sisi.