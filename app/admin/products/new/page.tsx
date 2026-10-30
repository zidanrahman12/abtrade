'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { useAdmin } from '@/hooks/use-admin'
import { AdminSidebar } from '@/components/admin-sidebar'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Upload, X, ImagePlus } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function NewProductPage() {
  const router = useRouter()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [saving, setSaving] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const [form, setForm] = useState({
    name: '',
    slug: '',
    categoryId: '',
    shortDescription: '',
    description: '',
    price: '',
    unit: 'pcs',
    stockQuantity: '',
    stockStatus: 'in_stock',
    featured: false,
    specifications: '',
  })

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push('/admin/login')
    }
  }, [isAdmin, adminLoading, router])

  if (adminLoading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
      // Auto-generate slug from name
      if (name === 'name') {
        setForm((prev) => ({
          ...prev,
          name: value,
          slug: value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        }))
      }
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (imageFiles.length + files.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }
    const newFiles = [...imageFiles, ...files]
    setImageFiles(newFiles)

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Product name is required'); return }

    setSaving(true)
    try {
      // Upload images to Firebase Storage
      const imageUrls: string[] = []
      for (const file of imageFiles) {
        const storageRef = ref(storage, `products/${Date.now()}-${file.name}`)
        const snapshot = await uploadBytes(storageRef, file)
        const url = await getDownloadURL(snapshot.ref)
        imageUrls.push(url)
      }

      await addDoc(collection(db, 'products'), {
        name: form.name.trim(),
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        categoryId: form.categoryId.trim() || 'general',
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        price: form.price ? parseFloat(form.price) : null,
        unit: form.unit,
        stockQuantity: form.stockQuantity ? parseInt(form.stockQuantity) : 0,
        stockStatus: form.stockStatus,
        images: imageUrls,
        featured: form.featured,
        specifications: form.specifications
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      toast.success('Product added successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin/products">
              <button className="p-2 rounded-lg hover:bg-gray-200 transition">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-sm text-gray-500">Fill in the details to add a new product</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left column — main info */}
              <div className="lg:col-span-2 space-y-5">
                {/* Basic Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                  <h2 className="font-semibold text-gray-800">Basic Information</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <Input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Button - Metal 15mm" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                    <Input name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated" />
                    <p className="text-xs text-gray-400 mt-1">Auto-generated from name. You can edit it.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <Input name="categoryId" value={form.categoryId} onChange={handleChange} placeholder="e.g. garments-accessories" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                    <Input name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="One-line summary shown on product card" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                    <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Detailed product description..." rows={4} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specifications (one per line)</label>
                    <Textarea
                      name="specifications"
                      value={form.specifications}
                      onChange={handleChange}
                      placeholder={"Material: Metal\nSize: 15mm\nColor: Silver"}
                      rows={4}
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h2 className="font-semibold text-gray-800 mb-3">Product Images</h2>
                  <p className="text-xs text-gray-400 mb-4">Upload up to 5 images. First image is the main image.</p>

                  {/* Image previews */}
                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                          <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          {i === 0 && (
                            <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">Main</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageFiles.length >= 5}
                    className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-xl px-6 py-4 text-sm text-gray-500 hover:border-[#7FCC29] hover:text-[#7FCC29] transition w-full justify-center disabled:opacity-50"
                  >
                    <ImagePlus className="h-5 w-5" />
                    {imageFiles.length === 0 ? 'Click to upload images' : `Add more images (${imageFiles.length}/5)`}
                  </button>
                </div>
              </div>

              {/* Right column — pricing & stock */}
              <div className="space-y-5">
                <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                  <h2 className="font-semibold text-gray-800">Pricing & Stock</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (Tk)</label>
                    <Input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="Leave empty = Contact for Price" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      name="unit"
                      value={form.unit}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7FCC29]"
                    >
                      <option value="pcs">Pieces (pcs)</option>
                      <option value="dozen">Dozen</option>
                      <option value="gross">Gross (144)</option>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="roll">Roll</option>
                      <option value="box">Box</option>
                      <option value="meter">Meter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <Input name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={handleChange} placeholder="0" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                    <select
                      name="stockStatus"
                      value={form.stockStatus}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7FCC29]"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="pre_order">Pre-Order</option>
                    </select>
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleChange}
                      className="w-4 h-4 accent-[#7FCC29]"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Featured Product</p>
                      <p className="text-xs text-gray-400">Show on homepage featured section</p>
                    </div>
                  </label>
                </div>

                {/* Save buttons */}
                <div className="space-y-3">
                  <Button type="submit" disabled={saving} className="w-full">
                    {saving ? (
                      <span className="flex items-center gap-2"><LoadingSpinner size="sm" /> Saving...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Upload className="h-4 w-4" /> Save Product</span>
                    )}
                  </Button>
                  <Link href="/admin/products">
                    <Button variant="outline" className="w-full" type="button">Cancel</Button>
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
