export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { cn, formatDate, getResultBadgeStyle, getTipCategoryLabel } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recent Winnings — OJ Predict",
  description: "View OJ Predict's recent winning tips and overall accuracy. Transparent results record.",
}

export default async function WinningsPage({
  searchParams,
}: {
  searchParams: { page?: string; result?: string }
}) {
  const page = Number(searchParams.page ?? 1)
  const take = 20
  const skip = (page - 1) * take

  const whereResult = searchParams.result
    ? { result: searchParams.result as any }
    : { result: { in: ["WON", "LOST"] as any[] } }

  const [tips, total, won, lost] = await Promise.all([
    prisma.tips.findMany({
      where: { ...whereResult, publishedAt: { not: null } },
      include: { match: true },
      orderBy: { updatedAt: "desc" },
      take,
      skip,
    }),
    prisma.tips.count({ where: { ...whereResult, publishedAt: { not: null } } }),
    prisma.tips.count({ where: { result: "WON" } }),
    prisma.tips.count({ where: { result: "LOST" } }),
  ])

  const totalCompleted = won + lost
  const accuracy = totalCompleted > 0 ? Math.round((won / totalCompleted) * 100) : 0
  const totalPages = Math.ceil(total / take)

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-[#0C0975] mb-2">Recent Winnings</h1>
      <p className="text-gray-500 mb-8">OJ Predict's complete verified results record.</p>

      {/* Accuracy Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Tips Won" value={won} color="green" />
        <StatCard label="Tips Lost" value={lost} color="red" />
        <StatCard label="Accuracy" value={`${accuracy}%`} color="blue" />
      </div>

      {/* Accuracy Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Overall Accuracy</span>
          <span className="text-2xl font-black text-[#0C0975]">{accuracy}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-[#0C0975] to-[#F4A500] transition-all"
            style={{ width: `${accuracy}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">{won} won out of {totalCompleted} completed tips</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {[{ label: "All Results", value: "" }, { label: "Won", value: "WON" }, { label: "Lost", value: "LOST" }].map((f) => (
          <a
            key={f.value}
            href={`/winnings${f.value ? `?result=${f.value}` : ""}`}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold border transition-colors",
              (searchParams.result ?? "") === f.value
                ? "bg-[#0C0975] text-white border-[#0C0975]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#0C0975]"
            )}
          >
            {f.label}
          </a>
        ))}
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0C0975] text-white">
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Match</th>
                <th className="px-4 py-3 text-left">League</th>
                <th className="px-4 py-3 text-left">Tip Type</th>
                <th className="px-4 py-3 text-left">Prediction</th>
                <th className="px-4 py-3 text-center">Odds</th>
                <th className="px-4 py-3 text-center">Result</th>
              </tr>
            </thead>
            <tbody>
              {tips.map((tip, i) => (
                <tr key={tip.id} className={cn("border-b border-gray-100 hover:bg-gray-50", i % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(tip.match.kickoff)}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {tip.match.homeTeam} vs {tip.match.awayTeam}
                    <div className="text-xs text-gray-400">{tip.match.homeScore}–{tip.match.awayScore} FT</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{tip.match.league}</td>
                  <td className="px-4 py-3 text-gray-500">{getTipCategoryLabel(tip.category)}</td>
                  <td className="px-4 py-3 font-semibold text-[#0C0975]">{tip.prediction}</td>
                  <td className="px-4 py-3 text-center">{tip.odds ?? "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full border", getResultBadgeStyle(tip.result))}>
                      {tip.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
            Math.max(0, page - 3),
            Math.min(totalPages, page + 2)
          ).map((p) => (
            <a
              key={p}
              href={`/winnings?page=${p}${searchParams.result ? `&result=${searchParams.result}` : ""}`}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg font-semibold text-sm border",
                p === page ? "bg-[#0C0975] text-white border-[#0C0975]" : "bg-white text-gray-700 border-gray-200 hover:border-[#0C0975]"
              )}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colorMap = {
    green: "text-green-700 bg-green-50 border-green-200",
    red: "text-red-700 bg-red-50 border-red-200",
    blue: "text-[#0C0975] bg-blue-50 border-blue-200",
  }
  return (
    <div className={cn("rounded-xl border p-6 text-center", colorMap[color as keyof typeof colorMap])}>
      <p className="text-3xl font-black mb-1">{value}</p>
      <p className="text-sm font-semibold">{label}</p>
    </div>
  )
}
