'use client'

import { useEffect, useState } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { AdminSidebar } from '@/components/admin-sidebar'
import { LoadingSpinner } from '@/components/loading-spinner'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Package, ShoppingBag, Users, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const { isAdmin, loading, user } = useAdmin()
  const router = useRouter()
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    customers: 0,
    pendingOrders: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/admin/login')
    }
  }, [isAdmin, loading, router])

  useEffect(() => {
    if (!isAdmin) return

    const fetchStats = async () => {
      try {
        const [productsSnap, categoriesSnap, ordersSnap, customersSnap, pendingSnap] = await Promise.all([
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'categories')),
          getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'users')),
          getDocs(query(collection(db, 'orders'), where('status', '==', 'pending'))),
        ])

        setStats({
          products: productsSnap.size,
          categories: categoriesSnap.size,
          orders: ordersSnap.size,
          customers: customersSnap.size,
          pendingOrders: pendingSnap.size,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [isAdmin])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to AB TRADE Admin Panel</p>
          </div>

          {/* Stats Grid */}
          {statsLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard icon={Package} label="Total Products" value={stats.products} color="primary" />
              <StatCard icon={Zap} label="Categories" value={stats.categories} color="secondary" />
              <StatCard icon={ShoppingBag} label="Total Orders" value={stats.orders} color="primary" />
              <StatCard icon={Users} label="Customers" value={stats.customers} color="secondary" />
              <StatCard icon={ShoppingBag} label="Pending Orders" value={stats.pendingOrders} color="destructive" highlight />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  color: string
  highlight?: boolean
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    destructive: 'bg-destructive/10 text-destructive',
  }

  return (
    <div className={`rounded-lg border border-border p-6 ${highlight ? 'bg-muted/30' : 'bg-card'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
