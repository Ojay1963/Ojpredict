export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { TipCard } from "@/components/tips/TipCard"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { TipWithMatch } from "@/types"

const CATEGORY_MAP: Record<string, { enum: string; label: string; description: string }> = {
  "home-win": { enum: "HOME_WIN", label: "Home Win", description: "Tips where the home team is predicted to win" },
  "away-win": { enum: "AWAY_WIN", label: "Away Win", description: "Tips where the away team is predicted to win" },
  "double-chance": { enum: "DOUBLE_CHANCE", label: "Double Chance", description: "Double chance betting tips" },
  "draw": { enum: "DRAW", label: "Draw", description: "Match draw predictions" },
  "over-15": { enum: "OVER_15", label: "Over 1.5 Goals", description: "Matches predicted to have over 1.5 goals" },
  "over-25": { enum: "OVER_25", label: "Over 2.5 Goals", description: "Matches predicted to have over 2.5 goals" },
  "over-35": { enum: "OVER_35", label: "Over 3.5 Goals", description: "Matches predicted to have over 3.5 goals" },
  "btts": { enum: "BTTS", label: "GG/BTTS", description: "Both teams to score predictions" },
  "ht-over-05": { enum: "HT_OVER_05", label: "HT Over 0.5", description: "Half-time over 0.5 goals tips" },
  "sure-2-odds": { enum: "SURE_2_ODDS", label: "Sure 2 Odds", description: "High confidence 2-odds tips" },
  "sure-3-odds": { enum: "SURE_3_ODDS", label: "Sure 3 Odds", description: "High confidence 3-odds accumulator tips" },
  "sure-5-odds": { enum: "SURE_5_ODDS", label: "Sure 5 Odds", description: "High confidence 5-odds accumulator tips" },
  "oj-banker": { enum: "OJ_BANKER", label: "OJ Banker of the Day", description: "OJ Predict's single highest-confidence tip of the day" },
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const cat = CATEGORY_MAP[params.category]
  if (!cat) return { title: "Not Found" }
  return {
    title: `${cat.label} Tips Today`,
    description: `${cat.description}. AI-analysed tips by OJ Predict.`,
  }
}

async function getTipsByCategory(categoryEnum: string): Promise<TipWithMatch[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tips = await prisma.tips.findMany({
    where: {
      category: categoryEnum as any,
      publishedAt: { not: null },
      match: { kickoff: { gte: today } },
    },
    include: { match: true },
    orderBy: [{ confidence: "desc" }, { match: { kickoff: "asc" } }],
    take: 30,
  })

  return tips as unknown as TipWithMatch[]
}

export default async function TipCategoryPage({ params }: { params: { category: string } }) {
  const cat = CATEGORY_MAP[params.category]
  if (!cat) notFound()

  const tips = await getTipsByCategory(cat.enum)

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <a href="/" className="hover:text-[#0C0975]">Home</a>
          <span>/</span>
          <span>Free Tips</span>
          <span>/</span>
          <span className="text-[#0C0975] font-medium">{cat.label}</span>
        </div>
        <h1 className="text-3xl font-black text-[#0C0975] mb-2">{cat.label} Tips Today</h1>
        <p className="text-gray-500">{cat.description}. All tips are AI-analysed by OJ Predict.</p>
      </div>

      {/* Category Quick Nav */}
      <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-gray-200">
        {Object.entries(CATEGORY_MAP).map(([slug, c]) => (
          <a
            key={slug}
            href={`/tips/${slug}`}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              slug === params.category
                ? "bg-[#0C0975] text-white border-[#0C0975]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#0C0975] hover:text-[#0C0975]"
            }`}
          >
            {c.label}
          </a>
        ))}
      </div>

      {/* Tips Grid */}
      {tips.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <div className="text-4xl mb-3">⚽</div>
          <p className="text-gray-500 text-lg font-medium mb-1">No {cat.label} tips yet today</p>
          <p className="text-gray-400 text-sm">Our AI is analysing today's matches. Tips will be published shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tips.map((tip) => (
            <TipCard key={tip.id} tip={tip} userIsVIP={false} />
          ))}
        </div>
      )}
    </div>
  )
}
