'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/loading-spinner'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'ORDER-UNKNOWN'

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full px-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-6">Your order has been received and will be processed soon.</p>

          <div className="bg-muted/30 rounded-lg border border-border p-6 mb-8">
            <p className="text-sm text-muted-foreground mb-2">Order ID</p>
            <p className="text-2xl font-bold text-primary font-mono break-all">{orderId}</p>
          </div>

          <p className="text-muted-foreground mb-8">
            You will receive an email confirmation shortly. You can track your order status in your dashboard.
          </p>

          <div className="space-y-3">
            <Link href="/dashboard" className="block">
              <Button className="w-full">
                View My Orders <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/products" className="block">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
