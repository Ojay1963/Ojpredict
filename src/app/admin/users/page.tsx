export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Crown } from "lucide-react"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { subscription: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users ({users.length})</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-gray-500 font-semibold">User</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold">Email</th>
                <th className="px-4 py-3 text-center text-gray-500 font-semibold">Role</th>
                <th className="px-4 py-3 text-center text-gray-500 font-semibold">Plan</th>
                <th className="px-4 py-3 text-center text-gray-500 font-semibold">Sub Status</th>
                <th className="px-4 py-3 text-left text-gray-500 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isVIP = user.subscription?.plan !== "FREE" && user.subscription?.status === "ACTIVE"
                return (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#0C0975] flex items-center justify-center text-white text-xs font-bold">
                          {user.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <span className="font-medium text-gray-900">{user.name ?? "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{user.email}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isVIP ? (
                        <span className="flex items-center gap-1 justify-center text-xs font-bold text-[#F4A500]">
                          <Crown className="w-3 h-3" />{user.subscription?.plan?.replace("_", " ")}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Free</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {user.subscription ? (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${user.subscription.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {user.subscription.status}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(user.createdAt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
