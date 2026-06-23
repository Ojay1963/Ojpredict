export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { HeroSection } from "@/components/tips/HeroSection"
import { WinningsTicker } from "@/components/tips/WinningsTicker"
import { StatsBar } from "@/components/tips/StatsBar"
import { VIPBanner } from "@/components/tips/VIPBanner"
import { TipsSection } from "@/components/tips/TipsSection"
import { AdSlot } from "@/components/ads/AdSlot"
import type { TipWithMatch } from "@/types"

async function getTodaysTips(): Promise<TipWithMatch[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const tips = await prisma.tips.findMany({
    where: {
      publishedAt: { not: null },
      match: { kickoff: { gte: today, lt: tomorrow } },
    },
    include: { match: true },
    orderBy: [{ vipOnly: "asc" }, { match: { kickoff: "asc" } }, { confidence: "desc" }],
    take: 50,
  })

  return tips as unknown as TipWithMatch[]
}

async function getStats() {
  const won = await prisma.tips.count({ where: { result: "WON" } })
  const lost = await prisma.tips.count({ where: { result: "LOST" } })
  const total = won + lost
  return { won, total, accuracy: total > 0 ? Math.round((won / total) * 100) : 0 }
}

export default async function HomePage() {
  const [tips, stats] = await Promise.all([getTodaysTips(), getStats()])

  return (
    <div>
      <HeroSection accuracy={stats.accuracy} totalTips={stats.total} />
      <WinningsTicker />
      <StatsBar won={stats.won} total={stats.total} accuracy={stats.accuracy} />

      {/* Ad — below stats bar */}
      <div className="container mx-auto px-4">
        <AdSlot size="leaderboard" />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tips Table */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-[#0C0975]">Football Predictions</h2>
              <p className="text-gray-500 text-sm mt-0.5">AI-analysed tips — updated daily</p>
            </div>
            <a href="/tips/over-25" className="text-sm text-[#0C0975] font-semibold hover:underline hidden md:block">
              View All Categories →
            </a>
          </div>

          <TipsSection initialTips={tips} userIsVIP={false} />
        </div>

        {/* Ad — between tips and VIP banner */}
        <AdSlot size="billboard" className="mb-6" />

        {/* VIP Banner */}
        <VIPBanner />
      </div>
    </div>
  )
}
