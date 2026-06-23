export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const tip = await prisma.tips.findUnique({
    where: { id: params.id },
    include: { match: true },
  })
  if (!tip) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ tip })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { category, prediction, odds, confidence, aiAnalysis, vipOnly, publishedAt, result } = body

  const tip = await prisma.tips.update({
    where: { id: params.id },
    data: {
      ...(category && { category }),
      ...(prediction && { prediction }),
      odds: odds !== undefined ? (odds ? parseFloat(odds) : null) : undefined,
      ...(confidence !== undefined && { confidence: parseInt(confidence) }),
      ...(aiAnalysis !== undefined && { aiAnalysis }),
      ...(vipOnly !== undefined && { vipOnly }),
      ...(publishedAt !== undefined && { publishedAt: publishedAt ? new Date(publishedAt) : null }),
      ...(result && { result }),
    },
  })

  return NextResponse.json({ tip })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await prisma.tips.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
