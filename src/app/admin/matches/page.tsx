"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  async function loadMatches() {
    setLoading(true)
    try {
      const res = await fetch("/api/matches?limit=50")
      const data = await res.json()
      setMatches(data.matches ?? [])
    } finally {
      setLoading(false)
    }
  }

  async function syncMatches() {
    setSyncing(true)
    try {
      const res = await fetch("/api/matches/sync", { method: "POST" })
      const data = await res.json()
      toast.success(`Synced ${data.count ?? 0} matches from API-Football`)
      await loadMatches()
    } catch {
      toast.error("Sync failed")
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => { loadMatches() }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Matches</h1>
          <p className="text-gray-500 text-sm">Manage fixtures and sync from API-Football</p>
        </div>
        <button
          onClick={syncMatches}
          disabled={syncing}
          className="flex items-center gap-2 bg-teal-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-700 disabled:opacity-60 text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync Matches"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">Match</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">League</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">Kickoff</th>
                  <th className="px-4 py-3 text-center text-gray-500 font-semibold">Status</th>
                  <th className="px-4 py-3 text-center text-gray-500 font-semibold">Score</th>
                  <th className="px-4 py-3 text-center text-gray-500 font-semibold">Tips</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{m.homeTeam} vs {m.awayTeam}</td>
                    <td className="px-4 py-3 text-gray-500">{m.league}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDateTime(m.kickoff)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.status === "LIVE" ? "bg-green-100 text-green-700" : m.status === "FT" ? "bg-gray-100 text-gray-700" : "bg-blue-100 text-blue-700"}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-gray-900">
                      {m.homeScore !== null && m.awayScore !== null ? `${m.homeScore}–${m.awayScore}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500">{m._count?.tips ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
