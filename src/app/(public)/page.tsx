export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { TipCard } from "@/components/tips/TipCard"
import { HeroSection } from "@/components/tips/HeroSection"
import { WinningsTicker } from "@/components/tips/WinningsTicker"
import { StatsBar } from "@/components/tips/StatsBar"
import { VIPBanner } from "@/components/tips/VIPBanner"
import type { TipWithMatch } from "@/types"

async function getTodaysTips(): Promise<TipWithMatch[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const tips = await prisma.tips.findMany({
    where: {
      publishedAt: { not: null },
      match: {
        kickoff: { gte: today, lt: tomorrow },
      },
    },
    include: {
      match: true,
    },
    orderBy: [{ vipOnly: "asc" }, { confidence: "desc" }],
    take: 20,
  })

  return tips as unknown as TipWithMatch[]
}

async function getRecentWinnings() {
  const won = await prisma.tips.count({ where: { result: "WON" } })
  const lost = await prisma.tips.count({ where: { result: "LOST" } })
  const total = won + lost
  return {
    won,
    total,
    accuracy: total > 0 ? Math.round((won / total) * 100) : 0,
  }
}

export default async function HomePage() {
  const [tips, winnings] = await Promise.all([getTodaysTips(), getRecentWinnings()])

  const freeTips = tips.filter((t) => !t.vipOnly)
  const vipTips = tips.filter((t) => t.vipOnly)

  return (
    <div>
      <HeroSection accuracy={winnings.accuracy} totalTips={winnings.total} />
      <WinningsTicker />
      <StatsBar won={winnings.won} total={winnings.total} accuracy={winnings.accuracy} />

      <div className="container mx-auto px-4 py-10">
        {/* Free Tips */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0C0975]">Today's Free Tips</h2>
              <p className="text-gray-500 text-sm mt-1">AI-analysed predictions for today's matches</p>
            </div>
            <a href="/tips/over-25" className="text-sm text-[#0C0975] font-semibold hover:underline">
              View All Categories →
            </a>
          </div>

          {freeTips.length === 0 ? (
            <EmptyTips message="Today's free tips will be published soon. Check back shortly!" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {freeTips.map((tip) => (
                <TipCard key={tip.id} tip={tip} userIsVIP={false} />
              ))}
            </div>
          )}
        </div>

        {/* VIP Tips Banner */}
        <VIPBanner />

        {/* VIP Tips (teaser) */}
        {vipTips.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#0C0975]">OJ VIP Tips</h2>
                <p className="text-gray-500 text-sm mt-1">Premium tips for serious punters</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {vipTips.slice(0, 3).map((tip) => (
                <TipCard key={tip.id} tip={tip} userIsVIP={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyTips({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
      <div className="text-4xl mb-3">⚽</div>
      <p className="text-gray-500">{message}</p>
    </div>
  )
}
