import axios from "axios"
import crypto from "crypto"

function getPaystackApi() {
  return axios.create({
    baseURL: "https://api.paystack.co",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  })
}

export const PLANS = {
  OJ_GOLD: {
    name: "OJ Gold Plan",
    amount: 300000, // N3,000 in kobo
    interval: "monthly",
    description: "5–10 odds accumulator tips daily",
  },
  OJ_INVESTMENT: {
    name: "OJ Investment Tip",
    amount: 500000, // N5,000 in kobo
    interval: "monthly",
    description: "1.60–2.00 odds safe banker tips",
  },
}

export async function initializeTransaction(params: {
  email: string
  amount: number
  reference: string
  metadata?: Record<string, any>
  callback_url?: string
}) {
  const { data } = await getPaystackApi().post("/transaction/initialize", params)
  return data.data
}

export async function verifyTransaction(reference: string) {
  const { data } = await getPaystackApi().get(`/transaction/verify/${reference}`)
  return data.data
}

export async function createSubscriptionPlan(plan: keyof typeof PLANS) {
  const p = PLANS[plan]
  const { data } = await getPaystackApi().post("/plan", {
    name: p.name,
    interval: p.interval,
    amount: p.amount,
  })
  return data.data
}

export function verifyWebhookSignature(payload: string, signature: string) {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY ?? "")
    .update(payload)
    .digest("hex")
  return hash === signature
}

export function generateReference(prefix = "OJP") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`
}
