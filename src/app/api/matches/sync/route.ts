export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getFixtures, normaliseStatus, getLeagueInfo } from "@/lib/football-api"
import { format } from "date-fns"

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const today = format(new Date(), "yyyy-MM-dd")

  try {
    const fixtures = await getFixtures(today)
    let count = 0

    for (const match of fixtures) {
      const league = getLeagueInfo(match.competition.code)

      await prisma.match.upsert({
        where: { apiMatchId: match.id },
        update: {
          homeScore: match.score.fullTime.home ?? null,
          awayScore: match.score.fullTime.away ?? null,
          status: normaliseStatus(match.status),
        },
        create: {
          apiMatchId: match.id,
          homeTeam: match.homeTeam.shortName ?? match.homeTeam.name,
          awayTeam: match.awayTeam.shortName ?? match.awayTeam.name,
          homeTeamLogo: match.homeTeam.crest ?? null,
          awayTeamLogo: match.awayTeam.crest ?? null,
          league: league.name,
          country: league.country,
          kickoff: new Date(match.utcDate),
          homeScore: match.score.fullTime.home ?? null,
          awayScore: match.score.fullTime.away ?? null,
          venue: match.venue ?? null,
          status: normaliseStatus(match.status),
        },
      })
      count++
    }

    return NextResponse.json({ success: true, count })
  } catch (err: any) {
    console.error("[POST /api/matches/sync]", err)
    return NextResponse.json({ error: err.message ?? "Sync failed" }, { status: 500 })
  }
}
