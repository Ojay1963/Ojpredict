"use client"

import { useState, useEffect } from "react"
import { TipTableView } from "./TipTableView"
import type { TipWithMatch } from "@/types"

const TABS = [
  { label: "Yesterday", offset: -1 },
  { label: "Today",     offset: 0 },
  { label: "Tomorrow",  offset: 1 },
]

function getDateWithOffset(offset: number) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().split("T")[0]
}

interface Props {
  initialTips: TipWithMatch[]
  userIsVIP?: boolean
}

export function TipsSection({ initialTips, userIsVIP = false }: Props) {
  const [activeTab, setActiveTab] = useState(1) // default: Today
  const [tips, setTips] = useState<TipWithMatch[]>(initialTips)
  const [loading, setLoading] = useState(false)

  async function fetchTips(offset: number) {
    setLoading(true)
    try {
      const date = getDateWithOffset(offset)
      const res = await fetch(`/api/tips?date=${date}`)
      const data = await res.json()
      setTips(data.tips ?? [])
    } catch {
      setTips([])
    } finally {
      setLoading(false)
    }
  }

  function handleTab(index: number) {
    setActiveTab(index)
    if (index === 1) {
      setTips(initialTips) // use server-rendered data for Today
    } else {
      fetchTips(TABS[index].offset)
    }
  }

  return (
    <div>
      {/* Date Tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-5 shadow-sm">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => handleTab(i)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === i
                ? "bg-[#0C0975] text-white shadow"
                : "text-gray-500 hover:text-[#0C0975]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-10 bg-gray-200" />
              <div className="p-4 space-y-3">
                {[1, 2].map((j) => <div key={j} className="h-8 bg-gray-100 rounded" />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <TipTableView tips={tips} userIsVIP={userIsVIP} />
      )}
    </div>
  )
}
