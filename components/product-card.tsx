'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '@/lib/types'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { Button } from './ui/button'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || '/placeholder.png',
    })
    toast.success('Added to cart!')
  }

  const stockStatus = {
    'in-stock': { label: 'In Stock', color: 'bg-green-100 text-green-800' },
    'low-stock': { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' },
    'out-of-stock': { label: 'Out of Stock', color: 'bg-red-100 text-red-800' },
  }

  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.images[0] || '/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${stockStatus[product.stockStatus].color}`}>
          {stockStatus[product.stockStatus].label}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        <div className="flex-1">
          <p className="text-xs font-semibold text-primary mb-2">{product.category}</p>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.shortDescription}</p>
        </div>

        {/* Price and Actions */}
        <div className="space-y-3">
          {product.price ? (
            <p className="text-lg font-bold text-primary">
              Tk {product.price.toLocaleString()}
            </p>
          ) : (
            <p className="text-sm font-semibold text-secondary">Contact for Price</p>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              disabled={product.stockStatus === 'out-of-stock'}
              variant="default"
              size="sm"
              className="flex-1"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Link href={`/products/${product.slug}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
