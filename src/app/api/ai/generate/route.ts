import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateTipAnalysis } from "@/lib/ai"
import { format } from "date-fns"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { matchId } = await req.json()
  if (!matchId) return NextResponse.json({ error: "matchId required" }, { status: 400 })

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { h2h: { orderBy: { date: "desc" }, take: 10 } },
  })
  if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 })

  const h2hStr =
    match.h2h.length > 0
      ? match.h2h
          .map((h) => `${h.homeTeam} ${h.homeScore}–${h.awayScore} ${h.awayTeam}`)
          .join(", ")
      : "No H2H data available"

  try {
    const result = await generateTipAnalysis({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      league: match.league,
      kickoff: format(match.kickoff, "dd MMM yyyy HH:mm"),
      h2h: h2hStr,
      homeForm: "Unknown (no form data synced)",
      awayForm: "Unknown (no form data synced)",
    })

    return NextResponse.json({ result })
  } catch (err: any) {
    console.error("[POST /api/ai/generate]", err)
    return NextResponse.json({ error: err.message ?? "AI generation failed" }, { status: 500 })
  }
}
