'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useStore'
import { Plus, Trash2, X, Tag } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  image: string | null
  _count: { products: number }
}

export default function AdminCategoriesPage() {
  const { user } = useAuthStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', image: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchCategories = () => {
    if (!user) return
    fetch('/api/admin/categories', { headers: { Authorization: `Bearer ${user.token}` } })
      .then(r => r.json()).then(setCategories).finally(() => setLoading(false))
  }

  useEffect(() => { fetchCategories() }, [user])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user!.token}` },
      body: JSON.stringify(form),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed') }
    else { setShowModal(false); setForm({ name: '', image: '' }); fetchCategories() }
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category? Products in this category may be affected.')) return
    await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user!.token}` },
      body: JSON.stringify({ id }),
    })
    fetchCategories()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">{categories.length} categories</p>
        </div>
        <button
          id="admin-add-category-btn"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between hover:border-green-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
                  <Tag className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-500">/{cat.slug} • {cat._count.products} products</p>
                </div>
              </div>
              <button
                id={`delete-category-${cat.id}`}
                onClick={() => handleDelete(cat.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                aria-label="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-500">No categories yet.</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add Category</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                <input
                  id="category-name-input"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Air Plants"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  id="category-image-input"
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button id="save-category-btn" type="submit" disabled={saving} className="flex-1 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                  {saving ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
