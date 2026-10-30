'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useCartStore } from '@/lib/store'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSpinner } from '@/components/loading-spinner'
import toast from 'react-hot-toast'

const WHATSAPP_NUMBER = '8801772170145'

function buildWhatsAppMessage(orderId: string, formData: Record<string, string>, items: any[], total: number): string {
  const itemLines = items
    .map((item) => `  - ${item.name} x${item.quantity}${item.price ? ` = Tk ${(item.price * item.quantity).toLocaleString()}` : ''}`)
    .join('\n')

  return encodeURIComponent(
    `*NEW ORDER - AB TRADE*\n` +
    `================================\n` +
    `*Order ID:* ${orderId}\n\n` +
    `*Customer Details:*\n` +
    `Name: ${formData.customerName}\n` +
    `Phone: ${formData.customerPhone}\n` +
    `Email: ${formData.customerEmail}\n` +
    (formData.companyName ? `Company: ${formData.companyName}\n` : '') +
    `\n*Delivery Address:*\n` +
    `${formData.deliveryAddress}\n` +
    `City: ${formData.city}\n` +
    (formData.notes ? `\nNotes: ${formData.notes}\n` : '') +
    `\n*Ordered Items:*\n${itemLines}\n` +
    `\n*Total Amount: Tk ${total.toLocaleString()}*\n` +
    `================================\n` +
    `Please confirm this order.`
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const items    = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const clearCart = useCartStore((state) => state.clearCart)

  const [formData, setFormData] = useState({
    customerName: user?.displayName || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    companyName: '',
    deliveryAddress: '',
    city: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Login Required</h1>
          <p className="text-muted-foreground mb-6">Please log in to proceed with checkout</p>
          <Link href="/login"><Button>Go to Login</Button></Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add items before checking out</p>
          <Link href="/products"><Button>Continue Shopping</Button></Link>
        </div>
      </div>
    )
  }

  const total = getTotal()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.customerName || !formData.customerPhone || !formData.deliveryAddress || !formData.city) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)

    try {
      const orderId = `ORD-${Date.now()}`

      // Save order to Firestore
      await addDoc(collection(db, 'orders'), {
        id: orderId,
        customerId: user.uid,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        companyName: formData.companyName || null,
        deliveryAddress: formData.deliveryAddress,
        city: formData.city,
        notes: formData.notes || null,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: total,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // Build WhatsApp message with full customer & order details
      const waMessage = buildWhatsAppMessage(orderId, formData, items, total)
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`

      clearCart()
      toast.success('Order placed! Opening WhatsApp to confirm...')

      // Open WhatsApp in new tab, then redirect to confirmation
      window.open(waUrl, '_blank')
      router.push(`/order-confirmation?orderId=${orderId}`)
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Delivery Information</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                    <Input name="customerName" value={formData.customerName} onChange={handleChange} required placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number *</label>
                    <Input name="customerPhone" value={formData.customerPhone} onChange={handleChange} required placeholder="01712345678" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                    <Input name="customerEmail" type="email" value={formData.customerEmail} onChange={handleChange} required placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Company Name <span className="text-muted-foreground text-xs">(optional)</span></label>
                    <Input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Your company" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Delivery Address *</label>
                  <Textarea name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} required placeholder="Full delivery address" rows={3} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">City / District *</label>
                  <Input name="city" value={formData.city} onChange={handleChange} required placeholder="e.g. Gazipur, Dhaka" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Notes <span className="text-muted-foreground text-xs">(optional)</span></label>
                  <Textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any special instructions..." rows={2} />
                </div>
              </div>

              {/* WhatsApp notice */}
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <svg className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.532 5.845L.057 24l6.304-1.649A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.214-3.724.975.993-3.63-.234-.373A9.818 9.818 0 0112 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
                </svg>
                <div>
                  <p className="text-sm font-semibold text-green-800">Order via WhatsApp</p>
                  <p className="text-xs text-green-700 mt-0.5">
                    After placing your order, WhatsApp will open automatically so we can confirm your order directly with Md. Al-Amin (+880 1772-170145).
                  </p>
                </div>
              </div>

              <Button type="submit" disabled={loading} size="lg" className="w-full text-base h-12">
                {loading
                  ? <span className="flex items-center gap-2"><LoadingSpinner size="sm" /> Placing Order...</span>
                  : 'Place Order & Open WhatsApp'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 pb-4 border-b border-border max-h-80 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} <span className="font-medium text-foreground">x{item.quantity}</span></span>
                  <span className="font-medium text-foreground">
                    {item.price ? `Tk ${(item.price * item.quantity).toLocaleString()}` : 'TBD'}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4 pb-4 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">Tk {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-[#3B7BC4] font-medium">Calculated on delivery</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-2xl font-bold text-[#7FCC29]">Tk {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
