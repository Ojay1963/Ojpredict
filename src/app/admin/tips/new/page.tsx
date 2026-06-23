"use client"
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const TIP_CATEGORIES = [
  "HOME_WIN", "AWAY_WIN", "DOUBLE_CHANCE", "DRAW",
  "OVER_15", "OVER_25", "OVER_35", "BTTS", "HT_OVER_05",
  "SURE_2_ODDS", "SURE_3_ODDS", "SURE_5_ODDS", "OJ_BANKER",
]

export default function NewTipPage() {
  const router = useRouter()
  const [matches, setMatches] = useState<any[]>([])
  const [form, setForm] = useState({
    matchId: "",
    category: "OVER_25",
    prediction: "",
    odds: "",
    confidence: "70",
    aiAnalysis: "",
    vipOnly: false,
    publishNow: true,
  })
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetch("/api/matches").then((r) => r.json()).then((d) => setMatches(d.matches ?? []))
  }, [])

  async function generateAI() {
    if (!form.matchId) { toast.error("Select a match first"); return }
    setAiLoading(true)
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: form.matchId }),
      })
      const data = await res.json()
      if (data.result) {
        setForm((f) => ({
          ...f,
          category: data.result.tipCategory,
          prediction: data.result.prediction,
          confidence: String(data.result.confidence),
          aiAnalysis: data.result.analysis,
        }))
        toast.success("AI analysis generated!")
      } else {
        toast.error("AI generation failed")
      }
    } catch {
      toast.error("AI generation failed")
    } finally {
      setAiLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.matchId) { toast.error("Select a match"); return }
    setLoading(true)
    try {
      const res = await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success("Tip created successfully!")
        router.push("/admin/tips")
      } else {
        const d = await res.json()
        toast.error(d.error ?? "Failed to create tip")
      }
    } catch {
      toast.error("Failed to create tip")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Tip</h1>
        <a href="/admin/tips" className="text-sm text-gray-500 hover:text-gray-700">← Back to Tips</a>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Match Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Match *</label>
            <select
              required
              value={form.matchId}
              onChange={(e) => setForm({ ...form, matchId: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
            >
              <option value="">Select a match...</option>
              {matches.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.homeTeam} vs {m.awayTeam} — {m.league} — {new Date(m.kickoff).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {/* AI Generate Button */}
          <button
            type="button"
            onClick={generateAI}
            disabled={aiLoading || !form.matchId}
            className="w-full bg-purple-600 text-white font-semibold py-2.5 rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm"
          >
            {aiLoading ? "Generating AI Analysis..." : "✨ Generate AI Analysis"}
          </button>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
              >
                {TIP_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Prediction *</label>
              <input
                required
                value={form.prediction}
                onChange={(e) => setForm({ ...form, prediction: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
                placeholder="e.g. Over 2.5 Goals"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Odds</label>
              <input
                type="number"
                step="0.01"
                value={form.odds}
                onChange={(e) => setForm({ ...form, odds: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
                placeholder="e.g. 1.85"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confidence (1–100) *</label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={form.confidence}
                onChange={(e) => setForm({ ...form, confidence: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">AI Analysis</label>
            <textarea
              rows={4}
              value={form.aiAnalysis}
              onChange={(e) => setForm({ ...form, aiAnalysis: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975] resize-none"
              placeholder="AI-generated or manual analysis..."
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.vipOnly}
                onChange={(e) => setForm({ ...form, vipOnly: e.target.checked })}
                className="w-4 h-4 accent-[#0C0975]"
              />
              <span className="text-sm font-medium text-gray-700">VIP Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.publishNow}
                onChange={(e) => setForm({ ...form, publishNow: e.target.checked })}
                className="w-4 h-4 accent-[#0C0975]"
              />
              <span className="text-sm font-medium text-gray-700">Publish immediately</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0C0975] text-white font-bold py-3 rounded-xl hover:bg-[#1a1a8c] transition-colors disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Tip"}
          </button>
        </form>
      </div>
    </div>
  )
}
