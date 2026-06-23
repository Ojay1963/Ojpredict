export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { Trophy, Users, TrendingUp, CheckCircle, XCircle, Clock, Crown } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const [totalTips, wonTips, lostTips, pendingTips, totalUsers, vipUsers, recentTips] = await Promise.all([
    prisma.tips.count(),
    prisma.tips.count({ where: { result: "WON" } }),
    prisma.tips.count({ where: { result: "LOST" } }),
    prisma.tips.count({ where: { result: "PENDING" } }),
    prisma.user.count(),
    prisma.subscription.count({ where: { status: "ACTIVE", plan: { not: "FREE" } } }),
    prisma.tips.findMany({
      include: { match: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ])

  const completedTips = wonTips + lostTips
  const accuracy = completedTips > 0 ? Math.round((wonTips / completedTips) * 100) : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">OJ Predict — Control Panel</p>
        </div>
        <Link
          href="/admin/tips/new"
          className="bg-[#0C0975] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1a1a8c] transition-colors text-sm"
        >
          + New Tip
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Trophy className="w-5 h-5 text-[#0C0975]" />} label="Total Tips" value={totalTips} color="blue" />
        <StatCard icon={<CheckCircle className="w-5 h-5 text-green-600" />} label="Won" value={wonTips} color="green" />
        <StatCard icon={<XCircle className="w-5 h-5 text-red-600" />} label="Lost" value={lostTips} color="red" />
        <StatCard icon={<Clock className="w-5 h-5 text-amber-600" />} label="Pending" value={pendingTips} color="amber" />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-[#0C0975]" />} label="Accuracy" value={`${accuracy}%`} color="blue" />
        <StatCard icon={<Users className="w-5 h-5 text-gray-600" />} label="Total Users" value={totalUsers} color="gray" />
        <StatCard icon={<Crown className="w-5 h-5 text-[#F4A500]" />} label="VIP Users" value={vipUsers} color="gold" />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-green-600" />} label="Completed" value={completedTips} color="green" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { href: "/admin/tips/new", label: "Add New Tip", desc: "Manually create a prediction", color: "bg-[#0C0975]" },
          { href: "/admin/ai-queue", label: "AI Queue", desc: "Review AI-generated tips", color: "bg-purple-700" },
          { href: "/admin/matches", label: "Sync Matches", desc: "Fetch fixtures from API-Football", color: "bg-teal-700" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`${a.color} text-white rounded-xl p-5 hover:opacity-90 transition-opacity`}
          >
            <p className="font-bold mb-1">{a.label}</p>
            <p className="text-white/70 text-sm">{a.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Tips */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Tips</h2>
          <Link href="/admin/tips" className="text-sm text-[#0C0975] font-medium hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-gray-500 font-semibold">Match</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold">Prediction</th>
                <th className="px-4 py-3 text-center text-gray-500 font-semibold">Confidence</th>
                <th className="px-4 py-3 text-center text-gray-500 font-semibold">VIP</th>
                <th className="px-4 py-3 text-center text-gray-500 font-semibold">Result</th>
                <th className="px-4 py-3 text-center text-gray-500 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentTips.map((tip) => (
                <tr key={tip.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {tip.match.homeTeam} vs {tip.match.awayTeam}
                    <div className="text-xs text-gray-400">{tip.match.league}</div>
                  </td>
                  <td className="px-4 py-3 text-[#0C0975] font-semibold">{tip.prediction}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${tip.confidence >= 75 ? "bg-green-100 text-green-700" : tip.confidence >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                      {tip.confidence}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold ${tip.vipOnly ? "text-[#F4A500]" : "text-gray-400"}`}>
                      {tip.vipOnly ? "VIP" : "Free"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ResultBadge result={tip.result} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link href={`/admin/tips/${tip.id}`} className="text-[#0C0975] hover:underline text-xs font-medium">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  const bg = { blue: "bg-blue-50", green: "bg-green-50", red: "bg-red-50", amber: "bg-amber-50", gray: "bg-gray-50", gold: "bg-yellow-50" }
  return (
    <div className={`${bg[color as keyof typeof bg] ?? "bg-gray-50"} rounded-xl p-4 border border-gray-200`}>
      <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs font-semibold text-gray-500 uppercase">{label}</span></div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
  )
}

function ResultBadge({ result }: { result: string }) {
  const styles = { WON: "bg-green-100 text-green-700", LOST: "bg-red-100 text-red-700", PENDING: "bg-amber-100 text-amber-700", VOID: "bg-gray-100 text-gray-700" }
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-full ${styles[result as keyof typeof styles] ?? "bg-gray-100 text-gray-700"}`}>
      {result}
    </span>
  )
}
