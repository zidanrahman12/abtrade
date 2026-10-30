'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Search, ShoppingCart, User, LogOut } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { ABTradeLogo } from './ab-trade-logo'
import { useAuth } from '@/hooks/use-auth'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const itemCount = useCartStore((state) => state.getItemCount())

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error: any) {
      console.error('Logout failed:', error.message)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <ABTradeLogo className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium text-foreground hover:text-primary transition">
              Products
            </Link>
            <Link href="/categories" className="text-sm font-medium text-foreground hover:text-primary transition">
              Categories
            </Link>
            <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-foreground hover:text-primary transition">
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <Link href="/search" className="p-2 hover:bg-muted rounded-lg transition">
              <Search className="h-5 w-5 text-foreground" />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-muted rounded-lg transition">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="p-2 hover:bg-muted rounded-lg transition hidden sm:block">
                  <User className="h-5 w-5 text-foreground" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden border-t border-border py-4 space-y-2">
            <Link href="/" className="block px-4 py-2 rounded-lg hover:bg-muted transition">
              Home
            </Link>
            <Link href="/products" className="block px-4 py-2 rounded-lg hover:bg-muted transition">
              Products
            </Link>
            <Link href="/categories" className="block px-4 py-2 rounded-lg hover:bg-muted transition">
              Categories
            </Link>
            <Link href="/about" className="block px-4 py-2 rounded-lg hover:bg-muted transition">
              About
            </Link>
            <Link href="/contact" className="block px-4 py-2 rounded-lg hover:bg-muted transition">
              Contact
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-muted transition">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition">
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
