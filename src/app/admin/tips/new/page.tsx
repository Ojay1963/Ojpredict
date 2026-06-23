"use client"
export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const LEAGUES = [
  "FIFA World Cup", "UEFA Euro", "Africa Cup of Nations", "Copa America", "International Friendly",
  "Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1", "Eredivisie", "Primeira Liga",
  "NPFL", "CAF Champions League", "AFCON Qualifiers",
  "UEFA Champions League", "UEFA Europa League", "UEFA Conference League",
  "Other",
]

const CATEGORIES = [
  { value: "HOME_WIN",      label: "Home Win" },
  { value: "AWAY_WIN",      label: "Away Win" },
  { value: "DOUBLE_CHANCE", label: "Double Chance" },
  { value: "DRAW",          label: "Draw" },
  { value: "OVER_15",       label: "Over 1.5 Goals" },
  { value: "OVER_25",       label: "Over 2.5 Goals" },
  { value: "OVER_35",       label: "Over 3.5 Goals" },
  { value: "BTTS",          label: "GG / Both Teams Score" },
  { value: "HT_OVER_05",   label: "HT Over 0.5 Goals" },
  { value: "SURE_2_ODDS",  label: "Sure 2 Odds" },
  { value: "OJ_BANKER",    label: "OJ Banker of the Day" },
]

export default function NewTipPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    homeTeam: "",
    awayTeam: "",
    league: "",
    customLeague: "",
    kickoff: "",
    category: "OVER_25",
    prediction: "",
    odds: "",
    confidence: "70",
    aiAnalysis: "",
    vipOnly: false,
    publishNow: true,
  })

  function set(field: string, value: any) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const league = form.league === "Other" ? form.customLeague : form.league
    if (!form.homeTeam || !form.awayTeam || !league || !form.kickoff) {
      toast.error("Please fill in all match details")
      return
    }
    if (!form.prediction) {
      toast.error("Please enter a prediction")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeTeam: form.homeTeam,
          awayTeam: form.awayTeam,
          league,
          kickoff: form.kickoff,
          category: form.category,
          prediction: form.prediction,
          odds: form.odds || null,
          confidence: form.confidence,
          aiAnalysis: form.aiAnalysis || null,
          vipOnly: form.vipOnly,
          publishNow: form.publishNow,
        }),
      })
      if (res.ok) {
        toast.success("Tip created!")
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

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Match Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Match Details</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Home Team *</label>
              <input
                required
                value={form.homeTeam}
                onChange={(e) => set("homeTeam", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
                placeholder="e.g. England"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Away Team *</label>
              <input
                required
                value={form.awayTeam}
                onChange={(e) => set("awayTeam", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
                placeholder="e.g. Ghana"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">League *</label>
              <select
                required
                value={form.league}
                onChange={(e) => set("league", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
              >
                <option value="">Select league...</option>
                {LEAGUES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kickoff Date & Time *</label>
              <input
                required
                type="datetime-local"
                value={form.kickoff}
                onChange={(e) => set("kickoff", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
              />
            </div>
          </div>

          {form.league === "Other" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Custom League Name *</label>
              <input
                required
                value={form.customLeague}
                onChange={(e) => set("customLeague", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
                placeholder="e.g. Saudi Pro League"
              />
            </div>
          )}
        </div>

        {/* Tip Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Tip Details</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Prediction *</label>
              <input
                required
                value={form.prediction}
                onChange={(e) => set("prediction", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
                placeholder="e.g. Over 2.5 Goals"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Odds</label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={form.odds}
                onChange={(e) => set("odds", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
                placeholder="e.g. 1.85"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confidence (1–100)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={form.confidence}
                onChange={(e) => set("confidence", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Analysis <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={form.aiAnalysis}
              onChange={(e) => set("aiAnalysis", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975] resize-none"
              placeholder="Why is this a good bet? Write your reasoning here..."
            />
          </div>
        </div>

        {/* Options */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-8">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.vipOnly}
              onChange={(e) => set("vipOnly", e.target.checked)}
              className="w-4 h-4 accent-[#F4A500]"
            />
            <span className="text-sm font-semibold text-gray-700">VIP Only</span>
            <span className="text-xs text-gray-400">(hide from free users)</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.publishNow}
              onChange={(e) => set("publishNow", e.target.checked)}
              className="w-4 h-4 accent-[#0C0975]"
            />
            <span className="text-sm font-semibold text-gray-700">Publish immediately</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0C0975] text-white font-bold py-3.5 rounded-xl hover:bg-[#1a1a8c] transition-colors disabled:opacity-60 text-base"
        >
          {loading ? "Creating Tip..." : "Create Tip"}
        </button>
      </form>
    </div>
  )
}
