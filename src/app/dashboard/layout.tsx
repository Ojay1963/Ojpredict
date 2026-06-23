export const dynamic = 'force-dynamic'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import { LayoutDashboard, CreditCard, Bell } from "lucide-react"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login?callbackUrl=/dashboard")

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#0C0975] flex items-center justify-center text-white font-bold">
                  {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{session.user?.name}</p>
                  <p className="text-xs text-gray-400">{session.user?.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                <DashLink href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
                <DashLink href="/dashboard/subscription" icon={<CreditCard className="w-4 h-4" />} label="Subscription" />
                <DashLink href="/dashboard/notifications" icon={<Bell className="w-4 h-4" />} label="Notifications" />
              </nav>
            </div>
          </aside>

          {/* Main */}
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function DashLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0C0975] text-sm font-medium transition-colors">
      {icon}{label}
    </Link>
  )
}
