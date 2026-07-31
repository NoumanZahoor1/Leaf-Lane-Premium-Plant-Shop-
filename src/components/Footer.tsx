import Link from 'next/link'
import { Leaf, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-green-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Leaf<span className="text-green-400">Lane</span></span>
            </div>
            <p className="text-green-300 text-sm leading-relaxed mb-5">
              Your premium online plant shop. We bring nature into your home with carefully curated plants and expert care guides.
            </p>
            <div className="flex gap-3">
              {/* Instagram */}
              <a href="#" className="w-8 h-8 bg-green-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* Twitter */}
              <a href="#" className="w-8 h-8 bg-green-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="w-8 h-8 bg-green-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-green-400 mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/products', label: 'All Plants' },
                { href: '/products?category=indoor-plants', label: 'Indoor Plants' },
                { href: '/products?category=succulents', label: 'Succulents' },
                { href: '/products?category=herbs', label: 'Herbs' },
                { href: '/products?featured=true', label: 'Featured' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-green-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-green-400 mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/orders', label: 'Track Order' },
                { href: '#', label: 'Privacy Policy' },
                { href: '#', label: 'Return Policy' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-green-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-green-400 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-green-300 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>noumanzahoor.cs@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5 text-green-300 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+92 3177543733</span>
              </li>
              <li className="flex items-start gap-2.5 text-green-300 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Okara , Pakistan</span>
              </li>
            </ul>
            <div className="mt-5 p-3 bg-green-900 rounded-xl">
              <p className="text-xs text-green-300 font-medium mb-1">🌿 Free Shipping</p>
              <p className="text-xs text-green-400">On orders over $50. Same-day delivery available.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-green-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-green-400 text-xs">© 2026 LeafLane. All rights reserved.</p>
          <p className="text-green-500 text-xs">Made By Nouman Zahoor Jatoi</p>
        </div>
      </div>
    </footer>
  )
}
