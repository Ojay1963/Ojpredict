export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [total, won, lost, pending, users, vip] = await Promise.all([
    prisma.tips.count(),
    prisma.tips.count({ where: { result: "WON" } }),
    prisma.tips.count({ where: { result: "LOST" } }),
    prisma.tips.count({ where: { result: "PENDING" } }),
    prisma.user.count(),
    prisma.subscription.count({ where: { status: "ACTIVE", plan: { not: "FREE" } } }),
  ])

  const completed = won + lost
  return NextResponse.json({
    totalTips: total,
    wonTips: won,
    lostTips: lost,
    pendingTips: pending,
    accuracy: completed > 0 ? Math.round((won / completed) * 100) : 0,
    totalUsers: users,
    vipUsers: vip,
  })
}
