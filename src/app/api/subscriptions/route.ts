export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { initializeTransaction, generateReference, PLANS } from "@/lib/paystack"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { plan } = await req.json()
  if (!plan || !PLANS[plan as keyof typeof PLANS]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const reference = generateReference("SUB")
  const planData = PLANS[plan as keyof typeof PLANS]

  try {
    const transaction = await initializeTransaction({
      email: user.email!,
      amount: planData.amount,
      reference,
      metadata: {
        userId: user.id,
        plan,
        custom_fields: [
          { display_name: "Plan", variable_name: "plan", value: plan },
          { display_name: "User ID", variable_name: "userId", value: user.id },
        ],
      },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?ref=${reference}`,
    })

    return NextResponse.json({ authorizationUrl: transaction.authorization_url, reference })
  } catch (err: any) {
    console.error("[POST /api/subscriptions]", err)
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 })
  }
}
