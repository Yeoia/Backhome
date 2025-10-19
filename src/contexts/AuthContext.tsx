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
import { auth } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
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
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, displayName?: string): Promise<UserCredential> => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    
    if (displayName && result.user) {
      // Actualizar perfil del usuario
      await result.user.updateProfile({ displayName })
      
      // Actualizar documento en Firestore
      const userDocRef = doc(db, 'users', result.user.uid)
      await setDoc(userDocRef, {
        displayName
      }, { merge: true })
    }
    
    return result
  }

  const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth)
  }

  const signInWithGoogle = async (idToken: string): Promise<UserCredential> => {
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