export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <Link href="/admin/blog/new" className="bg-[#0C0975] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1a1a8c] text-sm">
          + New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-gray-500 font-semibold">Title</th>
              <th className="px-4 py-3 text-left text-gray-500 font-semibold">Tags</th>
              <th className="px-4 py-3 text-center text-gray-500 font-semibold">Status</th>
              <th className="px-4 py-3 text-center text-gray-500 font-semibold">Views</th>
              <th className="px-4 py-3 text-left text-gray-500 font-semibold">Date</th>
              <th className="px-4 py-3 text-center text-gray-500 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{post.title}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${post.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-gray-500">{post.views}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(post.createdAt)}</td>
                <td className="px-4 py-3 text-center">
                  <Link href={`/admin/blog/${post.id}`} className="text-[#0C0975] hover:underline text-xs font-medium">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
