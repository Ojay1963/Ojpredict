"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, ChevronDown, Trophy, Star, Home, BookOpen, Users, LogOut, LayoutDashboard, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const FREE_TIPS = [
  { label: "Home Win", href: "/tips/home-win" },
  { label: "Away Win", href: "/tips/away-win" },
  { label: "Double Chance", href: "/tips/double-chance" },
  { label: "Over 1.5", href: "/tips/over-15" },
  { label: "Over 2.5", href: "/tips/over-25" },
  { label: "GG/BTTS", href: "/tips/btts" },
  { label: "Sure 2 Odds", href: "/tips/sure-2-odds" },
  { label: "Sure 3 Odds", href: "/tips/sure-3-odds" },
  { label: "OJ Banker", href: "/tips/oj-banker" },
]

export function Navbar() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [tipsOpen, setTipsOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#0C0975] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#F4A500] rounded-lg flex items-center justify-center">
              <span className="font-black text-[#0C0975] text-sm">OJ</span>
            </div>
            <span className="font-bold text-white text-xl tracking-tight">PREDICT</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="flex items-center text-white/85 text-sm font-medium px-3 py-2 rounded-lg transition-all hover:text-white hover:bg-white/10">
              <Home className="w-4 h-4 mr-1" />Home
            </Link>

            {/* Free Tips Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center text-white/85 text-sm font-medium px-3 py-2 rounded-lg transition-all hover:text-white hover:bg-white/10"
                onMouseEnter={() => setTipsOpen(true)}
                onMouseLeave={() => setTipsOpen(false)}
              >
                <Trophy className="w-4 h-4 mr-1" />Free Tips
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>
              {tipsOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                  onMouseEnter={() => setTipsOpen(true)}
                  onMouseLeave={() => setTipsOpen(false)}
                >
                  {FREE_TIPS.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0C0975] font-medium"
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/winnings" className="flex items-center text-white/85 text-sm font-medium px-3 py-2 rounded-lg transition-all hover:text-white hover:bg-white/10">
              <Star className="w-4 h-4 mr-1" />Winnings
            </Link>
            <Link href="/blog" className="flex items-center text-white/85 text-sm font-medium px-3 py-2 rounded-lg transition-all hover:text-white hover:bg-white/10">
              <BookOpen className="w-4 h-4 mr-1" />Blog
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/vip"
              className="bg-[#F4A500] text-[#0C0975] font-bold px-4 py-2 rounded-lg text-sm hover:bg-yellow-400 transition-colors"
            >
              VIP Plans
            </Link>

            {session ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 bg-white/10 text-white px-3 py-2 rounded-lg hover:bg-white/20"
                  onClick={() => setUserOpen(!userOpen)}
                >
                  <div className="w-7 h-7 rounded-full bg-[#F4A500] flex items-center justify-center text-[#0C0975] font-bold text-xs">
                    {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {userOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <LayoutDashboard className="w-4 h-4" />Dashboard
                    </Link>
                    {session.user?.role === "ADMIN" && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Shield className="w-4 h-4" />Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-white/80 hover:text-white text-sm font-medium">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-[#0C0975] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/20 py-4 space-y-1">
            <Link href="/" className="block text-white/85 text-sm font-medium px-3 py-2.5 rounded-lg transition-all hover:text-white hover:bg-white/10" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/winnings" className="block text-white/85 text-sm font-medium px-3 py-2.5 rounded-lg transition-all hover:text-white hover:bg-white/10" onClick={() => setMobileOpen(false)}>Recent Winnings</Link>
            <Link href="/blog" className="block text-white/85 text-sm font-medium px-3 py-2.5 rounded-lg transition-all hover:text-white hover:bg-white/10" onClick={() => setMobileOpen(false)}>Blog</Link>
            <Link href="/vip" className="block text-[#F4A500] font-bold text-sm px-3 py-2.5 rounded-lg transition-all hover:bg-white/10" onClick={() => setMobileOpen(false)}>VIP Plans</Link>
            <div className="pt-2 border-t border-white/20">
              <p className="text-white/60 text-xs uppercase px-3 py-1">Free Tips</p>
              {FREE_TIPS.map((t) => (
                <Link key={t.href} href={t.href} className="block text-white/85 text-sm font-medium px-3 py-2.5 rounded-lg transition-all hover:text-white hover:bg-white/10" onClick={() => setMobileOpen(false)}>
                  {t.label}
                </Link>
              ))}
            </div>
            {session ? (
              <div className="pt-2 border-t border-white/20">
                <Link href="/dashboard" className="block text-white/85 text-sm font-medium px-3 py-2.5 rounded-lg transition-all hover:text-white hover:bg-white/10" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin" className="block text-white/85 text-sm font-medium px-3 py-2.5 rounded-lg transition-all hover:text-white hover:bg-white/10" onClick={() => setMobileOpen(false)}>Admin Panel</Link>
                )}
                <button onClick={() => signOut({ callbackUrl: "/" })} className="block text-red-400 text-sm font-medium px-3 py-2.5 rounded-lg transition-all hover:bg-white/10 text-left w-full">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-white/20 flex gap-2 px-3">
                <Link href="/login" className="flex-1 text-center py-2 text-white border border-white/30 rounded-lg text-sm" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link href="/register" className="flex-1 text-center py-2 bg-[#F4A500] text-[#0C0975] font-bold rounded-lg text-sm" onClick={() => setMobileOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        )}
      </div>

    </nav>
  )
}
