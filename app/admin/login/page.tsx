'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { ABTradeLogo } from '@/components/ab-trade-logo'
import { LoadingSpinner } from '@/components/loading-spinner'
import toast from 'react-hot-toast'
import { Lock, Mail } from 'lucide-react'

const ADMIN_EMAIL = 'islamalamin1989@gmail.com'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      toast.error('Access denied. Not an admin account.')
      return
    }
    setLoading(true)
    try {
      // Try to sign in first
      await signInWithEmailAndPassword(auth, email.trim(), password)
      toast.success('Welcome, Admin!')
      router.push('/admin')
      return
    } catch (error: any) {
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/invalid-email'
      ) {
        // Account doesn't exist yet — create it automatically on first login
        try {
          await createUserWithEmailAndPassword(auth, email.trim(), password)
          toast.success('Admin account created. Welcome!')
          router.push('/admin')
        } catch (createError: any) {
          toast.error('Could not create admin account: ' + createError.message)
        }
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password.')
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many attempts. Please wait a few minutes and try again.')
      } else {
        toast.error('Login failed: ' + (error.message || 'Unknown error'))
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header banner */}
          <div className="bg-[#7FCC29] px-8 py-7 text-center">
            <ABTradeLogo className="h-12 w-auto mx-auto" variant="white" showTagline={false} />
            <p className="mt-3 text-white/90 text-sm font-medium tracking-wide">ADMIN PANEL</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h1 className="text-xl font-bold text-gray-800 mb-1">Administrator Login</h1>
            <p className="text-sm text-gray-500 mb-6">Sign in to manage AB TRADE</p>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@email.com"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7FCC29] focus:border-transparent transition bg-gray-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7FCC29] focus:border-transparent transition bg-gray-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#3B7BC4] hover:bg-[#2d63a8] text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
              >
                {loading ? <><LoadingSpinner size="sm" /> Signing in...</> : 'Sign In to Admin Panel'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Not an admin?{' '}
          <a href="/" className="text-[#3B7BC4] hover:underline">Go to website</a>
        </p>
      </div>
    </div>
  )
}
