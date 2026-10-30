'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const getTotal = useCartStore((state) => state.getTotal)

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
            <Link href="/products">
              <Button>
                Continue Shopping <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="border border-border rounded-lg p-4 bg-card">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="font-semibold text-foreground hover:text-primary transition">{item.name}</h3>
                    </Link>
                    {item.price && <p className="text-primary font-semibold">Tk {item.price.toLocaleString()}</p>}
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-muted"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center py-1 border-0 outline-none"
                      />
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {item.price ? `Tk ${(item.price * item.quantity).toLocaleString()}` : '—'}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-muted/30 rounded-lg border border-border p-6 h-fit sticky top-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4 pb-4 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">Tk {getTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-secondary">To be calculated</span>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">Tk {getTotal().toLocaleString()}</span>
            </div>

            <Link href="/checkout" className="w-full">
              <Button className="w-full mb-2">Proceed to Checkout</Button>
            </Link>
            <Link href="/products">
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
