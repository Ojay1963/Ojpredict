"use client"

import Link from "next/link"
import { TrendingUp, Shield, Zap } from "lucide-react"
import { useEffect, useState } from "react"

interface Props {
  accuracy: number
  totalTips: number
}

export function HeroSection({ accuracy, totalTips }: Props) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const greeting =
    now.getHours() < 12 ? "Good Morning" : now.getHours() < 17 ? "Good Afternoon" : "Good Evening"

  return (
    <section className="bg-gradient-to-br from-[#0C0975] via-[#1a1a8c] to-[#0C0975] text-white py-14 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-[#F4A500]/20 border border-[#F4A500]/30 rounded-full px-4 py-1.5 mb-6">
          <Zap className="w-3.5 h-3.5 text-[#F4A500]" />
          <span className="text-[#F4A500] text-sm font-semibold">AI-Powered Predictions</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
          OJ <span className="text-[#F4A500]">PREDICT</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/80 font-light mb-2">
          Predict Smart. Win Big.
        </p>
        <p className="text-white/60 max-w-xl mx-auto mb-8">
          {greeting}! AI-analysed football tips updated daily. Nigeria's most trusted prediction platform.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <StatPill icon={<TrendingUp className="w-4 h-4" />} label="Success Rate" value={`${accuracy}%`} />
          <StatPill icon={<Shield className="w-4 h-4" />} label="Tips Verified" value={`${totalTips}+`} />
          <StatPill icon={<Zap className="w-4 h-4" />} label="AI Analysis" value="Every Tip" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/vip"
            className="bg-[#F4A500] text-[#0C0975] font-bold px-8 py-4 rounded-xl text-lg hover:bg-yellow-400 transition-colors shadow-lg"
          >
            Get OJ VIP Access
          </Link>
          <a
            href="#tips"
            className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/20 transition-colors"
          >
            View Free Tips
          </a>
        </div>
      </div>
    </section>
  )
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2.5">
      <span className="text-[#F4A500]">{icon}</span>
      <span className="text-white/70 text-sm">{label}:</span>
      <span className="text-white font-bold text-sm">{value}</span>
    </div>
  )
}
