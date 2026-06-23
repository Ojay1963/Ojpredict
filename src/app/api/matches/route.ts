export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
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
