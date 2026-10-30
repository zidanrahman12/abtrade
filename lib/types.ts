export interface Product {
  id: string
  name: string
  slug: string
  categoryId: string
  shortDescription: string
  description: string
  price?: number
  unit: string
  stockQuantity: number
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock'
  images: string[]
  specifications?: Record<string, string>
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  productCount: number
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  productId: string
  name: string
  price?: number
  quantity: number
  image: string
}

export interface OrderItem {
  productId: string
  name: string
  price?: number
  quantity: number
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  companyName?: string
  deliveryAddress: string
  city: string
  notes?: string
  items: OrderItem[]
  totalAmount?: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  address?: string
  city?: string
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  createdAt: Date
}
