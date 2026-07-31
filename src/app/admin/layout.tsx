'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useStore'
import { useEffect } from 'react'
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, Leaf, LogOut, ChevronRight, Settings
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/users', label: 'Users', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    if (user.role !== 'admin') { router.push('/'); return }
  }, [user, router])

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-green-950 text-white flex flex-col fixed h-full z-40">
        {/* Logo */}
        <div className="p-6 border-b border-green-800">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white">LeafLane</p>
              <p className="text-green-400 text-xs">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`admin-nav-${item.label.toLowerCase()}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-green-700 text-white'
                    : 'text-green-300 hover:bg-green-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-green-800">
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-sm font-bold">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-green-400">Administrator</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-green-300 hover:text-white hover:bg-green-800 rounded-lg transition-all">
              <Settings className="w-3.5 h-3.5" /> View Site
            </Link>
            <button
              onClick={() => { logout(); router.push('/') }}
              id="admin-logout-btn"
              className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-red-400 hover:text-white hover:bg-red-800 rounded-lg transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 min-h-screen">
        {children}
      </main>
    </div>
  )
}
