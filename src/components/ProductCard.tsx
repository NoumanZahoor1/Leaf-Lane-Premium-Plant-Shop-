'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Droplets, Sun, Heart } from 'lucide-react'
import { useCartStore } from '@/store/useStore'
import { useState } from 'react'

interface Product {
  id: number
  name: string
  slug: string
  price: number
  image: string | null
  careLevel: string
  light: string
  water: string
  stock: number
  category: { name: string }
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const careLevelColor = {
    Easy: 'bg-emerald-100 text-emerald-700',
    Medium: 'bg-amber-100 text-amber-700',
    Hard: 'bg-rose-100 text-rose-700',
  }[product.careLevel] || 'bg-gray-100 text-gray-700'

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-100 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-green-50">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🌿</div>
          )}
          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted) }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
          {/* Care badge */}
          <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold ${careLevelColor}`}>
            {product.careLevel}
          </div>
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-green-600 font-medium mb-1">{product.category.name}</p>
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Care Icons */}
          <div className="flex gap-3 mb-3">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>{product.light}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              <span>{product.water}</span>
            </div>
          </div>

          {/* Price & Cart */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-green-800">${product.price.toFixed(2)}</span>
            <button
              id={`add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                added
                  ? 'bg-green-100 text-green-700'
                  : product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-700 hover:bg-green-800 text-white active:scale-95'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{added ? 'Added!' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
