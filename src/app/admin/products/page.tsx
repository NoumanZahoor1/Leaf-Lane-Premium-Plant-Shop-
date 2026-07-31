'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useStore'
import { Plus, Pencil, Trash2, X, Search, Package } from 'lucide-react'
import Image from 'next/image'

interface Category { id: number; name: string; slug: string }
interface Product {
  id: number
  name: string
  price: number
  stock: number
  image: string | null
  careLevel: string
  featured: boolean
  category: { name: string }
}

const emptyForm = { name: '', description: '', price: '', stock: '', image: '', careLevel: 'Easy', light: 'Indirect', water: 'Weekly', featured: false, categoryId: '' }

export default function AdminProductsPage() {
  const { user } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const fetchProducts = () => {
    if (!user) return
    fetch('/api/admin/products', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(r => r.json()).then(setProducts).finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts()
    if (user) fetch('/api/admin/categories', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(r => r.json()).then(setCategories)
  }, [user])

  const handleOpen = (product?: Product & { description?: string; light?: string; water?: string; categoryId?: number }) => {
    if (product) {
      setEditing(product.id)
      setForm({
        name: product.name, description: (product as any).description || '',
        price: product.price.toString(), stock: product.stock.toString(),
        image: product.image || '', careLevel: product.careLevel,
        light: (product as any).light || 'Indirect', water: (product as any).water || 'Weekly',
        featured: product.featured, categoryId: (product as any).categoryId?.toString() || '',
      })
    } else {
      setEditing(null)
      setForm(emptyForm)
    }
    setError('')
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const url = editing ? `/api/admin/products/${editing}` : '/api/admin/products'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user!.token}` },
        body: JSON.stringify(form),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed'); }
      else { setShowModal(false); fetchProducts() }
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user!.token}` },
    })
    fetchProducts()
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">{products.length} products in inventory</p>
        </div>
        <button
          onClick={() => handleOpen()}
          id="admin-add-product-btn"
          className="flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          id="admin-product-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Care</th>
                <th className="px-6 py-3">Featured</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-green-50 flex-shrink-0">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">🌿</div>
                        )}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category.name}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-800">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.stock === 0 ? 'bg-red-100 text-red-700' : product.stock <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {product.stock === 0 ? 'Out of stock' : product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.careLevel}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {product.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        id={`edit-product-${product.id}`}
                        onClick={() => handleOpen(product as any)}
                        className="p-1.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        id={`delete-product-${product.id}`}
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input id="product-name-input" type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea id="product-desc-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                  <input id="product-price-input" type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input id="product-stock-input" type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input id="product-image-input" type="url" value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://images.unsplash.com/..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select id="product-category-input" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Care Level</label>
                  <select id="product-care-input" value={form.careLevel} onChange={e => setForm({...form, careLevel: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Light</label>
                  <select id="product-light-input" value={form.light} onChange={e => setForm({...form, light: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                    <option>Low</option><option>Indirect</option><option>Bright</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Watering</label>
                  <select id="product-water-input" value={form.water} onChange={e => setForm({...form, water: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                    <option>Daily</option><option>Weekly</option><option>Biweekly</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input id="product-featured-input" type="checkbox" checked={form.featured as boolean} onChange={e => setForm({...form, featured: e.target.checked})} className="w-4 h-4 rounded text-green-600 focus:ring-green-500" />
                  <label htmlFor="product-featured-input" className="text-sm font-medium text-gray-700">Featured product</label>
                </div>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button id="save-product-btn" type="submit" disabled={saving} className="flex-1 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : (editing ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
