import Link from "next/link"
import { Facebook, Twitter, Instagram, Send } from "lucide-react"

const LINKS = {
  tips: [
    { label: "Home Win", href: "/tips/home-win" },
    { label: "Over 2.5", href: "/tips/over-25" },
    { label: "GG/BTTS", href: "/tips/btts" },
    { label: "OJ Banker", href: "/tips/oj-banker" },
    { label: "Sure 3 Odds", href: "/tips/sure-3-odds" },
  ],
  company: [
    { label: "About OJ Predict", href: "/about" },
    { label: "VIP Plans", href: "/vip" },
    { label: "Recent Winnings", href: "/winnings" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#0C0975] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#F4A500] rounded-lg flex items-center justify-center">
                <span className="font-black text-[#0C0975] text-sm">OJ</span>
              </div>
              <span className="font-bold text-xl">PREDICT</span>
            </Link>
            <p className="text-white/70 text-sm mb-4 leading-relaxed">
              Nigeria's most trusted AI-powered football prediction platform. Predict Smart. Win Big.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-lg text-white/80 hover:bg-[#F4A500] hover:text-[#0C0975] transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-lg text-white/80 hover:bg-[#F4A500] hover:text-[#0C0975] transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-lg text-white/80 hover:bg-[#F4A500] hover:text-[#0C0975] transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-lg text-white/80 hover:bg-[#F4A500] hover:text-[#0C0975] transition-colors"><Send className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Free Tips */}
          <div>
            <h3 className="font-bold text-[#F4A500] mb-4 uppercase text-xs tracking-wider">Free Tips</h3>
            <ul className="space-y-2">
              {LINKS.tips.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-[#F4A500] mb-4 uppercase text-xs tracking-wider">Company</h3>
            <ul className="space-y-2">
              {LINKS.company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-[#F4A500] mb-4 uppercase text-xs tracking-wider">Legal</h3>
            <ul className="space-y-2">
              {LINKS.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 pt-6 border-t border-white/20">
          <p className="text-white/40 text-xs text-center leading-relaxed max-w-3xl mx-auto">
            <strong className="text-white/60">Disclaimer:</strong> OJ Predict provides football analysis and predictions for informational and entertainment purposes only.
            Gambling involves financial risk. Please bet responsibly. OJ Predict is not responsible for any financial losses.
            You must be 18+ to use betting services. Gamble responsibly.
          </p>
          <p className="text-white/40 text-xs text-center mt-4">
            © {new Date().getFullYear()} OJ Predict | ojpredict.com | All rights reserved.
          </p>
        </div>
      </div>

    </footer>
  )
}
