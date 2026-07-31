'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuthStore } from '@/store/useStore'
import { useRouter } from 'next/navigation'
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface OrderItem {
  id: number
  quantity: number
  price: number
  product: { name: string; image: string | null }
}

interface Order {
  id: number
  status: string
  total: number
  address: string
  city: string
  phone: string
  createdAt: string
  items: OrderItem[]
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: Clock },
  processing: { label: 'Processing', color: 'text-blue-700 bg-blue-50 border-blue-200', icon: Package },
  shipped: { label: 'Shipped', color: 'text-purple-700 bg-purple-50 border-purple-200', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-700 bg-red-50 border-red-200', icon: XCircle },
}

export default function OrdersPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    fetch('/api/orders', { headers: { Authorization: `Bearer ${user.token}` } })
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user, router])

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Start shopping and your orders will appear here!</p>
              <a href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors font-medium">
                Shop Now
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const cfg = statusConfig[order.status] || statusConfig.pending
                const Icon = cfg.icon
                const isExpanded = expanded === order.id

                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div
                      className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setExpanded(isExpanded ? null : order.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <Package className="w-5 h-5 text-green-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Order #{order.id}</p>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {cfg.label}
                        </span>
                        <span className="font-bold text-green-800">${order.total.toFixed(2)}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-100 p-5 space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-3">Items</p>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500 w-5">×{item.quantity}</span>
                                  <span className="text-gray-800">{item.product.name}</span>
                                </div>
                                <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Delivery Address</p>
                            <p className="text-gray-800">{order.address}, {order.city}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Phone</p>
                            <p className="text-gray-800">{order.phone}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
