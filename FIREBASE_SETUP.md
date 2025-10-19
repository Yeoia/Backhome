# 🔥 Configuración de Firebase para ¡Regresa!

## 📋 Pasos para Configurar Firebase

### 1. Crear Proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombre del proyecto: `regresa-mascotas` (o el que prefieras)
4. Habilita Google Analytics (opcional)
5. Crea el proyecto

### 2. Configurar Authentication
1. En el dashboard de Firebase, ve a "Authentication"
2. Haz clic en "Comenzar"
3. En la pestaña "Método de inicio de sesión", habilita:
   - **Email/Contraseña** (habilitar)
   - **Google** (habilitar)

### 3. Configurar Firestore Database
1. Ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Elige "Iniciar en modo de prueba" (para desarrollo)
4. Selecciona una ubicación (ej: `us-central1`)
5. Crea la base de datos

### 4. Configurar Storage (opcional, para imágenes)
1. Ve a "Storage"
2. Haz clic en "Comenzar"
3. Configura las reglas de seguridad para desarrollo

### 5. Obtener Credenciales
1. Ve a la configuración del proyecto (⚙️)
2. En "General", haz clic en "Configuración de la aplicación web"
3. Copia el objeto `firebaseConfig`

### 6. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Configuración de Firebase - Reemplaza con tus datos
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key-aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id

# Para producción (opcional)
# FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"tu-project-id",...}
```

### 7. Reglas de Seguridad de Firestore

En Firebase Console > Firestore > Reglas, usa estas reglas para desarrollo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios pueden leer y escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Cualquiera puede leer mascotas perdidas y avistamientos
    match /lostPets/{petId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /sightings/{sightingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 8. Reglas de Storage (si usas Storage)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🚀 Despliegue en Vercel

### 1. Configurar Variables de Entorno en Vercel
1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Agrega todas las variables `NEXT_PUBLIC_FIREBASE_*`

### 2. Deploy
```bash
vercel --prod
```

## 🔧 Solución de Problemas

### Error: "Firebase App not initialized"
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que `NEXT_PUBLIC_FIREBASE_PROJECT_ID` sea correcto

### Error: "Missing or insufficient permissions"
- Revisa las reglas de seguridad de Firestore
- Asegúrate de que Authentication esté habilitado

### Error: "auth/invalid-api-key"
- Verifica que `NEXT_PUBLIC_FIREBASE_API_KEY` sea correcta
- Copia nuevamente desde Firebase Console

## 📱 Testing Local

1. Configura `.env.local` con tus credenciales
2. Inicia el servidor: `npm run dev`
3. Prueba el registro e inicio de sesión
4. Verifica que los datos se guarden en Firestore

## 🎯 Siguiente Paso

Una vez configurado Firebase, tu aplicación estará lista para:
- ✅ Autenticación de usuarios
- ✅ Base de datos en tiempo real
- ✅ Storage de imágenes
- ✅ Despliegue sin problemas en Vercel

¡Tu aplicación "¡Regresa!" estará funcionando con Firebase! 🎉