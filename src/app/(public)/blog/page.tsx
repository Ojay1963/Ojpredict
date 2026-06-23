export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Football Blog & News",
  description: "OJ Predict football news, betting guides, league previews and analysis.",
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
  })

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#0C0975] mb-2">Football Blog & News</h1>
        <p className="text-gray-500">League previews, betting guides, and football analysis from OJ Predict.</p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center">
          <div className="text-4xl mb-3">📰</div>
          <p className="text-gray-500">Blog articles coming soon. Check back shortly!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {post.coverImage ? (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[#0C0975] to-[#1a1a8c] flex items-center justify-center">
                    <span className="text-4xl">⚽</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-[#0C0975]/10 text-[#0C0975] text-xs font-medium px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-bold text-gray-900 mb-2 group-hover:text-[#0C0975] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{post.publishedAt ? formatDate(post.publishedAt) : ""}</span>
                    <span>{post.views} views</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
