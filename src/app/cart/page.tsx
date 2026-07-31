'use client'
import { useCartStore } from '@/store/useStore'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Add some plants to your cart to get started!</p>
          <Link href="/products" id="continue-shopping-btn" className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors font-medium">
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const subtotal = total()
  const shipping = subtotal >= 50 ? 0 : 8.99
  const tax = subtotal * 0.08
  const orderTotal = subtotal + shipping + tax

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart ({items.length} item{items.length !== 1 ? 's' : ''})</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  {/* Image */}
                  <Link href={`/products/${item.slug}`} className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-green-50 relative">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🌿</div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`} className="font-semibold text-gray-900 hover:text-green-700 transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-green-700 font-bold mt-1">${item.price.toFixed(2)}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          id={`decrease-${item.id}`}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          id={`increase-${item.id}`}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          id={`remove-${item.id}`}
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                id="clear-cart-btn"
                className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
              >
                Clear cart
              </button>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-green-800">${orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg mb-4">
                    <Truck className="w-4 h-4" />
                    <span>Add ${(50 - subtotal).toFixed(2)} more for free shipping!</span>
                  </div>
                )}

                <Link
                  href="/checkout"
                  id="checkout-btn"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold transition-colors"
                >
                  Checkout <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/products"
                  className="flex items-center justify-center w-full mt-3 py-2.5 text-sm text-green-700 hover:text-green-800 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
