export const dynamic = 'force-dynamic'

import { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ojpredict.com"

const TIP_CATEGORIES = [
  "home-win", "away-win", "double-chance", "draw",
  "over-15", "over-25", "over-35", "btts", "ht-over-05",
  "sure-2-odds", "sure-3-odds", "sure-5-odds", "oj-banker",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${BASE_URL}/vip`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/winnings`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    ...TIP_CATEGORIES.map((cat) => ({
      url: `${BASE_URL}/tips/${cat}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ]

  let posts: { slug: string; updatedAt: Date }[] = []
  let matches: { id: string; updatedAt: Date }[] = []
  try {
    ;[posts, matches] = await Promise.all([
      prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.match.findMany({
        where: { kickoff: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        select: { id: true, updatedAt: true },
        take: 200,
      }),
    ])
  } catch {
    // DB not configured yet — return static pages only
  }

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const matchPages: MetadataRoute.Sitemap = matches.map((m) => ({
    url: `${BASE_URL}/match/${m.id}`,
    lastModified: m.updatedAt,
    changeFrequency: "hourly",
    priority: 0.7,
  }))

  return [...staticPages, ...blogPages, ...matchPages]
}
