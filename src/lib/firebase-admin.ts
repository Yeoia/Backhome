// Configuración de Firebase Admin para el servidor
import admin from 'firebase-admin'

// Verificar si Firebase Admin ya está inicializado
if (!admin.apps.length) {
  try {
    // Para producción - usar variables de entorno
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      })
    } else {
      // Para desarrollo - usar configuración por defecto
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        credential: admin.credential.applicationDefault()
      })
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error)
  }
}

export const adminAuth = admin.auth()
export const adminDb = admin.firestore()
export const adminStorage = admin.storage()

export default admin