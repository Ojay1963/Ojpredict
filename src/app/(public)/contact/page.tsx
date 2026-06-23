"use client"
export const dynamic = 'force-dynamic'

import { useState } from "react"
import { Mail, MessageCircle, Send } from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success("Message sent! We'll get back to you within 24 hours.")
    setForm({ name: "", email: "", subject: "", message: "" })
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-black text-[#0C0975] mb-2">Contact OJ Predict</h1>
      <p className="text-gray-500 mb-10">Have a question or need support? We're here to help.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <ContactCard icon={<Mail className="w-5 h-5" />} title="Email" value="support@ojpredict.com" />
          <ContactCard icon={<MessageCircle className="w-5 h-5" />} title="Telegram" value="@OJPredict" />
          <ContactCard icon={<Send className="w-5 h-5" />} title="Response Time" value="Within 24 hours" />
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975] focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975] focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
            <input
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975] focus:border-transparent"
              placeholder="How can we help?"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975] focus:border-transparent resize-none"
              placeholder="Tell us more..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0C0975] text-white font-bold py-3 rounded-xl hover:bg-[#1a1a8c] transition-colors disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  )
}

function ContactCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
      <div className="w-10 h-10 bg-[#0C0975]/10 rounded-lg flex items-center justify-center text-[#0C0975]">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{title}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )
}
