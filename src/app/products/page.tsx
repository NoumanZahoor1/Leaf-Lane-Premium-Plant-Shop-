'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Search, Filter, X, ChevronDown } from 'lucide-react'

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
  category: { name: string; slug: string }
}
interface Category { id: number; name: string; slug: string }

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [careLevel, setCareLevel] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const fetchProducts = async (pg = 1) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (selectedCategory) params.set('category', selectedCategory)
    params.set('page', pg.toString())
    params.set('limit', '12')
    if (searchParams.get('featured') === 'true') params.set('featured', 'true')

    const res = await fetch(`/api/products?${params}`)
    const data = await res.json()
    let prods = data.products || []

    if (careLevel) prods = prods.filter((p: Product) => p.careLevel === careLevel)
    if (sortBy === 'price-asc') prods.sort((a: Product, b: Product) => a.price - b.price)
    else if (sortBy === 'price-desc') prods.sort((a: Product, b: Product) => b.price - a.price)
    else if (sortBy === 'name') prods.sort((a: Product, b: Product) => a.name.localeCompare(b.name))

    setProducts(prods)
    setTotal(data.total || 0)
    setPage(pg)
    setTotalPages(data.totalPages || 1)
    setLoading(false)
  }

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  useEffect(() => { fetchProducts(1) }, [selectedCategory, careLevel, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProducts(1)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900 to-emerald-800 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">All Plants</h1>
            <p className="text-green-300">{total} beautiful plants available</p>
            <form onSubmit={handleSearch} className="mt-6 flex gap-3 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="product-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search plants..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <button type="submit" className="px-5 py-2.5 bg-green-500 hover:bg-green-400 text-green-950 font-medium rounded-xl transition-colors">Search</button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button onClick={() => { setSelectedCategory(''); setCareLevel('') }} className="text-xs text-green-700 hover:text-green-800">Clear all</button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('')}
                      id="filter-all"
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >All Categories</button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        id={`filter-${cat.slug}`}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.slug ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                      >{cat.name}</button>
                    ))}
                  </div>
                </div>

                {/* Care Level */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Care Level</h4>
                  <div className="space-y-2">
                    {['', 'Easy', 'Medium', 'Hard'].map((level) => (
                      <button
                        key={level || 'all'}
                        onClick={() => setCareLevel(level)}
                        id={`care-${level || 'all'}`}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${careLevel === level ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                      >{level || 'All Levels'}</button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort Bar */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700">
                  <Filter className="w-4 h-4" /> Filters
                </button>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />)}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🌿</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No plants found</h3>
                  <p className="text-gray-500">Try a different search or filter</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product) => <ProductCard key={product.id} product={product} />)}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => fetchProducts(i + 1)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-green-700 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-green-300'}`}
                        >{i + 1}</button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function ProductsPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-3xl">🌿</div></div>}><ProductsContent /></Suspense>
}
