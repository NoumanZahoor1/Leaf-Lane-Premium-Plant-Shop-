'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'

const contactInfo = [
  { icon: Mail, title: 'Email Us', value: 'noumanzahoor.cs@gmail.com', sub: 'We reply within 24 hours' },
  { icon: Phone, title: 'Call Us', value: '+92 3177543733', sub: 'Mon–Fri, 9am–6pm EST' },
  { icon: MapPin, title: 'Visit Us', value: 'Okara , Pakistan', sub: 'By appointment only' },
  { icon: Clock, title: 'Support Hours', value: 'Mon–Sun, 8am–8pm', sub: 'Plant emergencies welcome!' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate sending (no real backend for contact)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        {/* Hero */}
        <div className="bg-gradient-to-r from-green-900 to-emerald-800 py-16 px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-green-200 text-lg max-w-xl mx-auto">Have a question about a plant? Need care advice? Want to partner with us? We'd love to hear from you.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-5 mb-10">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{info.title}</p>
                      <p className="text-gray-800">{info.value}</p>
                      <p className="text-sm text-gray-500">{info.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ */}
              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">🌿 Quick Answers</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { q: 'Do you ship live plants?', a: 'Yes! We specialize in live plant shipping with heat packs and specialized packaging.' },
                    { q: 'What is your return policy?', a: '30-day live plant guarantee. If your plant doesn\'t thrive, we\'ll replace it free.' },
                    { q: 'How long does shipping take?', a: '2-5 business days. We ship Monday–Wednesday to avoid weekend delays.' },
                  ].map((item) => (
                    <div key={item.q}>
                      <p className="font-medium text-gray-800">{item.q}</p>
                      <p className="text-gray-600 mt-0.5">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              {sent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent! 🌱</h3>
                  <p className="text-gray-500">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          id="contact-name"
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your name"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          id="contact-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <select
                        id="contact-subject"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option>Plant Care Question</option>
                        <option>Order Issue</option>
                        <option>Shipping Question</option>
                        <option>Return / Refund</option>
                        <option>Partnership</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        id="contact-message"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us how we can help..."
                        rows={5}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      id="contact-submit-btn"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
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
