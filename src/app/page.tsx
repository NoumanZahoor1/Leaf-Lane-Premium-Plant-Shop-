'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Leaf, Star, ShoppingBag, Shield, Truck, Headphones, ChevronRight, Sparkles, Heart, Play, Award, Clock, Zap } from 'lucide-react'
import { useCartStore } from '@/store/useStore'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Product {
  id: number
  name: string
  slug: string
  price: number
  image: string | null
  careLevel: string
  category: { name: string }
  stock: number
}

// ─── Data ────────────────────────────────────────────────────────────────────
const categories = [
  { emoji: '🌵', label: 'Succulents', slug: 'succulents' },
  { emoji: '🌿', label: 'Tropical', slug: 'tropical-plants' },
  { emoji: '🌸', label: 'Flowering', slug: 'flowering-plants' },
  { emoji: '🪴', label: 'Indoor', slug: 'indoor-plants' },
  { emoji: '🌱', label: 'Herbs', slug: 'herbs' },
  { emoji: '🎍', label: 'Bamboo', slug: 'bamboo' },
  { emoji: '🍀', label: 'Ferns', slug: 'ferns' },
  { emoji: '🌾', label: 'Grasses', slug: 'ornamental-grasses' },
]

const testimonials = [
  { name: 'Sarah M.', location: 'New York', review: 'Absolutely stunning quality. My monstera arrived perfectly packed and is thriving 3 months later. LeafLane is the ONLY plant shop I trust.', rating: 5, plant: '🌿', avatar: 'S' },
  { name: 'James K.', location: 'Los Angeles', review: 'The packaging alone blew me away. But the plants? Even better. Already ordered 4 times and every single experience has been perfect.', rating: 5, plant: '🌵', avatar: 'J' },
  { name: 'Priya R.', location: 'Chicago', review: 'LeafLane transformed my apartment into a tropical paradise. Customer service is beyond amazing — they actually care about your plants thriving.', rating: 5, plant: '🌸', avatar: 'P' },
  { name: 'Alex T.', location: 'Austin', review: 'I\'ve tried 6 plant shops online. None come close to the quality and freshness from LeafLane. Worth every single penny.', rating: 5, plant: '🍀', avatar: 'A' },
]

const features = [
  { icon: Truck, title: 'Free Express Shipping', desc: 'On all orders over $50. Your plants arrive fresh within 48 hours, guaranteed.', color: 'from-emerald-500 to-teal-500', glow: 'rgba(16,185,129,0.3)' },
  { icon: Shield, title: '30-Day Guarantee', desc: 'Every plant is guaranteed healthy. If it doesn\'t thrive, we replace it — no questions asked.', color: 'from-green-500 to-emerald-500', glow: 'rgba(34,197,94,0.3)' },
  { icon: Leaf, title: 'Expert Curation', desc: 'Botanists personally select every variety for beauty, health, and ease of care.', color: 'from-teal-500 to-cyan-500', glow: 'rgba(20,184,166,0.3)' },
  { icon: Headphones, title: '24/7 Plant Care', desc: 'Real plant experts on call any time. Your plants\' success is our mission.', color: 'from-cyan-500 to-blue-500', glow: 'rgba(6,182,212,0.3)' },
]

// Premium plant images — carefully chosen for visual impact
const heroImages = {
  main: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&h=600&fit=crop&crop=center',
  card1: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=300&h=300&fit=crop&crop=center',
  card2: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300&h=300&fit=crop&crop=center',
  promo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop&crop=center',
}

