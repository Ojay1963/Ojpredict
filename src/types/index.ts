export interface TipWithMatch {
  id: string
  category: string
  prediction: string
  odds?: number | null
  confidence: number
  aiAnalysis?: string | null
  result: string
  vipOnly: boolean
  publishedAt?: Date | null
  match: {
    id: string
    homeTeam: string
    awayTeam: string
    homeTeamLogo?: string | null
    awayTeamLogo?: string | null
    league: string
    leagueLogo?: string | null
    country: string
    kickoff: Date
    homeScore?: number | null
    awayScore?: number | null
    status: string
  }
}

export interface BlogPostSummary {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  coverImage?: string | null
  publishedAt?: Date | null
  tags: string[]
  views: number
}

export interface AdminStats {
  totalTips: number
  wonTips: number
  lostTips: number
  pendingTips: number
  accuracy: number
  totalUsers: number
  vipUsers: number
  totalRevenue: number
}

export interface VIPPlan {
  id: "OJ_GOLD" | "OJ_INVESTMENT"
  name: string
  price: number
  priceLabel: string
  description: string
  features: string[]
  popular?: boolean
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }
}
