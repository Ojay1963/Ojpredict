export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })
  if (!post) return { title: "Not Found" }
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDesc ?? post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
  })
  if (!post) notFound()

  // Increment views (fire-and-forget)
  prisma.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {})

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-[#0C0975]">Home</a>
        <span>/</span>
        <a href="/blog" className="hover:text-[#0C0975]">Blog</a>
        <span>/</span>
        <span className="text-[#0C0975] font-medium">{post.title}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span key={tag} className="bg-[#0C0975]/10 text-[#0C0975] text-xs font-semibold px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <h1 className="text-3xl md:text-4xl font-black text-[#0C0975] mb-3">{post.title}</h1>
      {post.excerpt && <p className="text-lg text-gray-600 mb-4">{post.excerpt}</p>}
      <p className="text-sm text-gray-400 mb-8">
        {post.publishedAt ? formatDate(post.publishedAt) : ""} · {post.views} views
      </p>

      {post.coverImage && (
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div
        className="prose prose-blue max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-12 p-6 bg-gradient-to-r from-[#0C0975] to-[#1a1a8c] rounded-2xl text-white text-center">
        <h3 className="text-xl font-bold mb-2">Get Today's Tips</h3>
        <p className="text-white/70 text-sm mb-4">View our AI-powered predictions for today's matches.</p>
        <a href="/" className="inline-block bg-[#F4A500] text-[#0C0975] font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition-colors">
          View Today's Tips
        </a>
      </div>
    </div>
  )
}
