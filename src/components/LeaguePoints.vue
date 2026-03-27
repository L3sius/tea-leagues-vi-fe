<template>
    <section class="league-points-section">
        <div class="section-header">
            <h2 class="section-title">League Points</h2>
            <p class="section-subtitle">Hiscores</p>
        </div>

        <div class="lp-table panel">
            <div class="lp-header-row">
                <span class="col-rank">Rank</span>
                <span class="col-name">Player</span>
                <span class="col-lp-rank">LP Rank</span>
                <span class="col-points">Points</span>
            </div>

            <div v-for="(player, idx) in sortedPlayers" :key="player.name" class="lp-row" :class="{
                'lp-row--gold': idx === 0,
                'lp-row--silver': idx === 1,
                'lp-row--bronze': idx === 2,
                'lp-row--error': player.error,
            }">
                <span class="col-rank lp-pos">{{ idx + 1 }}</span>
                <span class="col-name lp-name">{{ player.name }}</span>
                <span class="col-lp-rank lp-lp-rank">
                    <template v-if="player.loading">—</template>
                    <template v-else-if="player.error">—</template>
                    <template v-else># {{ player.leagueRank.toLocaleString() }}</template>
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
import { ref, computed, onMounted } from 'vue'
import { CLAN_PLAYERS } from '@/data/mockData.js'

const LEAGUE_POINTS_LINE = 25

const players = ref(
    CLAN_PLAYERS.map(p => ({
        name: p.name,
        leagueRank: 0,
        leaguePoints: 0,
        loading: true,
        error: null,
    }))
)

const showCorsNotice = ref(false)

const sortedPlayers = computed(() =>
    [...players.value].sort((a, b) => {
        if (a.error && !b.error) return 1
        if (!a.error && b.error) return -1
        return b.leaguePoints - a.leaguePoints
    })
)

async function fetchPlayer(playerRef) {
    try {
        const res = await fetch(`/api/hiscores?player=${encodeURIComponent(playerRef.name)}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const text = await res.text()
        const lines = text.trim().split('\n')
        const lpLine = lines[LEAGUE_POINTS_LINE]
        if (!lpLine) throw new Error('Unexpected response format')
        const [rank, score] = lpLine.split(',').map(Number)
        playerRef.leagueRank = rank === -1 ? 0 : rank
        playerRef.leaguePoints = rank === -1 ? 0 : score
        playerRef.loading = false
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

onMounted(() => { players.value.forEach(p => fetchPlayer(p)) })
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
    font-size: 24px;
    font-weight: 700;
    color: var(--soul-gold);
    letter-spacing: 2px;
    text-shadow: 0 0 12px rgba(255, 179, 71, 0.4);
}

.section-subtitle {
    font-size: 14px;
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
    width: 36px;
    flex-shrink: 0;
    text-align: center;
}

.col-name {
    flex: 1;
    min-width: 0;
}

.col-lp-rank {
    width: 90px;
    flex-shrink: 0;
    text-align: right;
}

.col-points {
    width: 80px;
    flex-shrink: 0;
    text-align: right;
}

.lp-header-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 16px 8px;
    border-bottom: 1px solid rgba(139, 0, 0, 0.3);
    font-family: var(--font-subhead);
    font-size: 11px;
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
    font-size: 14px;
    color: var(--ash);
}

.lp-row--gold .lp-pos {
    color: var(--sulfur);
}

.lp-row--silver .lp-pos {
    color: var(--parchment);
}

.lp-row--bronze .lp-pos {
    color: var(--ember);
}

.lp-name {
    font-family: var(--font-subhead);
    font-size: 15px;
    color: var(--bone);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.lp-row--gold .lp-name {
    color: var(--soul-gold);
}

.lp-row--silver .lp-name {
    color: var(--parchment);
}

.lp-row--bronze .lp-name {
    color: var(--ember);
}

.lp-lp-rank {
    font-family: var(--font-subhead);
    font-size: 14px;
    color: var(--ash);
}

.lp-points {
    font-family: var(--font-subhead);
    font-size: 16px;
    font-weight: 700;
    color: var(--soul-gold);
    text-shadow: 0 0 6px rgba(255, 179, 71, 0.3);
}

.lp-row--gold .lp-points {
    color: var(--sulfur);
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
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
    font-size: 13px;
    cursor: help;
}

.cors-notice {
    padding: 10px 16px 12px;
    font-size: 13px;
    color: var(--ash);
    font-style: italic;
    border-top: 1px dashed rgba(139, 0, 0, 0.25);
}
</style>