import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyWebhookSignature, verifyTransaction } from "@/lib/paystack"
import { sendSubscriptionConfirmation } from "@/lib/email"
import { addDays, format } from "date-fns"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("x-paystack-signature") ?? ""

  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const event = JSON.parse(body)

  if (event.event === "charge.success") {
    const { reference, metadata } = event.data
    const { userId, plan } = metadata ?? {}

    if (!userId || !plan) {
      return NextResponse.json({ received: true })
    }

    try {
      const verification = await verifyTransaction(reference)
      if (verification.status !== "success") {
        return NextResponse.json({ received: true })
      }

      const endDate = addDays(new Date(), 30)

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          plan,
          status: "ACTIVE",
          startDate: new Date(),
          endDate,
          paystackRef: reference,
          autoRenew: true,
        },
        update: {
          plan,
          status: "ACTIVE",
          startDate: new Date(),
          endDate,
          paystackRef: reference,
        },
      })

      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (user) {
        sendSubscriptionConfirmation(
          user.email!,
          user.name ?? "Subscriber",
          plan.replace("_", " "),
          format(endDate, "dd MMM yyyy")
        ).catch(() => {})
      }
    } catch (err) {
      console.error("[Paystack webhook]", err)
    }
  }

  if (event.event === "subscription.disable" || event.event === "charge.failed") {
    const { metadata } = event.data ?? {}
    const userId = metadata?.userId
    if (userId) {
      await prisma.subscription.updateMany({
        where: { userId },
        data: { status: "EXPIRED" },
      }).catch(() => {})
    }
  }

  return NextResponse.json({ received: true })
}
