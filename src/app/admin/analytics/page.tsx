export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"

export default async function AdminAnalyticsPage() {
  const [
    totalTips, wonTips, lostTips,
    totalUsers, vipUsers,
    totalPosts, totalViews,
    tipsByCategory,
    recentActivity,
  ] = await Promise.all([
    prisma.tips.count(),
    prisma.tips.count({ where: { result: "WON" } }),
    prisma.tips.count({ where: { result: "LOST" } }),
    prisma.user.count(),
    prisma.subscription.count({ where: { status: "ACTIVE", plan: { not: "FREE" } } }),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.blogPost.aggregate({ _sum: { views: true } }),
    prisma.tips.groupBy({ by: ["category"], _count: { id: true }, orderBy: { _count: { id: "desc" } }, take: 10 }),
    prisma.tips.findMany({
      where: { result: { in: ["WON", "LOST"] } },
      include: { match: { select: { homeTeam: true, awayTeam: true, kickoff: true } } },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ])

  const completed = wonTips + lostTips
  const accuracy = completed > 0 ? Math.round((wonTips / completed) * 100) : 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <AnalyticsCard label="Total Tips" value={totalTips} />
        <AnalyticsCard label="Accuracy" value={`${accuracy}%`} />
        <AnalyticsCard label="Total Users" value={totalUsers} />
        <AnalyticsCard label="VIP Subscribers" value={vipUsers} />
        <AnalyticsCard label="Tips Won" value={wonTips} />
        <AnalyticsCard label="Tips Lost" value={lostTips} />
        <AnalyticsCard label="Blog Posts" value={totalPosts} />
        <AnalyticsCard label="Blog Views" value={(totalViews._sum.views ?? 0).toLocaleString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tips by Category */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Tips by Category</h2>
          <div className="space-y-3">
            {tipsByCategory.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{cat.category.replace(/_/g, " ")}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0C0975] rounded-full"
                      style={{ width: `${(cat._count.id / totalTips) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900">{cat._count.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Recent Results</h2>
          <div className="space-y-3">
            {recentActivity.map((tip) => (
              <div key={tip.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{tip.match.homeTeam} vs {tip.match.awayTeam}</p>
                  <p className="text-xs text-gray-400">{tip.prediction}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${tip.result === "WON" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {tip.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">{label}</p>
      <p className="text-2xl font-black text-[#0C0975]">{value}</p>
    </div>
  )
}
