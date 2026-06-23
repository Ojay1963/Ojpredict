import { prisma } from "@/lib/prisma"

async function getRecentWins() {
  return prisma.tips.findMany({
    where: { result: "WON" },
    include: { match: { select: { homeTeam: true, awayTeam: true } } },
    orderBy: { updatedAt: "desc" },
    take: 15,
  })
}

export async function WinningsTicker() {
  const wins = await getRecentWins()

  if (!wins.length) return null

  const items = wins.map(
    (w) => `✅ ${w.match.homeTeam} vs ${w.match.awayTeam} — ${w.prediction} WON!`
  )

  return (
    <div className="bg-[#0C0975] border-t border-white/10 overflow-hidden py-2.5">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-[#F4A500] text-[#0C0975] font-bold text-xs px-3 py-1 mx-3 rounded">
          LATEST WINS
        </div>
        <div className="overflow-hidden flex-1">
          <div className="whitespace-nowrap animate-ticker inline-block">
            {[...items, ...items].map((item, i) => (
              <span key={i} className="text-white/80 text-sm mx-8">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
