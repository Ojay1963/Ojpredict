"use client"
export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const LEAGUES = [
  // International
  { name: "FIFA World Cup",          country: "World" },
  { name: "UEFA Euro",               country: "Europe" },
  { name: "Africa Cup of Nations",   country: "Africa" },
  { name: "Copa America",            country: "South America" },
  { name: "International Friendly",  country: "World" },
  // Top Club Leagues
  { name: "Premier League",          country: "England" },
  { name: "La Liga",                 country: "Spain" },
  { name: "Bundesliga",              country: "Germany" },
  { name: "Serie A",                 country: "Italy" },
  { name: "Ligue 1",                 country: "France" },
  { name: "Eredivisie",              country: "Netherlands" },
  { name: "Primeira Liga",           country: "Portugal" },
  // African & Nigerian
  { name: "NPFL",                    country: "Nigeria" },
  { name: "CAF Champions League",    country: "Africa" },
  { name: "AFCON Qualifiers",        country: "Africa" },
  // European Cups
  { name: "UEFA Champions League",   country: "Europe" },
  { name: "UEFA Europa League",      country: "Europe" },
  { name: "UEFA Conference League",  country: "Europe" },
  // Custom
  { name: "Other",                   country: "" },
]

export default function NewMatchPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedLeague, setSelectedLeague] = useState("")
  const [form, setForm] = useState({
    homeTeam: "",
    awayTeam: "",
    league: "",
    country: "",
    kickoff: "",
    venue: "",
  })

  function handleLeagueChange(name: string) {
    const found = LEAGUES.find((l) => l.name === name)
    setSelectedLeague(name)
    setForm((f) => ({
      ...f,
      league: name === "Other" ? "" : name,
      country: found?.country ?? "",
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.homeTeam || !form.awayTeam || !form.league || !form.kickoff) {
      toast.error("Please fill in all required fields")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success("Match added successfully!")
        router.push("/admin/matches")
      } else {
        const d = await res.json()
        toast.error(d.error ?? "Failed to add match")
      }
    } catch {
      toast.error("Failed to add match")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Match Manually</h1>
          <p className="text-gray-500 text-sm mt-1">Create a fixture without syncing from the API</p>
        </div>
        <a href="/admin/matches" className="text-sm text-gray-500 hover:text-gray-700">← Back to Matches</a>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* League */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">League / Competition *</label>
            <select
              required
              value={selectedLeague}
              onChange={(e) => handleLeagueChange(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
            >
              <option value="">Select a league...</option>
              <optgroup label="International">
                {LEAGUES.filter(l => ["World","Africa","Europe","South America"].includes(l.country) && l.name !== "UEFA Champions League" && l.name !== "UEFA Europa League" && l.name !== "UEFA Conference League").map(l => (
                  <option key={l.name} value={l.name}>{l.name}</option>
                ))}
              </optgroup>
              <optgroup label="Top Club Leagues">
                {["Premier League","La Liga","Bundesliga","Serie A","Ligue 1","Eredivisie","Primeira Liga"].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </optgroup>
              <optgroup label="Nigeria & Africa">
                {["NPFL","CAF Champions League","AFCON Qualifiers"].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </optgroup>
              <optgroup label="European Cups">
                {["UEFA Champions League","UEFA Europa League","UEFA Conference League"].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </optgroup>
              <optgroup label="Other">
                <option value="Other">Other (type custom name)</option>
              </optgroup>
            </select>
          </div>

          {/* Custom league name if "Other" selected */}
          {selectedLeague === "Other" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Custom League Name *</label>
              <input
                required
                value={form.league}
                onChange={(e) => setForm({ ...form, league: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
                placeholder="e.g. Saudi Pro League"
              />
            </div>
          )}

          {/* Teams */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Home Team *</label>
              <input
                required
                value={form.homeTeam}
                onChange={(e) => setForm({ ...form, homeTeam: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
                placeholder="e.g. Arsenal"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Away Team *</label>
              <input
                required
                value={form.awayTeam}
                onChange={(e) => setForm({ ...form, awayTeam: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
                placeholder="e.g. Chelsea"
              />
            </div>
          </div>

          {/* Kickoff */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kickoff Date & Time *</label>
              <input
                required
                type="datetime-local"
                value={form.kickoff}
                onChange={(e) => setForm({ ...form, kickoff: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
              <input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
                placeholder="Auto-filled from league"
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Venue <span className="font-normal text-gray-400">(optional)</span></label>
            <input
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C0975]"
              placeholder="e.g. Emirates Stadium, London"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0C0975] text-white font-bold py-3 rounded-xl hover:bg-[#1a1a8c] transition-colors disabled:opacity-60"
            >
              {loading ? "Adding Match..." : "Add Match"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/matches")}
              className="px-6 py-3 border border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
