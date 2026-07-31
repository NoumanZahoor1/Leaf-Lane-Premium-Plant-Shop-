'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Leaf, Menu, X, User, LogOut, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore, useAuthStore } from '@/store/useStore'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const itemCount = useCartStore((s) => s.itemCount)
  const { user, logout } = useAuthStore()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Plants' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center group-hover:bg-green-800 transition-colors">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-green-900">Leaf<span className="text-green-600">Lane</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-green-700 ${
                  pathname === link.href ? 'text-green-700 border-b-2 border-green-700 pb-0.5' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              id="search-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              id="cart-btn"
              className="relative p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && itemCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {itemCount()}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-800 rounded-lg transition-all text-sm font-medium">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:block">{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 rounded-t-xl transition-colors">
                    My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-b-xl w-full text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                id="login-btn"
                className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-3 border-t border-gray-100 pt-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                id="search-input"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800 transition-colors">
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 bg-green-700 text-white rounded-lg text-sm font-medium"
              >
                Login / Register
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
