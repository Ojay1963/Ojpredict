export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const upcoming = searchParams.get("upcoming") === "true"
  const limit = parseInt(searchParams.get("limit") ?? "50")

  const where: any = {}
  if (upcoming) {
    where.status = "UPCOMING"
    where.kickoff = { gte: new Date() }
  }

  const matches = await prisma.match.findMany({
    where,
    include: { _count: { select: { tips: true } } },
    orderBy: { kickoff: "asc" },
    take: limit,
  })

  return NextResponse.json({ matches })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { homeTeam, awayTeam, league, country, kickoff, venue } = body

  if (!homeTeam || !awayTeam || !league || !kickoff) {
    return NextResponse.json({ error: "homeTeam, awayTeam, league and kickoff are required" }, { status: 400 })
  }

  const match = await prisma.match.create({
    data: {
      homeTeam,
      awayTeam,
      league,
      country: country ?? "Unknown",
      kickoff: new Date(kickoff),
      venue: venue ?? null,
      status: "UPCOMING",
    },
  })

  return NextResponse.json({ match }, { status: 201 })
}
