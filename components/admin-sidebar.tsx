'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutGrid, Package, Grid, ShoppingBag, Users, LogOut } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { ABTradeLogo } from './ab-trade-logo'

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { href: '/admin', icon: LayoutGrid, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/categories', icon: Grid, label: 'Categories' },
    { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { href: '/admin/customers', icon: Users, label: 'Customers' },
  ]

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/admin/login')
  }

  return (
    <aside className="w-64 bg-background border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <Link href="/admin" className="p-4 border-b border-border">
        <ABTradeLogo className="h-8 w-auto" />
      </Link>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
