'use client'

import { useAuth } from './use-auth'
import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Hardcoded admin email — always grants admin access regardless of Firestore
const ADMIN_EMAIL = 'islamalamin1989@gmail.com'

export function useAdmin() {
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    // Hardcoded owner email always has admin access
    if (user.email === ADMIN_EMAIL) {
      setIsAdmin(true)
      setLoading(false)
      return
    }

    // Also allow users listed in Firestore admins collection
    const checkAdminStatus = async () => {
      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid))
        setIsAdmin(adminDoc.exists())
      } catch {
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [user, authLoading])

  return { isAdmin, loading, user }
}
