"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, Lock, TrendingUp, ChevronRight } from "lucide-react"
import { cn, formatKickoff, getConfidenceBarColor, getConfidenceColor, getTipCategoryLabel, getResultBadgeStyle } from "@/lib/utils"
import type { TipWithMatch } from "@/types"

interface TipCardProps {
  tip: TipWithMatch
  isVIP?: boolean
  userIsVIP?: boolean
}

export function TipCard({ tip, isVIP, userIsVIP }: TipCardProps) {
  const isLocked = tip.vipOnly && !userIsVIP
  const isLive = tip.match.status === "LIVE"
  const isFT = tip.match.status === "FT"

  return (
    <div className={cn("tip-card card-hover", isLocked && "opacity-90")}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {tip.match.leagueLogo ? (
            <Image src={tip.match.leagueLogo} alt={tip.match.league} width={20} height={20} className="object-contain" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-primary-900 flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">⚽</span>
            </div>
          )}
          <span className="text-xs text-gray-500 font-medium">{tip.match.league} · {tip.match.country}</span>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full border", getResultBadgeStyle("LIVE"))}>
              LIVE {tip.match.homeScore}–{tip.match.awayScore}
            </span>
          )}
          {isFT && tip.result !== "PENDING" && (
            <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full border", getResultBadgeStyle(tip.result))}>
              {tip.result}
            </span>
          )}
          {tip.vipOnly && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#F4A500]/10 text-[#F4A500] border border-[#F4A500]/30">
              VIP
            </span>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between my-3">
        <div className="flex items-center gap-2 flex-1">
          {tip.match.homeTeamLogo ? (
            <Image src={tip.match.homeTeamLogo} alt={tip.match.homeTeam} width={32} height={32} className="object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
              {tip.match.homeTeam.slice(0, 2).toUpperCase()}
            </div>
          )}
          <span className="font-semibold text-gray-900 text-sm">{tip.match.homeTeam}</span>
        </div>

        <div className="text-center px-3">
          {isFT ? (
            <span className="text-lg font-black text-gray-900">
              {tip.match.homeScore}–{tip.match.awayScore}
            </span>
          ) : isLive ? (
            <span className="text-base font-black text-purple-700 animate-pulse">
              {tip.match.homeScore ?? 0}–{tip.match.awayScore ?? 0}
            </span>
          ) : (
            <div className="flex flex-col items-center">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 font-medium mt-0.5">
                {formatKickoff(tip.match.kickoff)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="font-semibold text-gray-900 text-sm text-right">{tip.match.awayTeam}</span>
          {tip.match.awayTeamLogo ? (
            <Image src={tip.match.awayTeamLogo} alt={tip.match.awayTeam} width={32} height={32} className="object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
              {tip.match.awayTeam.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Prediction */}
      <div className="border-t border-gray-100 pt-3">
        {isLocked ? (
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-[#0C0975]/5 to-[#F4A500]/5 rounded-lg border border-[#F4A500]/20">
            <Lock className="w-4 h-4 text-[#F4A500] flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-700">VIP Tip — Unlock to See Prediction</p>
              <Link href="/vip" className="text-xs text-[#0C0975] font-medium hover:underline">
                Upgrade to OJ Gold →
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  {getTipCategoryLabel(tip.category)}
                </span>
                <span className="font-bold text-[#0C0975]">{tip.prediction}</span>
                {tip.odds && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                    @{tip.odds}
                  </span>
                )}
              </div>
              <div className={cn("text-xs font-bold px-2 py-1 rounded-lg", getConfidenceColor(tip.confidence))}>
                {tip.confidence}% confidence
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
              <div
                className={cn("h-1.5 rounded-full transition-all", getConfidenceBarColor(tip.confidence))}
                style={{ width: `${tip.confidence}%` }}
              />
            </div>

            {/* AI Analysis */}
            {tip.aiAnalysis && (
              <p className="text-xs text-gray-600 leading-relaxed mt-2 flex items-start gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#0C0975] flex-shrink-0 mt-0.5" />
                {tip.aiAnalysis.length > 120 ? tip.aiAnalysis.slice(0, 120) + "..." : tip.aiAnalysis}
              </p>
            )}
          </>
        )}
      </div>

      {/* Footer Link */}
      {!isLocked && (
        <Link
          href={`/match/${tip.match.id}`}
          className="flex items-center justify-end gap-1 mt-3 text-xs text-[#0C0975] font-medium hover:underline"
        >
          Full Analysis <ChevronRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  )
}
