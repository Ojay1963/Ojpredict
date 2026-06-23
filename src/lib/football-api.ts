import axios from "axios"

const footballApi = axios.create({
  baseURL: "https://api-football-v1.p.rapidapi.com/v3",
  headers: {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY ?? "",
    "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
  },
})

export async function getFixtures(date: string, leagueId?: number) {
  const params: Record<string, any> = { date, timezone: "Africa/Lagos" }
  if (leagueId) params.league = leagueId
  const { data } = await footballApi.get("/fixtures", { params })
  return data.response ?? []
}

export async function getLiveFixtures() {
  const { data } = await footballApi.get("/fixtures", {
    params: { live: "all" },
  })
  return data.response ?? []
}

export async function getFixtureById(fixtureId: number) {
  const { data } = await footballApi.get("/fixtures", {
    params: { id: fixtureId },
  })
  return data.response?.[0] ?? null
}

export async function getH2H(h2h: string) {
  const { data } = await footballApi.get("/fixtures/headtohead", {
    params: { h2h, last: 10 },
  })
  return data.response ?? []
}

export async function getTeamForm(teamId: number, leagueId: number, season: number) {
  const { data } = await footballApi.get("/teams/statistics", {
    params: { team: teamId, league: leagueId, season },
  })
  return data.response ?? null
}

export async function getStandings(leagueId: number, season: number) {
  const { data } = await footballApi.get("/standings", {
    params: { league: leagueId, season },
  })
  return data.response ?? []
}

export async function getOdds(fixtureId: number) {
  const { data } = await footballApi.get("/odds", {
    params: { fixture: fixtureId, bookmaker: 6 },
  })
  return data.response ?? []
}

export const TOP_LEAGUES = [
  { id: 39, name: "Premier League", country: "England" },
  { id: 140, name: "La Liga", country: "Spain" },
  { id: 78, name: "Bundesliga", country: "Germany" },
  { id: 135, name: "Serie A", country: "Italy" },
  { id: 61, name: "Ligue 1", country: "France" },
  { id: 2, name: "UEFA Champions League", country: "Europe" },
  { id: 3, name: "UEFA Europa League", country: "Europe" },
  { id: 332, name: "NPFL", country: "Nigeria" },
]
