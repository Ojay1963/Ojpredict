"use client"
export const dynamic = 'force-dynamic'

import { useState } from "react"
import { Check, Crown, Shield, Zap, Star, MessageCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const PLANS = [
  {
    id: "OJ_GOLD",
    name: "OJ Gold Plan",
    price: "₦3,000",
    period: "/month",
    description: "Perfect for serious punters wanting high-confidence accumulators",
    features: [
      "5–10 odds daily accumulator tips",
      "AI-generated match analysis",
      "Confidence score per tip",
      "Email alerts for new tips",
      "Telegram channel access",
      "Weekly performance report",
    ],
    icon: <Star className="w-6 h-6" />,
    color: "border-[#F4A500]",
    bg: "bg-[#F4A500]/5",
    badge: null,
  },
  {
    id: "OJ_INVESTMENT",
    name: "OJ Investment Tip",
    price: "₦5,000",
    period: "/month",
    description: "Our premium safe banker tips for risk-averse, consistent returns",
    features: [
      "1.60–2.00 odds safe banker tips",
      "Highest AI confidence picks only",
      "Detailed match analysis",
      "Priority email + SMS alerts",
      "Telegram VIP channel",
      "24/7 support",
      "Refund guarantee on 5+ consecutive losses",
    ],
    icon: <Crown className="w-6 h-6" />,
    color: "border-[#0C0975]",
    bg: "bg-[#0C0975]/5",
    badge: "Most Popular",
  },
]

export default function VIPPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSubscribe(planId: string) {
    if (!session) {
      router.push("/login?callbackUrl=/vip")
      return
    }

    setLoading(planId)
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl
      } else {
        toast.error("Payment initialization failed. Please try again.")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0C0975] to-[#1a1a8c] py-16 text-white text-center">
        <div className="inline-flex items-center gap-2 bg-[#F4A500]/20 border border-[#F4A500]/30 rounded-full px-4 py-1.5 mb-6">
          <Crown className="w-4 h-4 text-[#F4A500]" />
          <span className="text-[#F4A500] text-sm font-semibold">OJ VIP Membership</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">Choose Your Plan</h1>
        <p className="text-white/70 max-w-xl mx-auto">
          Get access to OJ Predict's highest-confidence AI-powered tips. Upgrade and start winning more.
        </p>
      </div>

      {/* Plans */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 ${plan.color} p-8 shadow-sm hover:shadow-lg transition-shadow`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#0C0975] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className={`w-12 h-12 ${plan.bg} rounded-xl flex items-center justify-center text-[#0C0975] mb-4`}>
                {plan.icon}
              </div>

              <h2 className="text-2xl font-bold text-[#0C0975] mb-1">{plan.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-black text-[#0C0975]">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className="w-full bg-[#0C0975] text-white font-bold py-4 rounded-xl hover:bg-[#1a1a8c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading === plan.id ? "Processing..." : `Subscribe to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#0C0975] mb-8">Why Choose OJ VIP?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="w-6 h-6" />, title: "AI-Powered Analysis", desc: "Every tip is analysed by our Claude AI engine using H2H stats, form data, and league standings." },
              { icon: <Shield className="w-6 h-6" />, title: "Verified Results", desc: "All past results are transparently displayed on our Recent Winnings page. No hidden losses." },
              { icon: <MessageCircle className="w-6 h-6" />, title: "Instant Alerts", desc: "Get tips delivered instantly via email and our Telegram VIP channel the moment they're published." },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 bg-[#0C0975]/10 rounded-xl flex items-center justify-center text-[#0C0975] mx-auto mb-3">
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#0C0975] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center text-[#0C0975] mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How do I pay for OJ VIP?", a: "We accept Nigerian cards, bank transfer, USSD, and mobile money through Paystack — Nigeria's most trusted payment platform." },
              { q: "When will I receive tips after subscribing?", a: "Immediately! You'll get an email confirmation and your account is activated instantly. New tips are posted daily by 10am." },
              { q: "Can I cancel my subscription?", a: "Yes, you can cancel anytime from your dashboard. Your access will remain until the end of the billing period." },
              { q: "What is your refund policy?", a: "We offer refunds in cases of technical issues preventing access. See our Refund Policy for full details." },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="font-semibold text-[#0C0975] mb-2">{faq.q}</p>
                <p className="text-gray-500 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
