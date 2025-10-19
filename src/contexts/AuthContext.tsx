'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  UserCredential
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

interface UserProfile {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: Date
  lastLogin: Date
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<UserCredential>
  signUp: (email: string, password: string, displayName?: string) => Promise<UserCredential>
  signOut: () => Promise<void>
  signInWithGoogle: (idToken: string) => Promise<UserCredential>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Si Firebase no está configurado, no hacemos nada
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user && db) {
        try {
          // Obtener o crear perfil de usuario
          const userDocRef = doc(db, 'users', user.uid)
          const userDoc = await getDoc(userDocRef)
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile)
            // Actualizar último login
            await setDoc(userDocRef, {
              lastLogin: new Date()
            }, { merge: true })
          } else {
            // Crear nuevo perfil
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              createdAt: new Date(),
              lastLogin: new Date()
            }
            await setDoc(userDocRef, newProfile)
            setUserProfile(newProfile)
          }
        } catch (error) {
          console.error('Error managing user profile:', error)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string): Promise<UserCredential> => {
    if (!auth) throw new Error('Firebase Auth not available')
    return await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, displayName?: string): Promise<UserCredential> => {
    if (!auth) throw new Error('Firebase Auth not available')
    const result = await createUserWithEmailAndPassword(auth, email, password)
    
    if (displayName && result.user && db) {
      try {
        // Actualizar perfil del usuario
        await result.user.updateProfile({ displayName })
        
        // Actualizar documento en Firestore
        const userDocRef = doc(db, 'users', result.user.uid)
        await setDoc(userDocRef, {
          displayName
        }, { merge: true })
      } catch (error) {
        console.error('Error updating user profile:', error)
      }
    }
    
    return result
  }

  const signOut = async (): Promise<void> => {
    if (!auth) throw new Error('Firebase Auth not available')
    await firebaseSignOut(auth)
  }

  const signInWithGoogle = async (idToken: string): Promise<UserCredential> => {
    if (!auth) throw new Error('Firebase Auth not available')
    const credential = GoogleAuthProvider.credential(idToken)
    return await signInWithCredential(auth, credential)
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}