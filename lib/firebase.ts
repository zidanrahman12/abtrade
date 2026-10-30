import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCWQrXIE9B7XcmDfUqNt55maw7RuN0Ah4I",
  authDomain: "ab-trade-a86a5.firebaseapp.com",
  projectId: "ab-trade-a86a5",
  storageBucket: "ab-trade-a86a5.firebasestorage.app",
  messagingSenderId: "42369084496",
  appId: "1:42369084496:web:dcdc28f8a30e84aa307555",
  measurementId: "G-4S0JLSKY4B",
}

// Prevent duplicate app initialization (important for Next.js HMR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
