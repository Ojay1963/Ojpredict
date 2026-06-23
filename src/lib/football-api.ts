import axios from "axios"

function getFootballApi() {
  return axios.create({
    baseURL: "https://api.football-data.org/v4",
    headers: {
      "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY ?? "",
    },
  })
}

// Competition codes used by football-data.org
export const TOP_LEAGUES = [
  { code: "PL",  name: "Premier League",        country: "England" },
  { code: "PD",  name: "La Liga",               country: "Spain" },
  { code: "BL1", name: "Bundesliga",            country: "Germany" },
  { code: "SA",  name: "Serie A",               country: "Italy" },
  { code: "FL1", name: "Ligue 1",               country: "France" },
  { code: "CL",  name: "UEFA Champions League", country: "Europe" },
  { code: "EL",  name: "UEFA Europa League",    country: "Europe" },
]

const LEAGUE_MAP = Object.fromEntries(TOP_LEAGUES.map((l) => [l.code, l]))

// One call returns all competitions for the given date
export async function getFixtures(date: string) {
  const { data } = await getFootballApi().get("/matches", {
    params: {
      dateFrom: date,
      dateTo: date,
      competitions: TOP_LEAGUES.map((l) => l.code).join(","),
    },
  })
  return (data.matches ?? []) as FootballDataMatch[]
}

export async function getLiveFixtures() {
  const { data } = await getFootballApi().get("/matches", {
    params: {
      status: "IN_PLAY,PAUSED",
      competitions: TOP_LEAGUES.map((l) => l.code).join(","),
    },
  })
  return (data.matches ?? []) as FootballDataMatch[]
}

export async function getFixtureById(matchId: number) {
  const { data } = await getFootballApi().get(`/matches/${matchId}`)
  return data as FootballDataMatch | null
}

export async function getStandings(competitionCode: string) {
  const { data } = await getFootballApi().get(`/competitions/${competitionCode}/standings`)
  return data.standings ?? []
}

export async function getTeamMatches(teamId: number, limit = 5) {
  const { data } = await getFootballApi().get(`/teams/${teamId}/matches`, {
    params: { status: "FINISHED", limit },
  })
  return data.matches ?? []
}

// Normalise football-data.org status → our DB enum
export function normaliseStatus(status: string): "UPCOMING" | "LIVE" | "FT" {
  if (status === "IN_PLAY" || status === "PAUSED") return "LIVE"
  if (status === "FINISHED") return "FT"
  return "UPCOMING"
}

export function getLeagueInfo(competitionCode: string) {
  return LEAGUE_MAP[competitionCode] ?? { name: competitionCode, country: "Unknown" }
}

// Types
export interface FootballDataMatch {
  id: number
  utcDate: string
  status: string
  venue: string | null
  competition: { id: number; name: string; code: string }
  homeTeam: { id: number; name: string; shortName: string; crest: string }
  awayTeam: { id: number; name: string; shortName: string; crest: string }
  score: {
    fullTime: { home: number | null; away: number | null }
    halfTime: { home: number | null; away: number | null }
  }
}
