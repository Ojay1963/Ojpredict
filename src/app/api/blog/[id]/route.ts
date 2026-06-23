import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const post = await prisma.blogPost.update({
    where: { id: params.id },
    data: {
      ...body,
      publishedAt: body.published && !body.publishedAt ? new Date() : body.publishedAt,
    },
  })
  return NextResponse.json({ post })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await prisma.blogPost.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
