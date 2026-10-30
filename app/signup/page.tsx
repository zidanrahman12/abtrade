'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ABTradeLogo } from '@/components/ab-trade-logo'
import { LoadingSpinner } from '@/components/loading-spinner'
import toast from 'react-hot-toast'

function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use': return 'An account with this email already exists.'
    case 'auth/invalid-email': return 'Please enter a valid email address.'
    case 'auth/weak-password': return 'Password must be at least 6 characters.'
    case 'auth/popup-closed-by-user': return 'Google sign-up was cancelled.'
    default: return 'Sign up failed. Please try again.'
  }
}

async function saveUserToFirestore(uid: string, name: string, email: string) {
  await setDoc(
    doc(db, 'users', uid),
    { name, email, uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
    { merge: true }
  )
}

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: name })
      await saveUserToFirestore(cred.user.uid, name, email)
      toast.success('Account created successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(getAuthErrorMessage(error.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)
      await saveUserToFirestore(
        cred.user.uid,
        cred.user.displayName || 'User',
        cred.user.email || ''
      )
      toast.success('Account created successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error(getAuthErrorMessage(error.code))
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12" style={{ background: 'linear-gradient(135deg, #f0fce8 0%, #eff6ff 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <ABTradeLogo className="h-14 w-auto" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-foreground mb-1 text-center">Create Account</h1>
          <p className="text-center text-muted-foreground text-sm mb-6">Join AB TRADE today</p>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all mb-5 disabled:opacity-60"
          >
            {googleLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-muted-foreground uppercase tracking-wider">or sign up with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 text-base">
              {loading ? <><LoadingSpinner size="sm" />&nbsp;Creating account...</> : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-[#7FCC29] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
