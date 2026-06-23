import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getFixtures, TOP_LEAGUES } from "@/lib/football-api"
import { format } from "date-fns"

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const today = format(new Date(), "yyyy-MM-dd")
  let count = 0

  try {
    for (const league of TOP_LEAGUES.slice(0, 5)) {
      const fixtures = await getFixtures(today, league.id)

      for (const fixture of fixtures) {
        const f = fixture.fixture
        const teams = fixture.teams
        const goals = fixture.goals

        await prisma.match.upsert({
          where: { apiMatchId: f.id },
          update: {
            homeScore: goals.home ?? null,
            awayScore: goals.away ?? null,
            status:
              f.status.short === "1H" || f.status.short === "2H" || f.status.short === "HT"
                ? "LIVE"
                : f.status.short === "FT"
                ? "FT"
                : "UPCOMING",
          },
          create: {
            apiMatchId: f.id,
            homeTeam: teams.home.name,
            awayTeam: teams.away.name,
            homeTeamLogo: teams.home.logo,
            awayTeamLogo: teams.away.logo,
            league: league.name,
            country: league.country,
            kickoff: new Date(f.date),
            homeScore: goals.home ?? null,
            awayScore: goals.away ?? null,
            venue: f.venue?.name ?? null,
            status: f.status.short === "FT" ? "FT" : "UPCOMING",
          },
        })
        count++
      }
    }

    return NextResponse.json({ success: true, count })
  } catch (err: any) {
    console.error("[POST /api/matches/sync]", err)
    return NextResponse.json({ error: err.message ?? "Sync failed" }, { status: 500 })
  }
}
