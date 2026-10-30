import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '@/lib/types'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <div className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-all cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={category.image || '/placeholder.png'}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition">{category.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{category.productCount} products</p>
        </div>
      </div>
    </Link>
  )
}
