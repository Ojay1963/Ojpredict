"use client"
export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

const TIP_CATEGORIES = [
  "HOME_WIN", "AWAY_WIN", "DOUBLE_CHANCE", "DRAW",
  "OVER_15", "OVER_25", "OVER_35", "BTTS", "HT_OVER_05",
  "SURE_2_ODDS", "SURE_3_ODDS", "SURE_5_ODDS", "OJ_BANKER",
]

export default function EditTipPage() {
  const { id } = useParams()
  const router = useRouter()
  const [tip, setTip] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/tips/${id}`).then((r) => r.json()).then((d) => setTip(d.tip))
  }, [id])

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/tips/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tip),
      })
      if (res.ok) {
        toast.success("Tip updated!")
        router.push("/admin/tips")
      } else {
        toast.error("Update failed")
      }
    } catch {
      toast.error("Update failed")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this tip?")) return
    await fetch(`/api/tips/${id}`, { method: "DELETE" })
    toast.success("Tip deleted")
    router.push("/admin/tips")
  }

  if (!tip) return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Tip</h1>
        <div className="flex gap-2">
          <button onClick={handleDelete} className="text-sm text-red-600 hover:text-red-800 font-medium border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50">
            Delete
          </button>
          <a href="/admin/tips" className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-xl border border-gray-200">← Back</a>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-5 text-sm">
          <p className="font-semibold text-gray-700">{tip.match?.homeTeam} vs {tip.match?.awayTeam}</p>
          <p className="text-gray-400">{tip.match?.league} · {tip.match?.kickoff ? new Date(tip.match.kickoff).toLocaleDateString() : ""}</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={tip.category}
                onChange={(e) => setTip({ ...tip, category: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
              >
                {TIP_CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Prediction</label>
              <input
                value={tip.prediction}
                onChange={(e) => setTip({ ...tip, prediction: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Odds</label>
              <input
                type="number" step="0.01"
                value={tip.odds ?? ""}
                onChange={(e) => setTip({ ...tip, odds: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confidence</label>
              <input
                type="number" min="1" max="100"
                value={tip.confidence}
                onChange={(e) => setTip({ ...tip, confidence: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
              />
            </div>
          </div>

          {/* Result */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Result</label>
            <select
              value={tip.result}
              onChange={(e) => setTip({ ...tip, result: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
            >
              {["PENDING", "WON", "LOST", "VOID"].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">AI Analysis</label>
            <textarea
              rows={4}
              value={tip.aiAnalysis ?? ""}
              onChange={(e) => setTip({ ...tip, aiAnalysis: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975] resize-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tip.vipOnly}
                onChange={(e) => setTip({ ...tip, vipOnly: e.target.checked })}
                className="w-4 h-4 accent-[#0C0975]"
              />
              <span className="text-sm font-medium text-gray-700">VIP Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!tip.publishedAt}
                onChange={(e) => setTip({ ...tip, publishedAt: e.target.checked ? new Date().toISOString() : null })}
                className="w-4 h-4 accent-[#0C0975]"
              />
              <span className="text-sm font-medium text-gray-700">Published</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0C0975] text-white font-bold py-3 rounded-xl hover:bg-[#1a1a8c] transition-colors disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}
