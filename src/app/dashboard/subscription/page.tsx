export const dynamic = 'force-dynamic'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Crown, Check, Calendar, RefreshCw } from "lucide-react"

export default async function SubscriptionPage({ searchParams }: { searchParams: { ref?: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  })

  const sub = user?.subscription
  const isVIP = sub?.plan !== "FREE" && sub?.status === "ACTIVE"

  return (
    <div className="space-y-6">
      {searchParams.ref && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-semibold">Payment successful! Your subscription is now active.</p>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-[#0C0975]">Subscription</h1>
        <p className="text-gray-500 text-sm">Manage your OJ Predict VIP membership</p>
      </div>

      {/* Current Plan */}
      <div className={`rounded-xl p-6 border ${isVIP ? "bg-gradient-to-r from-[#0C0975] to-[#1a1a8c] text-white border-transparent" : "bg-white border-gray-200"}`}>
        <div className="flex items-center gap-3 mb-4">
          <Crown className={`w-6 h-6 ${isVIP ? "text-[#F4A500]" : "text-gray-400"}`} />
          <h2 className={`text-xl font-bold ${isVIP ? "text-white" : "text-gray-900"}`}>
            {sub ? sub.plan.replace("_", " ") : "Free Plan"}
          </h2>
        </div>

        {sub && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${sub.status === "ACTIVE" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                {sub.status}
              </span>
            </div>
            {sub.startDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className={`w-4 h-4 ${isVIP ? "text-white/60" : "text-gray-400"}`} />
                <span className={isVIP ? "text-white/80" : "text-gray-600"}>
                  Started: {formatDate(sub.startDate)}
                </span>
              </div>
            )}
            {sub.endDate && (
              <div className="flex items-center gap-2 text-sm">
                <RefreshCw className={`w-4 h-4 ${isVIP ? "text-white/60" : "text-gray-400"}`} />
                <span className={isVIP ? "text-white/80" : "text-gray-600"}>
                  Renews: {formatDate(sub.endDate)}
                </span>
              </div>
            )}
          </div>
        )}

        {!isVIP && (
          <Link
            href="/vip"
            className="inline-block mt-4 bg-[#0C0975] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1a1a8c] transition-colors"
          >
            Upgrade to VIP
          </Link>
        )}
      </div>

      {/* Available Plans */}
      {!isVIP && (
        <div>
          <h2 className="text-lg font-bold text-[#0C0975] mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "OJ_GOLD", name: "OJ Gold Plan", price: "₦3,000/month", features: ["5–10 odds accumulators", "Daily AI tips", "Telegram alerts"] },
              { id: "OJ_INVESTMENT", name: "OJ Investment Tip", price: "₦5,000/month", features: ["1.60–2.00 safe bankers", "Highest confidence tips", "Priority alerts"] },
            ].map((plan) => (
              <div key={plan.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-[#0C0975] mb-1">{plan.name}</h3>
                <p className="text-2xl font-black text-[#0C0975] mb-3">{plan.price}</p>
                <ul className="space-y-1 mb-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-3.5 h-3.5 text-green-500" />{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/vip`}
                  className="block text-center bg-[#0C0975] text-white font-bold py-2.5 rounded-xl hover:bg-[#1a1a8c] transition-colors text-sm"
                >
                  Subscribe Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
