'use client'

import Link from 'next/link'
import { ArrowRight, Shield, Truck, Headphones, Star, Phone, Mail, MapPin, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Product, Category } from '@/lib/types'
import { ProductCard } from '@/components/product-card'
import { LoadingSpinner } from '@/components/loading-spinner'

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsSnap = await getDocs(
          query(collection(db, 'products'), where('featured', '==', true), limit(6))
        )
        setFeaturedProducts(
          productsSnap.docs.map((doc) => ({
            ...(doc.data() as Omit<Product, 'id'>),
            id: doc.id,
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          }))
        )
        const categoriesSnap = await getDocs(collection(db, 'categories'))
        setCategories(
          categoriesSnap.docs.map((doc) => ({
            ...(doc.data() as Omit<Category, 'id'>),
            id: doc.id,
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          }))
        )
      } catch (error) {
        console.error('Error fetching home data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-white">
        {/* Top lime accent bar */}
        <div className="h-1.5 w-full bg-[#7FCC29]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#7FCC29]/10 text-[#5a9e1c] mb-5 border border-[#7FCC29]/30">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7FCC29] animate-pulse" />
                Bangladesh&apos;s Trusted Garments Supplier
              </span>

              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
                Quality{' '}
                <span className="text-[#7FCC29]">Garments</span>
                {' '}&amp;{' '}
                <span className="text-[#3B7BC4]">Washing</span>{' '}
                Accessories
              </h1>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                All Kinds of Garments &amp; Washing Accessories Seller &amp; Suppliers.
                Premium quality products for your business needs — delivered across Bangladesh.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/products">
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    Explore Products <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="h-12 px-6 text-base border-[#3B7BC4] text-[#3B7BC4] hover:bg-[#3B7BC4]/5">
                    Contact Us
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-5 mt-10">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4 text-[#7FCC29]" />
                  Quality Guaranteed
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Truck className="h-4 w-4 text-[#7FCC29]" />
                  Fast Delivery
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Headphones className="h-4 w-4 text-[#7FCC29]" />
                  24/7 Support
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="hidden md:block">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#f0fce8] to-[#eff6ff] aspect-[4/3] flex items-center justify-center border border-gray-100 shadow-sm">
                <div className="text-center p-8">
                  <div className="flex justify-center mb-4">
                    <div className="h-20 w-20 rounded-full bg-[#7FCC29]/15 flex items-center justify-center">
                      <Package className="h-10 w-10 text-[#7FCC29]" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mb-1">AB TRADE</p>
                  <p className="text-sm text-gray-500">Garments &amp; Washing Accessories</p>
                  <div className="mt-6 flex justify-center gap-2 flex-wrap">
                    {['Threads', 'Zippers', 'Buttons', 'Labels', 'Detergents'].map((t) => (
                      <span key={t} className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200 shadow-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      {!loading && (
        <section className="py-16 bg-gray-50 border-y border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Product Categories</h2>
              <p className="text-gray-500">Browse our wide range of garments &amp; washing accessories</p>
            </div>

            {categories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.id}`}
                    className="group bg-white rounded-xl border border-gray-100 p-5 text-center hover:border-[#7FCC29]/50 hover:shadow-md transition-all"
                  >
                    <div className="h-12 w-12 rounded-xl bg-[#7FCC29]/10 mx-auto mb-3 flex items-center justify-center group-hover:bg-[#7FCC29]/20 transition-colors">
                      <Package className="h-6 w-6 text-[#7FCC29]" />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm group-hover:text-[#7FCC29] transition-colors">{cat.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{cat.productCount ?? 0} products</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Garments Accessories', 'Washing Accessories', 'Textile Accessories', 'Other Accessories'].map((name) => (
                  <Link key={name} href="/products" className="group bg-white rounded-xl border border-gray-100 p-5 text-center hover:border-[#7FCC29]/50 hover:shadow-md transition-all">
                    <div className="h-12 w-12 rounded-xl bg-[#7FCC29]/10 mx-auto mb-3 flex items-center justify-center">
                      <Package className="h-6 w-6 text-[#7FCC29]" />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">{name}</p>
                  </Link>
                ))}
              </div>
            )}

            <div className="text-center mt-8">
              <Link href="/categories">
                <Button variant="outline" className="border-[#3B7BC4] text-[#3B7BC4] hover:bg-[#3B7BC4]/5">
                  View All Categories <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ── */}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-500">Handpicked quality items for your business</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center">
              <Link href="/products">
                <Button size="lg" variant="outline">
                  View All Products <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* ── WHY CHOOSE ── */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose AB TRADE?</h2>
            <p className="text-gray-500">Industry-leading products and reliable service</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Star, title: 'Quality Products', desc: 'Premium grade garments and washing accessories for all business sizes.', color: 'primary' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Quick and reliable shipping to your doorstep across Bangladesh.', color: 'secondary' },
              { icon: Shield, title: 'Competitive Pricing', desc: 'Best market prices with no compromise on quality.', color: 'primary' },
              { icon: Headphones, title: 'Expert Support', desc: 'Dedicated customer support — call or email anytime.', color: 'secondary' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${color === 'primary' ? 'bg-[#7FCC29]/10' : 'bg-[#3B7BC4]/10'}`}>
                  <Icon className={`h-6 w-6 ${color === 'primary' ? 'text-[#7FCC29]' : 'text-[#3B7BC4]'}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-[#3B7BC4]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Looking for Garments &amp; Washing Accessories?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Contact us today for wholesale inquiries, bulk orders, or to discuss your specific requirements.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-[#7FCC29] hover:bg-[#6ab822] text-white border-0 h-12 px-6">
                Browse Products
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-6">
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT STRIP ── */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="tel:01772-170145" className="flex items-center gap-4 p-5 rounded-xl border border-gray-100 hover:border-[#7FCC29]/40 hover:shadow-sm transition-all group">
              <div className="h-11 w-11 rounded-full bg-[#7FCC29]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#7FCC29]/20 transition-colors">
                <Phone className="h-5 w-5 text-[#7FCC29]" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Call Us</p>
                <p className="font-semibold text-gray-800 group-hover:text-[#7FCC29] transition-colors">01772-170145</p>
                <p className="text-xs text-gray-400">Md. Al-Amin</p>
              </div>
            </a>

            <a href="mailto:islamalamin1989@gmail.com" className="flex items-center gap-4 p-5 rounded-xl border border-gray-100 hover:border-[#3B7BC4]/40 hover:shadow-sm transition-all group">
              <div className="h-11 w-11 rounded-full bg-[#3B7BC4]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#3B7BC4]/20 transition-colors">
                <Mail className="h-5 w-5 text-[#3B7BC4]" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email Us</p>
                <p className="font-semibold text-gray-800 text-sm group-hover:text-[#3B7BC4] transition-colors break-all">islamalamin1989@gmail.com</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-5 rounded-xl border border-gray-100">
              <div className="h-11 w-11 rounded-full bg-[#7FCC29]/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-[#7FCC29]" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Address</p>
                <p className="font-semibold text-gray-800 text-sm">Ovijan-207, Auchpara College Road</p>
                <p className="text-xs text-gray-400">Tongi, Gazipur-1230, Bangladesh</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
