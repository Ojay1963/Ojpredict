export const dynamic = 'force-dynamic'

import type { Metadata } from "next"
import { Shield, Zap, TrendingUp, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "About OJ Predict",
  description: "Learn about OJ Predict — Nigeria's AI-powered football prediction platform.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-[#0C0975] mb-4">About OJ Predict</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Nigeria's most trusted AI-powered football prediction platform. We combine cutting-edge AI with expert analysis to deliver accurate, data-driven football tips.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {[
          { icon: <Zap className="w-7 h-7" />, title: "AI-Powered Analysis", desc: "Every tip is generated and verified by our Claude AI engine, analysing H2H records, form, league standings, and injury data." },
          { icon: <Shield className="w-7 h-7" />, title: "Transparent Results", desc: "We publish all results — wins and losses — on our Recent Winnings page. No cherry-picking, no hidden data." },
          { icon: <TrendingUp className="w-7 h-7" />, title: "Data-Driven", desc: "Our predictions are backed by real football statistics from API-Football, not guesswork or gut feelings." },
          { icon: <Users className="w-7 h-7" />, title: "Expert Reviewed", desc: "AI suggestions go through human expert review before being published, ensuring the highest quality tips." },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-14 h-14 bg-[#0C0975]/10 rounded-xl flex items-center justify-center text-[#0C0975] mb-4">
              {f.icon}
            </div>
            <h2 className="text-xl font-bold text-[#0C0975] mb-2">{f.title}</h2>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-[#0C0975] to-[#1a1a8c] rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to Start Winning?</h2>
        <p className="text-white/70 mb-6">Join thousands of punters who trust OJ Predict every day.</p>
        <div className="flex gap-3 justify-center">
          <a href="/register" className="bg-[#F4A500] text-[#0C0975] font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition-colors">
            Create Free Account
          </a>
          <a href="/vip" className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/20 transition-colors">
            View VIP Plans
          </a>
        </div>
      </div>
    </div>
  )
}
