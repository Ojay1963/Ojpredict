import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })
}

// Lazy proxy: PrismaClient is only instantiated on first property access (i.e. first query),
// never at import time — this prevents build-time DB connection errors on Vercel.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createClient()
    }
    const value = (globalForPrisma.prisma as any)[prop]
    if (typeof value === "function") {
      return (...args: any[]) => (value as Function).apply(globalForPrisma.prisma, args)
    }
    return value
  },
})
