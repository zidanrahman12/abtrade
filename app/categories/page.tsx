'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Category } from '@/lib/types'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Tag } from 'lucide-react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(db, 'categories'))
        const data = snap.docs.map((doc) => ({
          ...(doc.data() as Omit<Category, 'id'>),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        }))
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-2">Product Categories</h1>
          <p className="text-muted-foreground text-lg">Browse all categories of garments and washing accessories</p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl bg-muted/20">
            <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-40" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No categories yet</h2>
            <p className="text-muted-foreground">Categories will appear here once the admin adds them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group block rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200"
              >
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <Tag className="h-7 w-7 text-primary" />
                  )}
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {category.name}
                </h3>

                {/* Description */}
                {category.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{category.description}</p>
                )}

                {/* Product count */}
                <p className="text-xs font-medium text-secondary">
                  {category.productCount ?? 0} product{(category.productCount ?? 0) !== 1 ? 's' : ''}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
