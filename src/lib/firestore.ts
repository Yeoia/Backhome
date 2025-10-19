// Utilidades para Firestore
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Tipos de datos
export interface LostPet {
  id?: string
  userId: string
  petName: string
  petType: string
  breed?: string
  color: string
  size: string
  age?: string
  description: string
  location: string
  coordinates?: {
    lat: number
    lng: number
  }
  imageUrl?: string
  contactInfo: {
    phone: string
    email: string
    preferredContact: 'phone' | 'email'
  }
  status: 'lost' | 'found'
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Sighting {
  id?: string
  userId: string
  petId?: string
  description: string
  location: string
  coordinates?: {
    lat: number
    lng: number
  }
  imageUrl?: string
  sightingType: 'dog' | 'cat' | 'other'
  contactInfo: {
    phone: string
    email: string
    preferredContact: 'phone' | 'email'
  }
  createdAt: Timestamp
}

// Colecciones
const LOST_PETS_COLLECTION = 'lostPets'
const SIGHTINGS_COLLECTION = 'sightings'
const USERS_COLLECTION = 'users'

// Funciones para Mascotas Perdidas
export const lostPetsService = {
  // Crear nueva mascota perdida
  async create(petData: Omit<LostPet, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!db) throw new Error('Firestore not available')
    const docRef = await addDoc(collection(db, LOST_PETS_COLLECTION), {
      ...petData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  },

  // Obtener todas las mascotas perdidas
  async getAll(limitCount = 50) {
    if (!db) {
      // Return mock data if Firestore is not available
      return [
        {
          id: '1',
          petName: 'Max',
          description: 'Golden Retriever, amigable y juguetón',
          location: 'Parque Central',
          imageUrl: null
        },
        {
          id: '2',
          petName: 'Luna',
          description: 'Gata siamesa, collar rojo con cascabel',
          location: 'Zona Norte',
          imageUrl: null
        }
      ] as any[]
    }
    
    const q = query(
      collection(db, LOST_PETS_COLLECTION),
      where('status', '==', 'lost'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LostPet[]
  },

  // Obtener mascota por ID
  async getById(id: string) {
    if (!db) return null
    const docRef = doc(db, LOST_PETS_COLLECTION, id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as LostPet
    }
    return null
  },

  // Obtener mascotas por usuario
  async getByUserId(userId: string) {
    if (!db) return []
    const q = query(
      collection(db, LOST_PETS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LostPet[]
  },

  // Actualizar mascota
  async update(id: string, data: Partial<LostPet>) {
    if (!db) throw new Error('Firestore not available')
    const docRef = doc(db, LOST_PETS_COLLECTION, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
  },

  // Marcar como encontrada
  async markAsFound(id: string) {
    if (!db) throw new Error('Firestore not available')
    const docRef = doc(db, LOST_PETS_COLLECTION, id)
    await updateDoc(docRef, {
      status: 'found',
      updatedAt: serverTimestamp()
    })
  },

  // Eliminar mascota
  async delete(id: string) {
    if (!db) throw new Error('Firestore not available')
    const docRef = doc(db, LOST_PETS_COLLECTION, id)
    await deleteDoc(docRef)
  }
}

// Funciones para Avistamientos
export const sightingsService = {
  // Crear nuevo avistamiento
  async create(sightingData: Omit<Sighting, 'id' | 'createdAt'>) {
    if (!db) throw new Error('Firestore not available')
    const docRef = await addDoc(collection(db, SIGHTINGS_COLLECTION), {
      ...sightingData,
      createdAt: serverTimestamp()
    })
    return docRef.id
  },

  // Obtener todos los avistamientos
  async getAll(limitCount = 50) {
    if (!db) {
      // Return mock data if Firestore is not available
      return [
        {
          id: '1',
          description: 'Perro pequeño corriendo cerca del parque',
          location: 'Plaza Mayor',
          sightingType: 'dog',
          imageUrl: null
        },
        {
          id: '2',
          description: 'Gato negro subido a un árbol',
          location: 'Jardín Botánico',
          sightingType: 'cat',
          imageUrl: null
        }
      ] as any[]
    }
    
    const q = query(
      collection(db, SIGHTINGS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Sighting[]
  },

  // Obtener avistamiento por ID
  async getById(id: string) {
    if (!db) return null
    const docRef = doc(db, SIGHTINGS_COLLECTION, id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Sighting
    }
    return null
  },

  // Obtener avistamientos por usuario
  async getByUserId(userId: string) {
    if (!db) return []
    const q = query(
      collection(db, SIGHTINGS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Sighting[]
  },

  // Eliminar avistamiento
  async delete(id: string) {
    if (!db) throw new Error('Firestore not available')
    const docRef = doc(db, SIGHTINGS_COLLECTION, id)
    await deleteDoc(docRef)
  }
}

// Funciones de Estadísticas
export const statsService = {
  async getStats() {
    if (!db) {
      // Return mock stats if Firestore is not available
      return {
        totalLost: 12,
        totalFound: 8,
        totalSightings: 15,
        activeCases: 4
      }
    }
    
    const lostPetsQuery = query(
      collection(db, LOST_PETS_COLLECTION),
      where('status', '==', 'lost')
    )
    const foundPetsQuery = query(
      collection(db, LOST_PETS_COLLECTION),
      where('status', '==', 'found')
    )
    const sightingsQuery = query(collection(db, SIGHTINGS_COLLECTION))

    const [lostPetsSnapshot, foundPetsSnapshot, sightingsSnapshot] = await Promise.all([
      getDocs(lostPetsQuery),
      getDocs(foundPetsQuery),
      getDocs(sightingsQuery)
    ])

    return {
      totalLost: lostPetsSnapshot.size,
      totalFound: foundPetsSnapshot.size,
      totalSightings: sightingsSnapshot.size,
      activeCases: lostPetsSnapshot.size
    }
  }
}