import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface MatchContext {
  homeTeam: string
  awayTeam: string
  league: string
  kickoff: string
  h2h: string
  homeForm: string
  awayForm: string
  homeStanding?: string
  awayStanding?: string
}

export async function generateTipAnalysis(ctx: MatchContext): Promise<{
  prediction: string
  confidence: number
  analysis: string
  tipCategory: string
}> {
  const prompt = `You are OJ Predict's expert football analyst. Analyze this match and provide a betting tip.

Match: ${ctx.homeTeam} vs ${ctx.awayTeam}
League: ${ctx.league}
Kickoff: ${ctx.kickoff}

Head-to-Head (last 10): ${ctx.h2h}
${ctx.homeTeam} last 5 form: ${ctx.homeForm}
${ctx.awayTeam} last 5 form: ${ctx.awayForm}
${ctx.homeStanding ? `${ctx.homeTeam} league position: ${ctx.homeStanding}` : ""}
${ctx.awayStanding ? `${ctx.awayTeam} league position: ${ctx.awayStanding}` : ""}

Respond ONLY with valid JSON in this exact format:
{
  "prediction": "Over 2.5 Goals",
  "confidence": 78,
  "analysis": "2-3 sentence analysis explaining why this prediction is strong",
  "tipCategory": "OVER_25"
}

tipCategory must be one of: HOME_WIN, AWAY_WIN, DOUBLE_CHANCE, DRAW, OVER_15, OVER_25, OVER_35, BTTS, HT_OVER_05, SURE_2_ODDS, OJ_BANKER
confidence must be 1-100.`

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  })

  const text = message.content[0].type === "text" ? message.content[0].text : ""

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error("AI returned invalid JSON")

  return JSON.parse(jsonMatch[0])
}

export async function generateBulkAnalysis(matches: MatchContext[]) {
  const results = await Promise.allSettled(
    matches.map((m) => generateTipAnalysis(m))
  )
  return results.map((r, i) => ({
    match: matches[i],
    result: r.status === "fulfilled" ? r.value : null,
    error: r.status === "rejected" ? r.reason?.message : null,
  }))
}
