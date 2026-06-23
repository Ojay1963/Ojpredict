"use client"

import { useState } from "react"
import Link from "next/link"
import { Lock, CheckCircle2, XCircle, Clock } from "lucide-react"
import type { TipWithMatch } from "@/types"

interface Props {
  tips: TipWithMatch[]
  userIsVIP?: boolean
}

function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false })
}

function ResultBadge({ result, status, homeScore, awayScore }: {
  result: string
  status: string
  homeScore: number | null
  awayScore: number | null
}) {
  if (status === "LIVE") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full animate-pulse">
        LIVE {homeScore ?? 0}–{awayScore ?? 0}
      </span>
    )
  }
  if (status === "FT" && result === "WON") {
    return <CheckCircle2 className="w-5 h-5 text-green-500" />
  }
  if (status === "FT" && result === "LOST") {
    return <XCircle className="w-5 h-5 text-red-500" />
  }
  if (status === "FT") {
    return <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{homeScore}–{awayScore}</span>
  }
  return <span className="text-xs text-gray-400">—</span>
}

export function TipTableView({ tips, userIsVIP = false }: Props) {
  // Group tips by league
  const grouped = tips.reduce<Record<string, TipWithMatch[]>>((acc, tip) => {
    const key = tip.match.league
    if (!acc[key]) acc[key] = []
    acc[key].push(tip)
    return acc
  }, {})

  if (tips.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
        <div className="text-4xl mb-3">⚽</div>
        <p className="text-gray-500 font-medium">No tips available for this date.</p>
        <p className="text-gray-400 text-sm mt-1">Check back soon — tips are published daily.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([league, leagueTips]) => (
        <div key={league} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* League Header */}
          <div className="bg-[#0C0975] px-4 py-2.5 flex items-center gap-2">
            <span className="text-white font-bold text-sm">{league}</span>
            <span className="text-white/50 text-xs ml-auto">{leagueTips.length} tip{leagueTips.length > 1 ? "s" : ""}</span>
          </div>

          {/* Column Headers */}
          <div className="hidden md:grid grid-cols-[80px_1fr_160px_70px_80px] gap-3 px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <span>Time</span>
            <span>Match</span>
            <span>Prediction</span>
            <span className="text-center">Odds</span>
            <span className="text-center">Result</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {leagueTips.map((tip) => {
              const isLocked = tip.vipOnly && !userIsVIP

              return (
                <div key={tip.id} className="grid grid-cols-[70px_1fr_auto] md:grid-cols-[80px_1fr_160px_70px_80px] gap-3 px-4 py-3 items-center hover:bg-gray-50 transition-colors">

                  {/* Time */}
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    {formatTime(tip.match.kickoff)}
                  </div>

                  {/* Match */}
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">
                      {tip.match.homeTeam}
                      <span className="text-gray-400 font-normal mx-1.5">vs</span>
                      {tip.match.awayTeam}
                    </p>
                    {tip.vipOnly && (
                      <span className="text-[10px] font-bold text-[#F4A500] bg-[#F4A500]/10 px-1.5 py-0.5 rounded mt-0.5 inline-block">VIP</span>
                    )}
                  </div>

                  {/* Prediction */}
                  <div className="md:block">
                    {isLocked ? (
                      <Link href="/vip" className="flex items-center gap-1.5 text-xs text-[#F4A500] font-semibold hover:underline">
                        <Lock className="w-3.5 h-3.5" /> Unlock VIP
                      </Link>
                    ) : (
                      <div>
                        <span className="inline-block bg-[#0C0975]/10 text-[#0C0975] text-xs font-bold px-2.5 py-1 rounded-lg">
                          {tip.prediction}
                        </span>
                        {tip.aiAnalysis && (
                          <p className="text-[11px] text-gray-400 mt-1 leading-tight hidden md:block max-w-[200px] truncate">
                            {tip.aiAnalysis}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Odds */}
                  <div className="text-center hidden md:block">
                    {!isLocked && tip.odds ? (
                      <span className="text-sm font-bold text-gray-800">{tip.odds}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </div>

                  {/* Result */}
                  <div className="flex justify-center hidden md:flex">
                    <ResultBadge
                      result={tip.result}
                      status={tip.match.status}
                      homeScore={tip.match.homeScore}
                      awayScore={tip.match.awayScore}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
