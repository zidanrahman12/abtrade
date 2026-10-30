'use client'

import { useAdmin } from '@/hooks/use-admin'
import { AdminSidebar } from '@/components/admin-sidebar'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Product } from '@/lib/types'
import { Trash2, Edit, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminProductsPage() {
  const { isAdmin, loading } = useAdmin()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/admin/login')
    }
  }, [isAdmin, loading, router])

  useEffect(() => {
    if (!isAdmin) return

    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'))
        const productsData = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Omit<Product, 'id'>),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        }))
        setProducts(productsData)
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Failed to load products')
      } finally {
        setProductsLoading(false)
      }
    }

    fetchProducts()
  }, [isAdmin])

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await deleteDoc(doc(db, 'products', productId))
      setProducts(products.filter((p) => p.id !== productId))
      toast.success('Product deleted successfully')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
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

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Products</h1>
              <p className="text-muted-foreground">Manage your product catalog</p>
            </div>
            <Link href="/admin/products/new">
              <Button className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Product
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
              <p className="text-lg text-muted-foreground mb-4">No products yet</p>
              <Link href="/admin/products/new">
                <Button>Create First Product</Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/30 transition">
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{product.categoryId}</td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {product.price ? `Tk ${product.price.toLocaleString()}` : 'Contact for Price'}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{product.stockQuantity}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-destructive hover:bg-destructive/10 p-2 rounded transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
