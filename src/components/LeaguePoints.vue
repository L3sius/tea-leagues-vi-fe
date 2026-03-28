<template>
    <section class="league-points-section">
        <div class="section-header">
            <h2 class="section-title">League Points</h2>
            <p class="section-subtitle">Hiscores</p>
        </div>

        <div class="lp-table panel">
            <div class="lp-header-row">
                <span class="col-name">Player</span>
                <div class="col-rank-group">
                    <span class="rank-group-label">Rank</span>
                    <div class="rank-subheads">
                        <span class="col-rank">Tea</span>
                        <span class="col-lp-rank">OSRS</span>
                    </div>
                </div>
                <span class="col-points">Points</span>
            </div>

            <div v-for="(player, idx) in sortedPlayers" :key="player.name" class="lp-row" :class="[
                getRank(player.leaguePoints)?.cls,
                { 'lp-row--error': player.error },
            ]">
                <span class="col-name lp-name">{{ player.name }}</span>
                <span class="col-rank lp-pos">{{ idx + 1 }}</span>
                <span class="col-lp-rank lp-lp-rank">
                    <template v-if="player.loading">—</template>
                    <template v-else-if="player.error">—</template>
                    <template v-else>{{ player.leagueRank.toLocaleString() }}</template>
                </span>
                <span class="col-points lp-points">
                    <span v-if="player.loading" class="loading-dots">···</span>
                    <span v-else-if="player.error" class="error-text" :title="player.error">N/A</span>
                    <template v-else>{{ player.leaguePoints.toLocaleString() }}</template>
                </span>
            </div>

            <div v-if="showCorsNotice" class="cors-notice">
                ⚠ CORS blocked — add a proxy in vite.config.js to fetch live data.
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import apiService from '@/services/apiService.js'

const LEAGUE_POINTS_LINE = 25
const POLL_INTERVAL_MS = 10 * 60 * 1000 // 10 minutes

const RANK_TIERS = [
    { min: 60000, name: 'Dragon', cls: 'rank-dragon' },
    { min: 45000, name: 'Rune', cls: 'rank-rune' },
    { min: 30000, name: 'Adamant', cls: 'rank-adamant' },
    { min: 20000, name: 'Mithril', cls: 'rank-mithril' },
    { min: 10000, name: 'Steel', cls: 'rank-steel' },
    { min: 4000, name: 'Iron', cls: 'rank-iron' },
    { min: 2000, name: 'Bronze', cls: 'rank-bronze' },
]

function getRank(points) {
    return RANK_TIERS.find(t => points >= t.min) ?? null
}

// Temporary fake players to verify rank colours — remove when live data is wired up
const players = ref([
    { name: 'DragonTest', leaguePoints: 65000, leagueRank: 42, loading: false, error: null },
    { name: 'RuneTest', leaguePoints: 50000, leagueRank: 310, loading: false, error: null },
    { name: 'AdamantTest', leaguePoints: 35000, leagueRank: 1200, loading: false, error: null },
    { name: 'MithrilTest', leaguePoints: 22000, leagueRank: 4500, loading: false, error: null },
    { name: 'SteelTest', leaguePoints: 12000, leagueRank: 9800, loading: false, error: null },
    { name: 'IronTest', leaguePoints: 5000, leagueRank: 18000, loading: false, error: null },
    { name: 'BronzeTest', leaguePoints: 2500, leagueRank: 35000, loading: false, error: null },
    { name: 'NoRankTest', leaguePoints: 800, leagueRank: 60000, loading: false, error: null },
])

const showCorsNotice = ref(false)
let pollTimer = null

const sortedPlayers = computed(() =>
    [...players.value].sort((a, b) => {
        if (a.error && !b.error) return 1
        if (!a.error && b.error) return -1
        return b.leaguePoints - a.leaguePoints
    })
)

async function fetchPlayer(playerRef) {
    try {
        // const res = await fetch(`/api/hiscores?player=${encodeURIComponent(playerRef.name)}`)
        // if (!res.ok) throw new Error(`HTTP ${res.status}`)
        // const text = await res.text()
        // const lines = text.trim().split('\n')
        // const lpLine = lines[LEAGUE_POINTS_LINE]
        // if (!lpLine) throw new Error('Unexpected response format')
        // const [rank, score] = lpLine.split(',').map(Number)
        // playerRef.leagueRank = rank === -1 ? 0 : rank
        // playerRef.leaguePoints = rank === -1 ? 0 : score
        // playerRef.loading = false
    } catch (err) {
        playerRef.loading = false
        if (err instanceof TypeError) {
            playerRef.error = 'CORS / network error'
            showCorsNotice.value = true
        } else {
            playerRef.error = err.message
        }
    }
}

async function loadAll() {
    const { teams } = await apiService.getTeams()
    const names = teams.flatMap(t => t.players).map(p => p.name)

    players.value = names.map(name => ({
        name,
        leagueRank: 0,
        leaguePoints: 0,
        loading: true,
        error: null,
    }))
    showCorsNotice.value = false

    for (const p of players.value) {
        await fetchPlayer(p)
    }
}

onMounted(() => {
    // loadAll()
    // pollTimer = setInterval(loadAll, POLL_INTERVAL_MS)
})

