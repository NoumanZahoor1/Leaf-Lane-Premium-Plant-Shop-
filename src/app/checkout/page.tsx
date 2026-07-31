'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCartStore, useAuthStore } from '@/store/useStore'
import Link from 'next/link'
import { CheckCircle, Lock, MapPin, Phone, CreditCard } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const [form, setForm] = useState({ address: '', city: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const subtotal = total()
  const shipping = subtotal >= 50 ? 0 : 8.99
  const tax = subtotal * 0.08
  const orderTotal = subtotal + shipping + tax

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 text-center py-20">
          <p className="text-gray-500">Your cart is empty.</p>
          <Link href="/products" className="text-green-700 hover:underline mt-2 inline-block">Continue Shopping</Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 text-center py-20">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Please log in to checkout</h2>
          <Link href="/login" id="login-to-checkout" className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors mt-4">
            Login to Continue
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.address || !form.city || !form.phone) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          address: form.address,
          city: form.city,
          phone: form.phone,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to place order.')
      } else {
        clearCart()
        setSuccess(true)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed! 🌿</h1>
          <p className="text-gray-600 mb-2">Thank you for your order, <strong>{user.name}</strong>!</p>
          <p className="text-gray-500 text-sm mb-8">Your plants will be carefully packaged and shipped to you. Check your orders for tracking info.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/orders" id="view-orders-btn" className="px-6 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors font-medium">
              View My Orders
            </Link>
            <Link href="/products" className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
              Shop More
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping Details */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-700" /> Shipping Details
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="checkout-address">
                        Delivery Address
                      </label>
                      <input
                        id="checkout-address"
                        type="text"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="123 Green Street, Apt 4B"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="checkout-city">
                        City / State / ZIP
                      </label>
                      <input
                        id="checkout-city"
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="New York, NY 10001"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="checkout-phone">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="checkout-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment (Mock) */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-700" /> Payment
                  </h2>
                  <div className="p-4 bg-green-50 rounded-xl text-sm text-green-800 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Demo mode — no real payment required. Order will be placed immediately.</span>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
                )}

                <button
                  type="submit"
                  id="place-order-btn"
                  disabled={loading}
                  className="w-full py-4 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="animate-spin">🌿</span> Placing order...</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Place Order — ${orderTotal.toFixed(2)}</>
                  )}
                </button>
              </form>
            </div>

            {/* Summary */}
            <div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h2 className="font-semibold text-gray-900 mb-5">Order Summary</h2>
                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">×{item.quantity}</span>
                        <span className="text-gray-700 truncate max-w-[160px]">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span><span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-green-800">${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
