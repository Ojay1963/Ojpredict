import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const published = searchParams.get("published")

  const where: any = {}
  if (published === "true") where.published = true

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return NextResponse.json({ posts })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, slug, content, excerpt, coverImage, tags, seoTitle, seoDesc, published } = await req.json()

  const finalSlug = slug || slugify(title)

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug: finalSlug,
      content,
      excerpt: excerpt ?? null,
      coverImage: coverImage ?? null,
      tags: tags ?? [],
      seoTitle: seoTitle ?? null,
      seoDesc: seoDesc ?? null,
      published: published ?? false,
      publishedAt: published ? new Date() : null,
    },
  })

  return NextResponse.json({ post }, { status: 201 })
}
