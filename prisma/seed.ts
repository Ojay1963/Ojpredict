import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding OJ Predict database...")

  // Clear existing data (safe to re-run)
  await prisma.savedTip.deleteMany()
  await prisma.tips.deleteMany()
  await prisma.h2HRecord.deleteMany()
  await prisma.match.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.subscription.deleteMany()
  console.log("Cleared existing data")

  // Admin user (upsert — keeps existing if already there)
  const adminHash = await bcrypt.hash("Admin@OJPredict2026", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@ojpredict.com" },
    update: { passwordHash: adminHash, role: "ADMIN" },
    create: {
      email: "admin@ojpredict.com",
      name: "OJ Admin",
      passwordHash: adminHash,
      role: "ADMIN",
      subscription: { create: { plan: "OJ_INVESTMENT", status: "ACTIVE" } },
    },
  })
  // Re-create subscription if it was cleared above
  const existingSub = await prisma.subscription.findUnique({ where: { userId: admin.id } })
  if (!existingSub) {
    await prisma.subscription.create({
      data: { userId: admin.id, plan: "OJ_INVESTMENT", status: "ACTIVE" },
    })
  }
  console.log("Admin user ready:", admin.email)

  // Sample upcoming matches — use negative apiMatchIds so they never clash with real API data
  const matchData = [
    { apiMatchId: -1, homeTeam: "Arsenal", awayTeam: "Chelsea", league: "Premier League", country: "England", kickoff: new Date(Date.now() + 3 * 60 * 60 * 1000), homeTeamLogo: "https://media.api-sports.io/football/teams/42.png", awayTeamLogo: "https://media.api-sports.io/football/teams/49.png" },
    { apiMatchId: -2, homeTeam: "Barcelona", awayTeam: "Real Madrid", league: "La Liga", country: "Spain", kickoff: new Date(Date.now() + 6 * 60 * 60 * 1000), homeTeamLogo: "https://media.api-sports.io/football/teams/529.png", awayTeamLogo: "https://media.api-sports.io/football/teams/541.png" },
    { apiMatchId: -3, homeTeam: "Bayern Munich", awayTeam: "Dortmund", league: "Bundesliga", country: "Germany", kickoff: new Date(Date.now() + 8 * 60 * 60 * 1000) },
    { apiMatchId: -4, homeTeam: "PSG", awayTeam: "Marseille", league: "Ligue 1", country: "France", kickoff: new Date(Date.now() + 10 * 60 * 60 * 1000) },
    { apiMatchId: -5, homeTeam: "Man City", awayTeam: "Liverpool", league: "Premier League", country: "England", kickoff: new Date(Date.now() + 5 * 60 * 60 * 1000), homeTeamLogo: "https://media.api-sports.io/football/teams/50.png", awayTeamLogo: "https://media.api-sports.io/football/teams/40.png" },
  ]

  const createdMatches = []
  for (const m of matchData) {
    const match = await prisma.match.create({ data: { ...m, status: "UPCOMING" } })
    createdMatches.push(match)
  }
  console.log(`Created ${createdMatches.length} upcoming matches`)

  // Tips for upcoming matches
  const tipsData = [
    { matchIdx: 0, category: "OVER_25" as any, prediction: "Over 2.5 Goals", odds: 1.75, confidence: 82, aiAnalysis: "Arsenal and Chelsea have combined for 3+ goals in 7 of their last 10 H2H meetings. Both sides have free-scoring attacks in good form.", vipOnly: false },
    { matchIdx: 1, category: "BTTS" as any, prediction: "Both Teams to Score", odds: 1.65, confidence: 88, aiAnalysis: "El Clásico has seen both teams score in 9 of the last 11 editions. Barcelona and Real Madrid both have world-class attack and concede regularly in derbies.", vipOnly: false },
    { matchIdx: 2, category: "HOME_WIN" as any, prediction: "Bayern Munich Win", odds: 1.45, confidence: 78, aiAnalysis: "Bayern Munich are unbeaten at home in the Bundesliga this season and hold a strong H2H record against Dortmund.", vipOnly: false },
    { matchIdx: 3, category: "OVER_25" as any, prediction: "Over 2.5 Goals", odds: 1.80, confidence: 74, aiAnalysis: "Le Classique is historically high-scoring. Both PSG and Marseille have strong attacking units and the rivalry often produces entertaining matches.", vipOnly: true },
    { matchIdx: 4, category: "OJ_BANKER" as any, prediction: "BTTS & Over 2.5", odds: 2.10, confidence: 91, aiAnalysis: "The Premier League's biggest fixture. Man City and Liverpool have scored in every H2H since 2021. Both teams in excellent scoring form.", vipOnly: true },
  ]

  for (const t of tipsData) {
    await prisma.tips.create({
      data: {
        matchId: createdMatches[t.matchIdx].id,
        category: t.category,
        prediction: t.prediction,
        odds: t.odds,
        confidence: t.confidence,
        aiAnalysis: t.aiAnalysis,
        vipOnly: t.vipOnly,
        publishedAt: new Date(),
        result: "PENDING",
      },
    })
  }
  console.log(`Created ${tipsData.length} tips`)

  // Completed matches for winnings page
  const completedData = [
    { apiMatchId: -6, homeTeam: "Man Utd", awayTeam: "Tottenham", league: "Premier League", country: "England", kickoff: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), homeScore: 2, awayScore: 1, status: "FT" as any },
    { apiMatchId: -7, homeTeam: "Juventus", awayTeam: "AC Milan", league: "Serie A", country: "Italy", kickoff: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), homeScore: 1, awayScore: 1, status: "FT" as any },
    { apiMatchId: -8, homeTeam: "Atletico Madrid", awayTeam: "Sevilla", league: "La Liga", country: "Spain", kickoff: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), homeScore: 3, awayScore: 0, status: "FT" as any },
  ]

  const completedMatches = []
  for (const m of completedData) {
    const match = await prisma.match.create({ data: m })
    completedMatches.push(match)
  }

  await prisma.tips.createMany({
    data: [
      { matchId: completedMatches[0].id, category: "OVER_25", prediction: "Over 2.5 Goals", confidence: 80, result: "WON", publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { matchId: completedMatches[1].id, category: "BTTS", prediction: "Both Teams to Score", confidence: 75, result: "WON", publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { matchId: completedMatches[2].id, category: "HOME_WIN", prediction: "Atletico Madrid Win", confidence: 72, result: "WON", publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
    ],
  })
  console.log("Created completed matches and winnings data")

  // Sample blog post
  const existingPost = await prisma.blogPost.findUnique({ where: { slug: "top-5-football-betting-tips-weekend" } })
  if (!existingPost) {
    await prisma.blogPost.create({
      data: {
        title: "Top 5 Football Betting Tips for This Weekend",
        slug: "top-5-football-betting-tips-weekend",
        content: "<p>This weekend promises to be an exciting one for football fans and punters alike. Our AI analysis team at OJ Predict has identified 5 high-confidence tips for the weekend's fixtures...</p><h2>1. Arsenal to Win at Home</h2><p>Arsenal's home form this season has been exceptional, losing just once all season. With Chelsea visiting the Emirates, the Gunners are strong value.</p><h2>2. Over 2.5 Goals in El Clásico</h2><p>Barcelona vs Real Madrid is never a dull affair. Both teams average over 2 goals per game this season.</p>",
        excerpt: "Our AI team breaks down the best betting opportunities this weekend across the Premier League, La Liga, and more.",
        tags: ["Premier League", "Betting Tips", "Weekend Preview"],
        published: true,
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    })
  }

  console.log("\n✅ Seed complete!")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("Admin login: admin@ojpredict.com")
  console.log("Password:    Admin@OJPredict2026")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
