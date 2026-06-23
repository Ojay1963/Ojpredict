export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date")
    const category = searchParams.get("category")
    const vipOnly = searchParams.get("vipOnly")

    const where: any = { publishedAt: { not: null } }

    if (date) {
      const d = new Date(date)
      d.setHours(0, 0, 0, 0)
      const next = new Date(d)
      next.setDate(next.getDate() + 1)
      where.match = { kickoff: { gte: d, lt: next } }
    }

    if (category) where.category = category
    if (vipOnly !== null) where.vipOnly = vipOnly === "true"

    const tips = await prisma.tips.findMany({
      where,
      include: { match: true },
      orderBy: [{ vipOnly: "asc" }, { confidence: "desc" }],
      take: 50,
    })

    return NextResponse.json({ tips })
  } catch (err) {
    console.error("[GET /api/tips]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { matchId, homeTeam, awayTeam, league, country, kickoff, category, prediction, odds, confidence, aiAnalysis, vipOnly, publishNow } = await req.json()

    if (!category || !prediction) {
      return NextResponse.json({ error: "category and prediction are required" }, { status: 400 })
    }

    // Resolve match: use existing matchId or create a new match on the fly
    let resolvedMatchId = matchId
    if (!resolvedMatchId) {
      if (!homeTeam || !awayTeam || !league || !kickoff) {
        return NextResponse.json({ error: "Provide either matchId or homeTeam, awayTeam, league, and kickoff" }, { status: 400 })
      }
      const newMatch = await prisma.match.create({
        data: {
          homeTeam,
          awayTeam,
          league,
          country: country ?? "Unknown",
          kickoff: new Date(kickoff),
          status: "UPCOMING",
        },
      })
      resolvedMatchId = newMatch.id
    }

    const tip = await prisma.tips.create({
      data: {
        matchId: resolvedMatchId,
        category,
        prediction,
        odds: odds ? parseFloat(odds) : null,
        confidence: parseInt(confidence ?? "70"),
        aiAnalysis: aiAnalysis ?? null,
        vipOnly: vipOnly ?? false,
        publishedAt: publishNow ? new Date() : null,
      },
    })

    return NextResponse.json({ tip }, { status: 201 })
  } catch (err) {
    console.error("[POST /api/tips]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
