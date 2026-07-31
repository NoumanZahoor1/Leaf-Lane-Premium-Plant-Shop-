'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/useStore'
import { ShoppingCart, Minus, Plus, ArrowLeft, Droplets, Sun, Heart, Share2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  stock: number
  image: string | null
  careLevel: string
  light: string
  water: string
  featured: boolean
  category: { name: string; slug: string }
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const { addItem } = useCartStore()

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => {
        if (!r.ok) { router.push('/products'); return null }
        return r.json()
      })
      .then((data) => {
        if (data) setProduct(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug, router])

  const handleAddToCart = () => {
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, image: product.image, slug: product.slug })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🌿</div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!product) return null

  const careLevelColor = { Easy: 'text-emerald-700 bg-emerald-50', Medium: 'text-amber-700 bg-amber-50', Hard: 'text-rose-700 bg-rose-50' }[product.careLevel] || ''

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-green-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-green-700 transition-colors">Plants</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-green-700 transition-colors">{product.category.name}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div>
              <div className="relative rounded-3xl overflow-hidden bg-green-50 h-96 lg:h-[500px]">
                {product.image ? (
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl">🌿</div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <Link href={`/products?category=${product.category.slug}`} className="text-sm text-green-600 font-medium hover:text-green-800">
                  {product.category.name}
                </Link>
                <div className="flex gap-2">
                  <button onClick={() => setWishlisted(!wishlisted)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Wishlist">
                    <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Share">
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl font-bold text-green-800">${product.price.toFixed(2)}</span>
                {product.stock > 0 ? (
                  <span className="text-sm text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium">✓ In Stock ({product.stock})</span>
                ) : (
                  <span className="text-sm text-red-700 bg-red-50 px-3 py-1 rounded-full font-medium">Out of Stock</span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

              {/* Care Info */}
              <div className="grid grid-cols-3 gap-4 mb-8 p-5 bg-green-50 rounded-2xl">
                <div className="text-center">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${careLevelColor}`}>{product.careLevel[0]}</span>
                  </div>
                  <p className="text-xs text-gray-500">Care Level</p>
                  <p className="text-sm font-semibold text-gray-800">{product.careLevel}</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <Sun className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="text-xs text-gray-500">Light</p>
                  <p className="text-sm font-semibold text-gray-800">{product.light}</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <Droplets className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500">Water</p>
                  <p className="text-sm font-semibold text-gray-800">{product.water}</p>
                </div>
              </div>

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      id="qty-minus"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-semibold">{quantity}</span>
                    <button
                      id="qty-plus"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  id="add-to-cart-detail"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                    added ? 'bg-emerald-600 text-white' :
                    product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                    'bg-green-700 hover:bg-green-800 text-white active:scale-95'
                  }`}
                >
                  {added ? <CheckCircle className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </button>
                <Link
                  href="/cart"
                  className="px-6 py-3.5 border-2 border-green-700 text-green-700 hover:bg-green-50 rounded-xl font-semibold transition-colors"
                >
                  View Cart
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-3">
                {[
                  { icon: '🚚', text: 'Free shipping on $50+' },
                  { icon: '🛡️', text: '30-day live plant guarantee' },
                  { icon: '🌱', text: 'Ethically sourced plants' },
                  { icon: '💬', text: 'Expert care support' },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{b.icon}</span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
