export const dynamic = 'force-dynamic'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Trophy, Activity, Users, BookOpen, BarChart3, Sparkles, LogOut, Menu } from "lucide-react"

const NAV = [
  { href: "/admin", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
  { href: "/admin/tips", icon: <Trophy className="w-4 h-4" />, label: "Tips" },
  { href: "/admin/ai-queue", icon: <Sparkles className="w-4 h-4" />, label: "AI Queue" },
  { href: "/admin/matches", icon: <Activity className="w-4 h-4" />, label: "Matches" },
  { href: "/admin/users", icon: <Users className="w-4 h-4" />, label: "Users" },
  { href: "/admin/blog", icon: <BookOpen className="w-4 h-4" />, label: "Blog" },
  { href: "/admin/analytics", icon: <BarChart3 className="w-4 h-4" />, label: "Analytics" },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== "ADMIN") redirect("/")

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0C0975] text-white flex-shrink-0 min-h-screen">
        <div className="p-6 border-b border-white/20">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F4A500] rounded-lg flex items-center justify-center">
              <span className="font-black text-[#0C0975] text-xs">OJ</span>
            </div>
            <div>
              <p className="font-bold text-sm">OJ Predict</p>
              <p className="text-white/50 text-xs">Admin Panel</p>
            </div>
          </a>
        </div>

        <nav className="p-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white text-sm font-medium transition-colors"
            >
              {item.icon}{item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20 mt-auto absolute bottom-0 w-64">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#F4A500] flex items-center justify-center text-[#0C0975] font-bold text-sm">
              {session.user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div>
              <p className="text-sm font-semibold">{session.user?.name}</p>
              <p className="text-white/50 text-xs">Administrator</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white text-xs">
            <LogOut className="w-3.5 h-3.5" />Back to Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
