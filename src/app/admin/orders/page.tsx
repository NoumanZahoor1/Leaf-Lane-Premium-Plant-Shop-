'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useStore'
import { ChevronDown } from 'lucide-react'

interface OrderItem {
  id: number
  quantity: number
  price: number
  product: { name: string }
}
interface Order {
  id: number
  status: string
  total: number
  address: string
  city: string
  phone: string
  createdAt: string
  user: { name: string; email: string }
  items: OrderItem[]
}

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
}

export default function AdminOrdersPage() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (!user) return
    fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(r => r.json()).then(setOrders).finally(() => setLoading(false))
  }, [user])

  const handleStatusChange = async (orderId: number, status: string) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user!.token}` },
      body: JSON.stringify({ status }),
    })
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
  }

  const filtered = filter ? orders.filter(o => o.status === filter) : orders

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        <select
          id="admin-order-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="">All Statuses</option>
          {statusOptions.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-6">
                  <span className="font-semibold text-gray-900 text-sm min-w-[60px]">#{order.id}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.user.name}</p>
                    <p className="text-xs text-gray-500">{order.user.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-green-800">${order.total.toFixed(2)}</span>
                  <select
                    id={`order-status-${order.id}`}
                    value={order.status}
                    onChange={(e) => { e.stopPropagation(); handleStatusChange(order.id, e.target.value) }}
                    onClick={(e) => e.stopPropagation()}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent cursor-pointer ${statusColors[order.status] || ''}`}
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded === order.id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {expanded === order.id && (
                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                      <p className="text-gray-800">{order.address}, {order.city}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <p className="text-gray-800">{order.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order Date</p>
                      <p className="text-gray-800">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Items Ordered</p>
                    <div className="space-y-1.5">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2">
                          <span className="text-gray-700">× {item.quantity} {item.product.name}</span>
                          <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">No orders found.</div>
          )}
        </div>
      )}
    </div>
  )
}