const categoryImages = [
  { emoji: '🌿', label: 'Tropical', slug: 'tropical-plants', img: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop', span: 'col-span-2 row-span-2', h: 'h-80', count: '120+' },
  { emoji: '🌵', label: 'Succulents', slug: 'succulents', img: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=300&h=200&fit=crop', span: '', h: 'h-36', count: '85+' },
  { emoji: '🌸', label: 'Flowering', slug: 'flowering-plants', img: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=300&h=200&fit=crop', span: '', h: 'h-36', count: '95+' },
  { emoji: '🪴', label: 'Indoor', slug: 'indoor-plants', img: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=300&h=200&fit=crop', span: '', h: 'h-36', count: '150+' },
  { emoji: '🌱', label: 'Herbs', slug: 'herbs', img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=300&h=200&fit=crop', span: '', h: 'h-36', count: '60+' },
]

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0
        const step = end / 60
        const timer = setInterval(() => {
          start += step
          if (start >= end) { setCount(end); clearInterval(timer) }
          else setCount(Math.floor(start))
        }, 25)
        observer.disconnect()
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── Scroll reveal hook ───────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  
  return ref
}

// ─── Section wrapper with scroll reveal ───────────────────────────────────────
function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal()
  return <div ref={ref} className={`reveal-on-scroll ${className}`}>{children}</div>
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const { addItem } = useCartStore()

  useEffect(() => {
    fetch('/api/products?featured=true&limit=8')
      .then(r => r.json())
      .then(d => setProducts(Array.isArray(d.products) ? d.products : []))
      .catch(() => {})
  }, [])

  const toggleWish = (id: number) => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id])

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#030f0a]">
      <Navbar />

      {/* ═══════════════════════════════════════════════
          HERO SECTION — Premium Aurora Design
      ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden aurora-bg noise-overlay">

        {/* Animated glow orbs — more dramatic */}
        <div className="absolute top-10 left-[5%] w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[120px] animate-glow-pulse pointer-events-none" />
        <div className="absolute bottom-10 right-[5%] w-[600px] h-[600px] rounded-full bg-teal-400/10 blur-[150px] animate-glow-pulse2 pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-green-300/10 blur-[100px] animate-glow-pulse pointer-events-none" />

        {/* Floating leaf particles */}
        {['🌿','🍃','🌱','🌿','🍀','🌱','🍃','🌿','🍃','🌱'].map((leaf, i) => (
          <div
            key={i}
            className="absolute text-2xl pointer-events-none opacity-0"
            style={{
              left: `${5 + i * 10}%`,
              animation: `particle-float ${7 + i * 1.2}s ${i * 0.6}s ease-in-out infinite`,
            }}
          >
            {leaf}
          </div>
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT — Staggered entrance */}
          <div className="stagger-children">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 glass-premium px-5 py-2.5 rounded-full mb-8 border border-emerald-500/20 badge-float">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-300 text-sm font-semibold tracking-wide">Premium Plant Collection 2026</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>

            {/* Headline — dramatic typography */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] mb-8 tracking-tight">
              <span className="block text-white/90">Bring</span>
              <span className="block gradient-text-animated py-2">Nature</span>
              <span className="block text-white">Home.</span>
            </h1>

            {/* Subtext */}
            <p className="text-gray-400 text-lg sm:text-xl max-w-lg mb-10 leading-relaxed font-light">
              Discover over <span className="text-emerald-400 font-semibold">500+ handpicked plants</span> from the world&apos;s finest nurseries. Each one ethically grown, expertly curated, and delivered with love.
            </p>

            {/* CTA Buttons — Premium design */}
            <div className="flex flex-wrap gap-4 mb-16">
              <Link
                href="/products"
                id="hero-shop-btn"
                className="btn-premium ripple-container inline-flex items-center gap-3 px-9 py-4.5 text-white font-bold rounded-2xl text-lg shadow-lg shadow-emerald-500/20"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Collection
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                id="hero-learn-btn"
                className="inline-flex items-center gap-2.5 px-8 py-4 glass-premium border border-white/15 text-white font-semibold rounded-2xl hover:border-emerald-400/40 hover:text-emerald-300 hover:bg-emerald-500/5 transition-all duration-300"
              >
                <Play className="w-4 h-4" />
                Our Story
              </Link>
            </div>

            {/* Stats Row — Glass style */}
            <div className="flex gap-6 sm:gap-10">
              {[
                { val: 500, suffix: '+', label: 'Plant Varieties', icon: '🌿' },
                { val: 10000, suffix: '+', label: 'Happy Customers', icon: '💚' },
                { val: 98, suffix: '%', label: 'Satisfaction', icon: '⭐' },
              ].map((s, i) => (
                <div key={i} className="text-center sm:text-left">
                  <p className="text-2xl sm:text-3xl font-black text-white mb-1">
                    <Counter end={s.val} suffix={s.suffix} />
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Hero Image Composition */}
          <div className="relative hidden lg:block hero-image-grid">
            
            {/* Main large image with glow */}
            <div className="relative animate-float">
              {/* Glow behind image */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-emerald-500/30 to-teal-500/20 blur-3xl scale-90 animate-glow-pulse" />
              
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-emerald-500/10 breathe-glow">
                <Image
                  src={heroImages.main}
                  alt="Beautiful indoor plant in minimalist setting"
                  width={440}
                  height={540}
                  className="object-cover w-full h-[500px]"
                  priority
                  sizes="(max-width: 1024px) 100vw, 440px"
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-transparent" />
                
                {/* Floating label on image */}
                <div className="absolute bottom-6 left-6 right-6 glass-premium rounded-2xl p-4 border border-white/15">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">🌿</div>
                      <div>
                        <p className="text-white font-bold text-sm">Monstera Deliciosa</p>
                        <p className="text-emerald-300 text-xs font-medium">Best Seller · $29.99</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating card — top right */}
            <div className="absolute -top-6 -right-4 animate-float2 z-20">
              <div className="glass-premium border border-white/15 rounded-2xl p-3 shadow-2xl shadow-black/30 w-40 gradient-border">
                <div className="relative rounded-xl overflow-hidden h-24 mb-2.5">
                  <Image
                    src={heroImages.card1}
                    alt="Succulent plant"
                    width={160}
                    height={96}
                    className="object-cover w-full h-full"
                    sizes="160px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <p className="text-white font-bold text-xs">Snake Plant</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-emerald-400 text-xs font-bold">$19.99</p>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-medium">Easy Care</span>
                </div>
              </div>
            </div>

            {/* Floating card — bottom right */}
            <div className="absolute -bottom-2 -right-6 animate-float3 z-20">
              <div className="glass-premium border border-white/15 rounded-2xl p-4 shadow-2xl shadow-black/30 w-44 gradient-border">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-lg">🌵</div>
                  <div>
                    <p className="text-white font-bold text-xs">Saguaro Cactus</p>
                    <p className="text-gray-400 text-[10px]">Desert Collection</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                  </div>
                  <span className="text-gray-400 text-[10px]">4.9</span>
                </div>
              </div>
            </div>

            {/* Trust badge — left side */}
            <div className="absolute top-1/2 -left-12 transform -translate-y-1/2 z-20 badge-float">
              <div className="glass-premium border border-emerald-500/20 rounded-2xl px-5 py-5 text-center shadow-2xl shadow-emerald-500/10">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center text-2xl mx-auto mb-2 shadow-lg shadow-amber-500/20">🏆</div>
                <p className="text-emerald-300 font-bold text-xs">#1 Rated</p>
                <p className="text-gray-500 text-[10px]">Plant Shop 2024</p>
              </div>
            </div>

            {/* Online indicator */}
            <div className="absolute top-16 left-6 z-20 animate-bounce-in">
              <div className="glass-premium border border-emerald-500/20 rounded-full px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-300 text-xs font-medium">2,847 shopping now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <p className="text-gray-600 text-xs tracking-[0.25em] uppercase font-medium">Scroll to Explore</p>
          <div className="w-5 h-9 border-2 border-gray-600/50 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2.5 bg-emerald-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MARQUEE — Category Ticker
      ═══════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 py-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.1)_0%,transparent_20%,transparent_80%,rgba(0,0,0,0.1)_100%)] pointer-events-none z-10" />
        <div className="flex">
          <div className="marquee-track flex gap-5 whitespace-nowrap min-w-max">
            {[...categories, ...categories].map((c, i) => (
              <Link key={i} href={`/products?category=${c.slug}`} className="flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/25 rounded-full text-white font-medium text-sm transition-all duration-300 hover:scale-105 border border-white/5 hover:border-white/20">
                <span className="text-lg">{c.emoji}</span> {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          FEATURED CATEGORIES — Premium Bento Grid
      ═══════════════════════════════════════════════ */}
      <section className="py-28 mesh-bg relative overflow-hidden dot-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <RevealSection>
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm">
                <Leaf className="w-4 h-4" /> Shop by Category
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-5">
                Find Your <span className="gradient-text">Perfect Plant</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">Every plant has a personality. Explore our curated collections and find yours.</p>
            </div>
          </RevealSection>

          {/* Bento Grid */}
          <RevealSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
              {categoryImages.map((cat, i) => (
                <Link
                  key={i}
                  href={`/products?category=${cat.slug}`}
                  id={`category-${cat.slug}`}
                  className={`group relative overflow-hidden rounded-3xl ${cat.span} ${cat.h} card-glow gradient-border`}
                >
                  <Image
                    src={cat.img}
                    alt={cat.label}
                    fill
                    sizes={cat.span ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5 group-hover:from-black/70 transition-all duration-500" />
                  
                  {/* Count badge */}
                  <div className="absolute top-4 right-4 bg-white/15 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                    {cat.count} Plants
                  </div>
                  
                  <div className="absolute bottom-5 left-5">
                    <span className="text-3xl mb-2 block drop-shadow-lg">{cat.emoji}</span>
                    <p className="text-white font-black text-xl mt-1 drop-shadow-lg">{cat.label}</p>
                    <span className="inline-flex items-center gap-1 text-emerald-300 text-sm font-semibold mt-2 group-hover:gap-2 transition-all">
                      Shop Now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURED PRODUCTS — Premium Cards
      ═══════════════════════════════════════════════ */}
      <section className="py-28 bg-gradient-to-b from-gray-950 via-[#0a1a10] to-gray-950 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

          <RevealSection>
            <div className="flex items-end justify-between mb-16">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-900/50 text-emerald-400 border border-emerald-700/50 px-5 py-2 rounded-full text-sm font-semibold mb-5">
                  <Star className="w-4 h-4 fill-emerald-400" /> Handpicked Favourites
                </div>
                <h2 className="text-4xl lg:text-6xl font-black text-white">
                  Trending <span className="gradient-text-animated">Right Now</span>
                </h2>
              </div>
              <Link href="/products" className="hidden sm:inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors group">
                View All Plants <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </RevealSection>

          {products.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800/50 rounded-3xl h-80 animate-pulse border border-gray-700/30" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
              {products.map((product, i) => (
                <RevealSection key={product.id}>
                  <div
                    className="product-card group relative bg-gray-900/80 rounded-3xl overflow-hidden border border-gray-700/40 hover:border-emerald-500/30 gradient-border"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >

                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="product-img object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-gray-800 to-gray-900">🌿</div>
                      )}
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-emerald-500/20">
                          {product.careLevel}
                        </span>
                        {i < 3 && (
                          <span className="bg-amber-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-amber-500/20">
                            🔥 Trending
                          </span>
                        )}
                      </div>
                      {/* Wishlist */}
                      <button
                        id={`wish-${product.id}`}
                        onClick={() => toggleWish(product.id)}
                        className="absolute top-3 right-3 w-9 h-9 bg-black/30 hover:bg-rose-500 backdrop-blur-md rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-white/10 hover:border-rose-400 shadow-lg"
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-rose-400 text-rose-400' : 'text-white'}`} />
                      </button>
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-70" />
                    </div>

                    {/* Info */}
                    <div className="p-4 pt-3">
                      <p className="text-emerald-400 text-xs font-semibold mb-1 uppercase tracking-wider">{product.category.name}</p>
                      <h3 className="text-white font-bold text-sm mb-2.5 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-gray-500 text-xs ml-1">(4.9)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-white">${product.price.toFixed(2)}</span>
                        <button
                          id={`add-cart-${product.id}`}
                          onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image, slug: product.slug })}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95 ripple-container"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          )}

          <RevealSection className="text-center mt-14">
            <Link href="/products" id="see-all-btn" className="inline-flex items-center gap-3 btn-premium px-12 py-5 text-white font-bold rounded-2xl text-lg shadow-xl shadow-emerald-500/20">
              Explore All 500+ Plants <ArrowRight className="w-5 h-5" />
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WHY LEAFLANE — Glass Feature Cards
      ═══════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden bg-gradient-to-b from-[#f0fdf4] to-white">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400" />
        {/* Background decoration */}
        <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-[250px] h-[250px] bg-teal-200/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <RevealSection>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full text-sm font-semibold mb-5">
                <Award className="w-4 h-4" /> Why Choose Us
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-gray-900">
                Why Plant Parents<br /><span className="gradient-text">Choose LeafLane</span>
              </h2>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {features.map((f, i) => (
              <RevealSection key={i}>
                <div className="group relative p-7 bg-white rounded-3xl border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 hover:-translate-y-3 gradient-border h-full">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    style={{ boxShadow: `0 8px 30px ${f.glow}` }}>
                    <f.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-black text-gray-900 text-lg mb-3">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          IMMERSIVE PROMO BANNER — Redesigned
      ═══════════════════════════════════════════════ */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImages.promo}
            alt="Lush green forest"
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          {/* Emerald tint overlay */}
          <div className="absolute inset-0 bg-emerald-900/20" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2.5 bg-amber-400/20 border border-amber-400/30 text-amber-300 px-5 py-2.5 rounded-full text-sm font-bold mb-8 backdrop-blur-sm">
                <Zap className="w-4 h-4 fill-amber-400" />
                Limited Time Offer
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tight">
                Get <span className="gradient-text-gold">20% OFF</span><br />Your First Order
              </h2>
              <p className="text-gray-300 text-xl mb-12 leading-relaxed max-w-lg">
                Use code <span className="text-amber-400 font-bold bg-amber-400/10 px-4 py-1.5 rounded-lg border border-amber-400/20 inline-block">LEAFLANE20</span> at checkout. Free shipping on orders over $50.
              </p>
              <Link href="/products" id="promo-shop-btn" className="btn-premium ripple-container inline-flex items-center gap-3 px-10 py-5 text-white font-black rounded-2xl text-xl shadow-xl shadow-emerald-500/20">
                <ShoppingBag className="w-6 h-6" /> Claim Your Discount <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TESTIMONIALS — Premium Social Proof
      ═══════════════════════════════════════════════ */}
      <section className="py-28 bg-gradient-to-b from-gray-950 via-[#0a1a10] to-[#0a1f12] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[200px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <RevealSection>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-amber-900/40 text-amber-400 border border-amber-700/40 px-5 py-2 rounded-full text-sm font-semibold mb-5">
                <Star className="w-4 h-4 fill-amber-400" /> 4.9/5 from 2,400+ reviews
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-white">
                Plant Parents <span className="gradient-text-animated">Love Us</span>
              </h2>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <RevealSection key={i}>
                <div className="group glass-premium border border-white/8 rounded-3xl p-6 hover:border-emerald-500/25 transition-all duration-500 hover:-translate-y-3 hover:shadow-xl hover:shadow-emerald-500/5 gradient-border h-full">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="text-4xl drop-shadow-lg">{t.plant}</div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  {/* Quote */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">&quot;{t.review}&quot;</p>
                  {/* Author */}
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/20 ring-offset-2 ring-offset-gray-900">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.location}</p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          NEWSLETTER CTA — Premium Glass Design
      ═══════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-[100px] animate-glow-pulse" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-teal-400/10 rounded-full blur-[120px] animate-glow-pulse2" />
        </div>
        {/* Dot grid pattern */}
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <RevealSection>
            <div className="text-7xl mb-8 animate-float">🌱</div>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-5">
              Join 10,000+ Plant Lovers
            </h2>
            <p className="text-emerald-200/80 text-lg mb-12 max-w-lg mx-auto">
              Get exclusive deals, expert plant care tips, and first access to new arrivals — delivered every week.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
              <input
                id="newsletter-email"
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-6 py-4 rounded-2xl bg-white/8 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 backdrop-blur-md text-sm transition-all"
              />
              <button
                id="newsletter-btn"
                type="submit"
                className="px-8 py-4 bg-white text-emerald-800 font-bold rounded-2xl hover:bg-emerald-50 transition-all hover:shadow-lg hover:shadow-white/20 hover:-translate-y-0.5 whitespace-nowrap"
              >
                Subscribe Free
              </button>
            </form>
            <p className="text-emerald-400/50 text-xs mt-5">No spam. Unsubscribe anytime. 🌿</p>
          </RevealSection>
        </div>
      </section>

      <Footer />
    </div>
  )
}
