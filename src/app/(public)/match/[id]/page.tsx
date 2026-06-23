export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { formatDateTime, getConfidenceBarColor, getConfidenceColor, getTipCategoryLabel, getResultBadgeStyle } from "@/lib/utils"
import Image from "next/image"
import type { Metadata } from "next"
import { cn } from "@/lib/utils"
import { TrendingUp, Clock, MapPin, Activity } from "lucide-react"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const match = await prisma.match.findUnique({ where: { id: params.id } })
  if (!match) return { title: "Match Not Found" }
  return {
    title: `${match.homeTeam} vs ${match.awayTeam} Prediction`,
    description: `OJ Predict AI analysis for ${match.homeTeam} vs ${match.awayTeam}. ${match.league}.`,
  }
}

export default async function MatchDetailPage({ params }: { params: { id: string } }) {
  const match = await prisma.match.findUnique({
    where: { id: params.id },
    include: {
      tips: { orderBy: { confidence: "desc" } },
      h2h: { orderBy: { date: "desc" }, take: 10 },
    },
  })

  if (!match) notFound()

  const isLive = match.status === "LIVE"
  const isFT = match.status === "FT"

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-[#0C0975]">Home</a>
        <span>/</span>
        <span>{match.league}</span>
        <span>/</span>
        <span className="text-[#0C0975] font-medium">{match.homeTeam} vs {match.awayTeam}</span>
      </div>

      {/* Match Header Card */}
      <div className="bg-gradient-to-br from-[#0C0975] to-[#1a1a8c] rounded-2xl p-8 text-white mb-8">
        <div className="text-center mb-2">
          <span className="text-white/60 text-sm">{match.league} · {match.country}</span>
        </div>

        <div className="flex items-center justify-between">
          <TeamBlock name={match.homeTeam} logo={match.homeTeamLogo} />

          <div className="text-center px-4">
            {isFT || isLive ? (
              <div>
                <div className="text-4xl font-black mb-1">
                  {match.homeScore ?? 0}–{match.awayScore ?? 0}
                </div>
                <span className={cn("text-xs font-bold px-3 py-1 rounded-full", isLive ? "bg-purple-500 animate-pulse" : "bg-green-600")}>
                  {isLive ? "LIVE" : "Full Time"}
                </span>
              </div>
            ) : (
              <div>
                <div className="text-2xl font-black mb-1">VS</div>
                <div className="flex items-center gap-1 text-white/70 text-sm">
                  <Clock className="w-4 h-4" />
                  {formatDateTime(match.kickoff)}
                </div>
              </div>
            )}
          </div>

          <TeamBlock name={match.awayTeam} logo={match.awayTeamLogo} />
        </div>

        {/* Match Info */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-white/20">
          <InfoChip icon={<Clock className="w-3.5 h-3.5" />} label={formatDateTime(match.kickoff)} />
          {match.venue && <InfoChip icon={<MapPin className="w-3.5 h-3.5" />} label={match.venue} />}
          <InfoChip icon={<Activity className="w-3.5 h-3.5" />} label={match.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Tips */}
        <div className="lg:col-span-2 space-y-6">
          {/* OJ Predictions */}
          <section>
            <h2 className="text-xl font-bold text-[#0C0975] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#F4A500]" />
              OJ Predict Tips
            </h2>
            <div className="space-y-3">
              {match.tips.length === 0 ? (
                <p className="text-gray-500 text-sm">No tips published for this match yet.</p>
              ) : (
                match.tips.map((tip) => (
                  <div key={tip.id} className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs text-gray-400 uppercase font-medium">{getTipCategoryLabel(tip.category)}</span>
                        <p className="text-lg font-bold text-[#0C0975]">{tip.prediction}</p>
                        {tip.odds && <span className="text-sm text-gray-500">Odds: @{tip.odds}</span>}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={cn("text-sm font-bold px-2 py-1 rounded-lg", getConfidenceColor(tip.confidence))}>
                          {tip.confidence}% Confidence
                        </span>
                        {tip.result !== "PENDING" && (
                          <span className={cn("text-xs px-2 py-0.5 rounded-full border font-semibold", getResultBadgeStyle(tip.result))}>
                            {tip.result}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Confidence bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                      <div
                        className={cn("h-2 rounded-full", getConfidenceBarColor(tip.confidence))}
                        style={{ width: `${tip.confidence}%` }}
                      />
                    </div>

                    {/* AI Analysis */}
                    {tip.aiAnalysis && !tip.vipOnly && (
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />OJ AI Analysis
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">{tip.aiAnalysis}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* H2H Section */}
          {match.h2h.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-[#0C0975] mb-4">Head-to-Head History</h2>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-gray-600 font-semibold">Date</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-semibold">Home</th>
                        <th className="px-4 py-3 text-center text-gray-600 font-semibold">Score</th>
                        <th className="px-4 py-3 text-right text-gray-600 font-semibold">Away</th>
                        <th className="px-4 py-3 text-left text-gray-600 font-semibold">Competition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {match.h2h.map((h) => {
                        const homeWon = h.homeScore > h.awayScore
                        const awayWon = h.awayScore > h.homeScore
                        return (
                          <tr key={h.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-500">{new Date(h.date).toLocaleDateString()}</td>
                            <td className={cn("px-4 py-3 font-medium", homeWon ? "text-green-700" : "text-gray-700")}>{h.homeTeam}</td>
                            <td className="px-4 py-3 text-center font-bold text-[#0C0975]">{h.homeScore}–{h.awayScore}</td>
                            <td className={cn("px-4 py-3 font-medium text-right", awayWon ? "text-green-700" : "text-gray-700")}>{h.awayTeam}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{h.competition}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-[#0C0975] mb-3">Match Info</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">League</dt><dd className="font-medium text-right">{match.league}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Country</dt><dd className="font-medium">{match.country}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Kickoff</dt><dd className="font-medium">{formatDateTime(match.kickoff)}</dd></div>
              {match.venue && <div className="flex justify-between"><dt className="text-gray-500">Venue</dt><dd className="font-medium text-right">{match.venue}</dd></div>}
              {match.referee && <div className="flex justify-between"><dt className="text-gray-500">Referee</dt><dd className="font-medium">{match.referee}</dd></div>}
            </dl>
          </div>

          {/* VIP Promo */}
          <div className="bg-gradient-to-br from-[#0C0975] to-[#1a1a8c] rounded-xl p-4 text-white">
            <p className="font-bold mb-1">Want More Tips?</p>
            <p className="text-white/70 text-xs mb-3">Upgrade to OJ VIP for premium high-confidence picks.</p>
            <a href="/vip" className="block text-center bg-[#F4A500] text-[#0C0975] font-bold py-2.5 rounded-lg text-sm hover:bg-yellow-400 transition-colors">
              Get VIP Access
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function TeamBlock({ name, logo }: { name: string; logo?: string | null }) {
  return (
    <div className="flex flex-col items-center gap-3 flex-1">
      {logo ? (
        <Image src={logo} alt={name} width={64} height={64} className="object-contain" />
      ) : (
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-xl">
          {name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <span className="font-bold text-center text-sm md:text-base">{name}</span>
    </div>
  )
}

function InfoChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs text-white/80">
      {icon}{label}
    </div>
  )
}
