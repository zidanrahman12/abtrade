import type { Order } from '@/lib/types'

interface OrderStatusBadgeProps {
  status: Order['status']
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  )
}
