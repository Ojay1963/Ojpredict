export const dynamic = 'force-dynamic'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { TipCard } from "@/components/tips/TipCard"
import { Crown, BookmarkCheck, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { TipWithMatch } from "@/types"
import { formatDate } from "@/lib/utils"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const [user, savedTips] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    }),
    prisma.savedTip.findMany({
      where: { userId: session.user.id },
      include: { tip: { include: { match: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ])

  const subscription = user?.subscription
  const isVIP = subscription?.status === "ACTIVE" && subscription?.plan !== "FREE"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0C0975]">Welcome back, {session.user?.name?.split(" ")[0]}!</h1>
        <p className="text-gray-500 text-sm">Manage your OJ Predict account and tips</p>
      </div>

      {/* Subscription Card */}
      <div className={`rounded-xl p-6 border ${isVIP ? "bg-gradient-to-r from-[#0C0975] to-[#1a1a8c] text-white border-transparent" : "bg-white border-gray-200"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isVIP ? "bg-[#F4A500]" : "bg-gray-100"}`}>
              <Crown className={`w-6 h-6 ${isVIP ? "text-[#0C0975]" : "text-gray-400"}`} />
            </div>
            <div>
              <p className={`font-bold text-lg ${isVIP ? "text-white" : "text-gray-900"}`}>
                {isVIP ? subscription?.plan?.replace("_", " ") : "Free Plan"}
              </p>
              {isVIP && subscription?.endDate && (
                <p className="text-white/70 text-sm">Active until {formatDate(subscription.endDate)}</p>
              )}
              {!isVIP && <p className="text-gray-500 text-sm">Upgrade for premium tips</p>}
            </div>
          </div>
          {!isVIP && (
            <Link href="/vip" className="bg-[#0C0975] text-white font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-[#1a1a8c] transition-colors">
              Upgrade to VIP
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<BookmarkCheck className="w-5 h-5 text-[#0C0975]" />} label="Saved Tips" value={savedTips.length} />
        <StatCard icon={<Crown className="w-5 h-5 text-[#F4A500]" />} label="Plan" value={isVIP ? "VIP" : "Free"} />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-green-500" />} label="Status" value={isVIP ? "Active" : "Upgrade"} />
      </div>

      {/* Saved Tips */}
      <div>
        <h2 className="text-lg font-bold text-[#0C0975] mb-4">Saved Tips</h2>
        {savedTips.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center">
            <BookmarkCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No saved tips yet. Browse today's tips to save them here.</p>
            <Link href="/" className="text-[#0C0975] font-semibold text-sm mt-2 inline-block hover:underline">
              Browse Tips →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedTips.map((st) => (
              <TipCard key={st.id} tip={st.tip as unknown as TipWithMatch} userIsVIP={isVIP} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xl font-black text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
      </div>
    </div>
  )
}
