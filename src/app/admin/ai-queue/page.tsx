"use client"
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Sparkles, Check, X, Clock } from "lucide-react"

export default function AIQueuePage() {
  const [matches, setMatches] = useState<any[]>([])
  const [generating, setGenerating] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, any>>({})
  const [publishing, setPublishing] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/matches?upcoming=true")
      .then((r) => r.json())
      .then((d) => setMatches(d.matches ?? []))
  }, [])

  async function generateForMatch(matchId: string) {
    setGenerating(matchId)
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
      })
      const data = await res.json()
      if (data.result) {
        setResults((prev) => ({ ...prev, [matchId]: data.result }))
        toast.success("AI analysis generated!")
      } else {
        toast.error("AI generation failed")
      }
    } catch {
      toast.error("AI generation failed")
    } finally {
      setGenerating(null)
    }
  }

  async function publishAITip(matchId: string) {
    const result = results[matchId]
    if (!result) return
    setPublishing(matchId)
    try {
      const res = await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          category: result.tipCategory,
          prediction: result.prediction,
          confidence: result.confidence,
          aiAnalysis: result.analysis,
          publishNow: true,
        }),
      })
      if (res.ok) {
        toast.success("Tip published!")
        setResults((prev) => {
          const n = { ...prev }
          delete n[matchId]
          return n
        })
      } else {
        toast.error("Publish failed")
      }
    } catch {
      toast.error("Publish failed")
    } finally {
      setPublishing(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Suggestion Queue</h1>
        <p className="text-gray-500 text-sm mt-1">Generate and review AI tips before publishing</p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No upcoming matches found. Sync matches first.</p>
          <a href="/admin/matches" className="text-[#0C0975] font-semibold text-sm mt-2 inline-block hover:underline">
            Sync Matches →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => {
            const aiResult = results[match.id]
            return (
              <div key={match.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{match.homeTeam} vs {match.awayTeam}</p>
                    <p className="text-sm text-gray-400">{match.league} · {new Date(match.kickoff).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => generateForMatch(match.id)}
                    disabled={generating === match.id}
                    className="flex items-center gap-2 bg-purple-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-purple-700 disabled:opacity-50 text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    {generating === match.id ? "Generating..." : "Generate AI Tip"}
                  </button>
                </div>

                {aiResult && (
                  <div className="border border-purple-200 bg-purple-50 rounded-xl p-4 mt-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-bold text-purple-600 uppercase">AI Suggestion</span>
                        </div>
                        <p className="font-bold text-gray-900 text-lg mb-1">{aiResult.prediction}</p>
                        <p className="text-sm text-gray-600 mb-2">{aiResult.analysis}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded font-semibold">
                            {aiResult.tipCategory?.replace(/_/g, " ")}
                          </span>
                          <span className={`text-xs font-bold px-2 py-1 rounded ${aiResult.confidence >= 75 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {aiResult.confidence}% confidence
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => publishAITip(match.id)}
                          disabled={publishing === match.id}
                          className="flex items-center gap-1.5 bg-green-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-green-700 disabled:opacity-50 text-sm"
                        >
                          <Check className="w-4 h-4" />{publishing === match.id ? "Publishing..." : "Publish"}
                        </button>
                        <button
                          onClick={() => setResults((prev) => { const n = {...prev}; delete n[match.id]; return n })}
                          className="flex items-center gap-1.5 bg-red-50 text-red-600 font-semibold px-4 py-2 rounded-xl hover:bg-red-100 text-sm border border-red-200"
                        >
                          <X className="w-4 h-4" />Discard
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
