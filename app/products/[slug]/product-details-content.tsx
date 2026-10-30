'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft, ShoppingCart } from 'lucide-react'
import type { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'

interface ProductDetailsContentProps {
  product: Product
}

export function ProductDetailsContent({ product }: ProductDetailsContentProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    if (quantity > 0) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0] || '/placeholder.png',
      })
      toast.success(`Added ${quantity} item(s) to cart`)
      setQuantity(1)
    }
  }

  const stockStatus = {
    'in-stock': { label: 'In Stock', color: 'bg-green-100 text-green-800' },
    'low-stock': { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' },
    'out-of-stock': { label: 'Out of Stock', color: 'bg-red-100 text-red-800' },
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link href="/products" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted mb-4">
              <Image
                src={product.images[selectedImage] || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${stockStatus[product.stockStatus].color}`}>
                {stockStatus[product.stockStatus].label}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                      index === selectedImage ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-primary mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.shortDescription}</p>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-border">
              {product.price ? (
                <p className="text-3xl font-bold text-primary">Tk {product.price.toLocaleString()}</p>
              ) : (
                <p className="text-lg font-semibold text-secondary">Contact for Price</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6 pb-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground mb-3">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-6 pb-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground mb-3">Specifications</h2>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Info */}
            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-sm text-muted-foreground">
                Available Stock: <span className="font-semibold text-foreground">{product.stockQuantity} units</span>
              </p>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stockStatus === 'out-of-stock'}
                    className="px-4 py-2 hover:bg-muted disabled:opacity-50"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stockQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(product.stockQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                    disabled={product.stockStatus === 'out-of-stock'}
                    className="w-16 text-center py-2 border-0 outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    disabled={product.stockStatus === 'out-of-stock'}
                    className="px-4 py-2 hover:bg-muted disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stockStatus === 'out-of-stock'}
                size="lg"
                className="w-full"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              <Button variant="outline" size="lg" className="w-full">
                <a href="mailto:islamalamin1989@gmail.com">Request a Quote</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