onUnmounted(() => clearInterval(pollTimer))
</script>

<style scoped>
.league-points-section {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.section-header {
    display: flex;
    align-items: baseline;
    gap: 12px;
}

.section-title {
    font-family: var(--font-heading);
    font-size: 29px;
    font-weight: 700;
    color: var(--soul-gold);
    letter-spacing: 2px;
    text-shadow: 0 0 12px rgba(255, 179, 71, 0.4);
}

.section-subtitle {
    font-size: 21px;
    color: var(--ash);
    letter-spacing: 2px;
    text-transform: uppercase;
    font-style: italic;
}

.lp-table {
    padding: 0;
    display: flex;
    flex-direction: column;
}

.col-rank {
    width: 80px;
    flex-shrink: 0;
    text-align: center;
    white-space: nowrap;
    border-left: 2px solid rgba(180, 20, 20, 0.40);
}

.col-name {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
}

.col-lp-rank {
    width: 115px;
    flex-shrink: 0;
    text-align: center;
    white-space: nowrap;
    border-right: 2px solid rgba(180, 20, 20, 0.40);
}

.col-points {
    width: 100px;
    flex-shrink: 0;
    text-align: center;
    white-space: nowrap;
}

.col-rank-group {
    width: 207px;
    /* col-rank(80) + gap(12) + col-lp-rank(115) */
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    border-left: 2px solid rgba(180, 20, 20, 0.40);
    border-right: 2px solid rgba(180, 20, 20, 0.40);
}

.rank-group-label {
    font-size: 16px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--bone);
    font-family: var(--font-subhead);
    line-height: 1;
}

.rank-subheads {
    display: flex;
    width: 100%;
    gap: 12px;
    border-top: 1px solid rgba(139, 0, 0, 0.3);
    padding-top: 3px;
}

.rank-subheads .col-rank,
.rank-subheads .col-lp-rank {
    border: none;
}

.lp-header-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 16px 8px;
    border-bottom: 1px solid rgba(139, 0, 0, 0.3);
    font-family: var(--font-subhead);
    font-size: 19px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--ash);
}

.lp-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 16px;
    border-bottom: 1px solid rgba(139, 0, 0, 0.1);
    transition: background 0.15s;
}

.lp-row:last-child {
    border-bottom: none;
}

.lp-row:hover {
    background: rgba(139, 0, 0, 0.07);
}

.lp-pos {
    font-family: var(--font-subhead);
    font-size: 21px;
    color: var(--ash);
}

.lp-name {
    font-family: var(--font-subhead);
    font-size: 18px;
    color: var(--bone);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.lp-lp-rank {
    font-family: var(--font-subhead);
    font-size: 21px;
    color: var(--ash);
}

.lp-points {
    font-family: var(--font-subhead);
    font-size: 19px;
    font-weight: 700;
    color: var(--soul-gold);
    text-shadow: 0 0 6px rgba(255, 179, 71, 0.3);
}

/* ── Rank tier colours ── */
.rank-dragon {
    background: rgba(180, 0, 0, 0.12);
}

.rank-rune {
    background: rgba(0, 168, 168, 0.10);
}

.rank-adamant {
    background: rgba(30, 100, 30, 0.12);
}

.rank-mithril {
    background: rgba(80, 80, 200, 0.12);
}

.rank-steel {
    background: rgba(140, 150, 165, 0.10);
}

.rank-iron {
    background: rgba(100, 100, 100, 0.10);
}

.rank-bronze {
    background: rgba(160, 100, 40, 0.10);
}

.rank-dragon .lp-name,
.rank-dragon .lp-points {
    color: #e03030;
    text-shadow: 0 0 8px rgba(220, 30, 30, 0.45);
}

.rank-rune .lp-name,
.rank-rune .lp-points {
    color: #00cece;
    text-shadow: 0 0 8px rgba(0, 200, 200, 0.4);
}

.rank-adamant .lp-name,
.rank-adamant .lp-points {
    color: #4caf50;
    text-shadow: 0 0 8px rgba(60, 160, 60, 0.4);
}

.rank-mithril .lp-name,
.rank-mithril .lp-points {
    color: #8080e0;
    text-shadow: 0 0 8px rgba(100, 100, 220, 0.4);
}

.rank-steel .lp-name,
.rank-steel .lp-points {
    color: #a8b8c8;
    text-shadow: none;
}

.rank-iron .lp-name,
.rank-iron .lp-points {
    color: #909090;
    text-shadow: none;
}

.rank-bronze .lp-name,
.rank-bronze .lp-points {
    color: #cd7f32;
    text-shadow: 0 0 6px rgba(180, 100, 30, 0.35);
}


.lp-row--error .lp-points {
    color: var(--ash);
}

.loading-dots {
    color: var(--ash);
    animation: hellPulse 1.5s ease-in-out infinite;
    letter-spacing: 2px;
}

.error-text {
    color: var(--ash);
    font-size: 19px;
    cursor: help;
}

.cors-notice {
    padding: 10px 16px 12px;
    font-size: 19px;
    color: var(--ash);
    font-style: italic;
    border-top: 1px dashed rgba(139, 0, 0, 0.25);
}
</style>