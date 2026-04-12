import { ref, computed } from 'vue'
import apiService from '@/services/apiService.js'

// ── State ─────────────────────────────────────────────────────────────────────
export const players = ref([])   // [{ name, gpEarned, itemsReceived, ... }]
export const connected = ref(false)
export const loading = ref(true)

let statsSource = null

// ── Helpers ───────────────────────────────────────────────────────────────────
function applyTeamStats(teamStats) {
    const team = teamStats[0]
    if (!team) return

    team.players.forEach(p => {
        const existing = players.value.find(x => x.name.toLowerCase() === p.name.toLowerCase())
        if (existing) {
            existing.gpEarned = p.totalValue
            existing.itemsReceived = p.totalDrops
            existing.levelsEarned = p.totalLevelsEarned
            existing.deaths = p.totalDeaths
            existing.combatTasks = p.totalCombatTasks
            existing.clueScrolls = p.totalClues
            existing.clogsEarned = p.totalClogs
            existing.petsEarned = p.totalPets
            existing.killCount = p.totalKillCount
            existing.leagueTasks = p.totalLeagueTasks
            existing.leaguePoints = p.totalLeaguePoints
        } else {
            players.value.push({
                name: p.name,
                gpEarned: p.totalValue,
                itemsReceived: p.totalDrops,
                levelsEarned: p.totalLevelsEarned,
                petsEarned: p.totalPets,
                deaths: p.totalDeaths,
                clogsEarned: p.totalClogs,
                combatTasks: p.totalCombatTasks,
                clueScrolls: p.totalClues,
                killCount: p.totalKillCount,
                leagueTasks: p.totalLeagueTasks,
                leaguePoints: p.totalLeaguePoints,
            })
        }
    })
}

// ── Initialise ────────────────────────────────────────────────────────────────
export async function initStats() {
    // 1. Load full player list first so we have names even before stats arrive
    try {
        const data = await apiService.getTeams()
        const team = data.teams?.[0]
        if (team) {
            players.value = team.players.map(p => ({
                name: p.name,
                gpEarned: 0,
                itemsReceived: 0,
                levelsEarned: 0,
                petsEarned: 0,
                deaths: 0,
                clogsEarned: 0,
                combatTasks: 0,
                clueScrolls: 0,
                killCount: 0,
                leagueTasks: 0,
                leaguePoints: 0,
                rank: 'Member',
            }))
        }
    } catch (e) {
        console.warn('Could not load teams, will populate from stream:', e)
    }

    // 2. Open stats SSE stream
    statsSource = apiService.getStatsStream()

    statsSource.addEventListener('history', (e) => {
        try {
            const { teamStats } = JSON.parse(e.data)
            applyTeamStats(teamStats)
            loading.value = false
            connected.value = true
        } catch { /* ignore malformed */ }
    })

    statsSource.addEventListener('stats', (e) => {
        try {
            const { teamStats } = JSON.parse(e.data)
            applyTeamStats(teamStats)
            loading.value = false
            connected.value = true
        } catch { /* ignore malformed */ }
    })

    statsSource.onopen = () => {
        connected.value = true
    }

    statsSource.onerror = () => {
        connected.value = false
        console.warn('Stats stream disconnected')
    }
}

export function closeStats() {
    statsSource?.close()
    statsSource = null
}

// ── Derived totals (used by Milestones) ───────────────────────────────────────
export const clanTotals = computed(() => ({
    gpEarned: players.value.reduce((s, p) => s + p.gpEarned, 0),
    itemsReceived: players.value.reduce((s, p) => s + p.itemsReceived, 0),
    levelsEarned: players.value.reduce((s, p) => s + p.levelsEarned, 0),
    petsEarned: players.value.reduce((s, p) => s + p.petsEarned, 0),
    deaths: players.value.reduce((s, p) => s + p.deaths, 0),
    clogsEarned: players.value.reduce((s, p) => s + p.clogsEarned, 0),
    combatTasks: players.value.reduce((s, p) => s + p.combatTasks, 0),
    clueScrolls: players.value.reduce((s, p) => s + p.clueScrolls, 0),
}))