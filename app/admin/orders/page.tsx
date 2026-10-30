'use client'

import { useAdmin } from '@/hooks/use-admin'
import { AdminSidebar } from '@/components/admin-sidebar'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Order } from '@/lib/types'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminOrdersPage() {
  const { isAdmin, loading } = useAdmin()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/admin/login')
    }
  }, [isAdmin, loading, router])

  useEffect(() => {
    if (!isAdmin) return

    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'))
        const ordersData = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Omit<Order, 'id'>),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        }))
        setOrders(ordersData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to load orders')
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchOrders()
  }, [isAdmin])

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus })
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
      toast.success('Order status updated')
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order')
    }
  }

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

  const statuses: Order['status'][] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground">Manage customer orders</p>
          </div>

          {ordersLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
              <p className="text-lg text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{order.customerName} - {order.customerPhone}</span>
                    <span>Tk {order.totalAmount?.toLocaleString() || '—'}</span>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="mt-4 pt-4 border-t border-border space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">Customer Info</p>
                          <p className="text-sm text-foreground">{order.customerName}</p>
                          <p className="text-sm text-foreground">{order.customerEmail}</p>
                          <p className="text-sm text-foreground">{order.customerPhone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">Delivery Address</p>
                          <p className="text-sm text-foreground">{order.deliveryAddress}</p>
                          <p className="text-sm text-foreground">{order.city}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground font-semibold mb-2">Items</p>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-muted-foreground">
                              <span>{item.name} x {item.quantity}</span>
                              <span>{item.price ? `Tk ${(item.price * item.quantity).toLocaleString()}` : '—'}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <p className="text-xs text-muted-foreground font-semibold mb-3">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                          {statuses.map((status) => (
                            <button
                              key={status}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(order.id, status)
                              }}
                              className={`px-3 py-1 rounded text-sm font-medium transition ${
                                order.status === status
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-foreground hover:bg-muted/80'
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
