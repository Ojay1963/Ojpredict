import Link from "next/link"
import { Crown, Check } from "lucide-react"

export function VIPBanner() {
  return (
    <div className="bg-gradient-to-r from-[#0C0975] to-[#1a1a8c] rounded-2xl p-8 text-white my-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#F4A500] rounded-xl flex items-center justify-center flex-shrink-0">
            <Crown className="w-7 h-7 text-[#0C0975]" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">Upgrade to OJ VIP</h3>
            <p className="text-white/70 text-sm">Get our highest-confidence, AI-verified premium tips</p>
            <div className="flex flex-wrap gap-4 mt-2">
              {["5–10 Odds Accumulators", "Safe Banker Tips", "Telegram Alerts", "AI Analysis"].map((f) => (
                <span key={f} className="flex items-center gap-1 text-xs text-white/80">
                  <Check className="w-3 h-3 text-[#F4A500]" />{f}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <p className="text-white/60 text-xs uppercase tracking-wide">Starting from</p>
          <p className="text-3xl font-black text-[#F4A500]">₦3,000<span className="text-sm font-normal text-white/60">/mo</span></p>
          <Link
            href="/vip"
            className="bg-[#F4A500] text-[#0C0975] font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition-colors whitespace-nowrap"
          >
            Get VIP Access Now
          </Link>
        </div>
      </div>
    </div>
  )
}
