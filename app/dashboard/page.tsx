'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/protected-route'
import { LoadingSpinner } from '@/components/loading-spinner'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Order } from '@/lib/types'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ChevronRight, Package } from 'lucide-react'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('customerId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        const ordersData = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Omit<Order, 'id'>),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        }))
        setOrders(ordersData)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.displayName || 'Customer'}</p>
        </div>

        {/* Profile Info */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Profile Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-semibold text-foreground">{user?.displayName || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold text-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">My Orders</h2>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground mb-4">No orders yet</p>
              <Link href="/products" className="text-primary hover:underline">
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Order {order.id}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                    <ChevronRight className="h-5 w-5 text-muted-foreground ml-2" />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{order.items.length} items</span>
                    <span className="font-semibold text-foreground">
                      {order.totalAmount ? `Tk ${order.totalAmount.toLocaleString()}` : 'Amount pending'}
                    </span>
                  </div>

                  {/* Expanded Details */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Delivery Address</p>
                          <p className="text-sm font-medium text-foreground">{order.deliveryAddress}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Phone</p>
                          <p className="text-sm font-medium text-foreground">{order.customerPhone}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2 font-semibold">Items</p>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-muted-foreground">
                              <span>
                                {item.name} x {item.quantity}
                              </span>
                              <span>
                                {item.price ? `Tk ${(item.price * item.quantity).toLocaleString()}` : '—'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between font-semibold text-foreground">
                          <span>Total</span>
                          <span className="text-primary">
                            {order.totalAmount ? `Tk ${order.totalAmount.toLocaleString()}` : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
