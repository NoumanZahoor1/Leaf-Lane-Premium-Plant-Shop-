import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Heart, Globe, Award, ArrowRight } from 'lucide-react'

const team = [
  { name: 'Nouman Zahoor Jatoi', role: 'Full-Stack Developer', emoji: '💻' },
]

const values = [
  { icon: Leaf, title: 'Sustainably Sourced', desc: 'Every plant in our collection is ethically grown by certified nurseries committed to sustainable practices.' },
  { icon: Heart, title: 'Plant Parent Community', desc: 'We believe everyone deserves a green companion. Our community supports beginners and experts alike.' },
  { icon: Globe, title: 'Eco-Friendly Packaging', desc: 'All orders ship in 100% biodegradable, recycled packaging to minimize our environmental footprint.' },
  { icon: Award, title: 'Quality Guaranteed', desc: '30-day health guarantee on every plant. If it doesn\'t thrive, we\'ll replace it — no questions asked.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-green-900 to-emerald-800 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-800/50 text-green-300 text-sm px-4 py-1.5 rounded-full mb-6 border border-green-700/50">
              <Leaf className="w-4 h-4" /> Our Story
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Bringing the Green World<br />Closer to You
            </h1>
            <p className="text-green-200 text-lg max-w-2xl mx-auto leading-relaxed">
              LeafLane was born from a simple belief: every home deserves the beauty and calm of living plants. We started in a small greenhouse in 2020 and have grown to serve over 10,000 happy plant parents nationwide.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">How It All Started</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>LeafLane started in Elena Greenfield's living room in 2020. After struggling to find quality, healthy plants online, she decided to build the plant shop she always wished existed — one that combines beautiful plants with expert guidance and exceptional customer care.</p>
                <p>Today, LeafLane partners with over 50 certified nurseries across the country to offer more than 500 plant varieties. Our expert botanists personally select each plant species for quality, health, and ease of care.</p>
                <p>From compact succulents perfect for desks, to dramatic tropical plants that transform a room — we believe there's a perfect plant for every person and every space.</p>
              </div>
              <Link href="/products" id="about-shop-btn" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl font-medium transition-colors">
                Browse Our Collection <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=350',
                'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=350',
                'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=350',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=350',
              ].map((src, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden ${i % 2 !== 0 ? 'mt-6' : ''}`}>
                  <Image src={src} alt="Plants" width={280} height={200} className="object-cover w-full h-40" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '500+', label: 'Plant Varieties' },
                { value: '10K+', label: 'Happy Customers' },
                { value: '50+', label: 'Partner Nurseries' },
                { value: '30-Day', label: 'Health Guarantee' },
              ].map((stat) => (
                <div key={stat.label} className="p-6 bg-white rounded-2xl shadow-sm">
                  <p className="text-3xl font-bold text-green-800 mb-1">{stat.value}</p>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="text-gray-500 mt-2">What drives everything we do at LeafLane</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center p-6 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Meet the Team</h2>
              <p className="text-gray-500 mt-2">The plant lovers behind LeafLane</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:border-green-200 transition-all">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">{member.emoji}</div>
                  <h3 className="font-semibold text-gray-900 text-sm">{member.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Plant Journey?</h2>
            <p className="text-gray-500 mb-8">Join thousands of plant lovers who trust LeafLane to bring nature into their homes.</p>
            <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold transition-colors">
              Shop Plants <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
