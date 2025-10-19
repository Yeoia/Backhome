// Configuración de Firebase
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Configuración de Firebase para el cliente
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Verificar si tenemos todas las configuraciones necesarias
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && 
         firebaseConfig.authDomain && 
         firebaseConfig.projectId && 
         firebaseConfig.appId
}

// Inicializar Firebase solo si está configurado
let app: any = null
let auth: any = null
let db: any = null
let storage: any = null

try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    console.log('✅ Firebase initialized successfully')
  } else {
    console.warn('⚠️ Firebase not configured, using mock mode')
  }
} catch (error) {
  console.error('❌ Firebase initialization failed:', error)
}

// Exportar servicios (pueden ser null si no está configurado)
export { auth, db, storage }
export default app