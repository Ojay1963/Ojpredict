export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { cn, formatDateTime, getTipCategoryLabel } from "@/lib/utils"
import Link from "next/link"

export default async function AdminTipsPage({
  searchParams,
}: {
  searchParams: { result?: string; vip?: string; page?: string }
}) {
  const page = Number(searchParams.page ?? 1)
  const take = 25
  const skip = (page - 1) * take

  const where: any = {}
  if (searchParams.result) where.result = searchParams.result
  if (searchParams.vip === "true") where.vipOnly = true
  if (searchParams.vip === "false") where.vipOnly = false

  const [tips, total] = await Promise.all([
    prisma.tips.findMany({
      where,
      include: { match: true },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    }),
    prisma.tips.count({ where }),
  ])

  const totalPages = Math.ceil(total / take)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tips Management</h1>
        <Link href="/admin/tips/new" className="bg-[#0C0975] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1a1a8c] text-sm">
          + New Tip
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: "All", params: "" },
          { label: "WON", params: "result=WON" },
          { label: "LOST", params: "result=LOST" },
          { label: "PENDING", params: "result=PENDING" },
          { label: "VIP Only", params: "vip=true" },
          { label: "Free", params: "vip=false" },
        ].map((f) => (
          <a
            key={f.label}
            href={`/admin/tips${f.params ? "?" + f.params : ""}`}
            className="px-3 py-1.5 rounded-full text-xs font-semibold border bg-white text-gray-700 border-gray-200 hover:border-[#0C0975] hover:text-[#0C0975] transition-colors"
          >
            {f.label}
          </a>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-gray-500 font-semibold">Match</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold">Prediction</th>
                <th className="px-4 py-3 text-center text-gray-500 font-semibold">Conf.</th>
                <th className="px-4 py-3 text-center text-gray-500 font-semibold">VIP</th>
                <th className="px-4 py-3 text-center text-gray-500 font-semibold">Result</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold">Published</th>
                <th className="px-4 py-3 text-center text-gray-500 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tips.map((tip) => (
                <tr key={tip.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{tip.match.homeTeam} vs {tip.match.awayTeam}</p>
                    <p className="text-xs text-gray-400">{tip.match.league} · {formatDateTime(tip.match.kickoff)}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{getTipCategoryLabel(tip.category)}</td>
                  <td className="px-4 py-3 font-semibold text-[#0C0975]">{tip.prediction}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("text-xs font-bold px-2 py-1 rounded", tip.confidence >= 75 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                      {tip.confidence}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("text-xs font-semibold", tip.vipOnly ? "text-[#F4A500]" : "text-gray-400")}>
                      {tip.vipOnly ? "VIP" : "Free"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("text-xs font-bold px-2 py-1 rounded-full", {
                      "bg-green-100 text-green-700": tip.result === "WON",
                      "bg-red-100 text-red-700": tip.result === "LOST",
                      "bg-amber-100 text-amber-700": tip.result === "PENDING",
                      "bg-gray-100 text-gray-700": tip.result === "VOID",
                    })}>
                      {tip.result}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {tip.publishedAt ? formatDateTime(tip.publishedAt) : "Draft"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link href={`/admin/tips/${tip.id}`} className="text-[#0C0975] hover:underline text-xs font-medium mr-3">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin/tips?page=${p}`}
              className={cn("w-9 h-9 flex items-center justify-center rounded-lg text-sm border font-semibold", p === page ? "bg-[#0C0975] text-white border-[#0C0975]" : "bg-white text-gray-700 border-gray-200")}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
