<template>
    <section class="gp-section">
        <div class="section-header">
            <div class="section-title-group">
                <h2 class="section-title">
                    <span class="title-deco">💰</span>
                    GP Earned
                </h2>
                <p class="section-subtitle">Total gold accumulated</p>
            </div>
            <div class="total-badge">
                <span class="total-label">CLAN TOTAL</span>
                <span class="total-value">{{ formatGPShort(clanTotal) }}</span>
            </div>
        </div>

        <!-- Clan total progress bar -->
        <div class="clan-bar-wrap panel">
            <div class="clan-bar-label">
                <span>Combined Wealth</span>
                <span class="clan-bar-amount">{{ formatGP(clanTotal) }}</span>
            </div>
            <div class="clan-bar-track">
                <div class="clan-bar-fill" :style="{ width: `${clanProgress}%` }"></div>
                <div class="clan-bar-glow"></div>
            </div>
            <div class="clan-bar-goal">
                <span>Goal: {{ formatGP(GP_GOAL) }}</span>
                <span class="goal-pct">{{ clanProgress.toFixed(1) }}%</span>
            </div>
        </div>

        <!-- Player rows -->
        <div class="players-list panel">
            <div v-for="(player, idx) in sortedPlayers" :key="player.id" class="player-row"
                :class="{ 'is-top': idx === 0 }">
                <div class="player-rank">#{{ idx + 1 }}</div>
                <div class="player-avatar">{{ player.avatar }}</div>
                <div class="player-info">
                    <div class="player-name-row">
                        <span class="player-name">{{ player.name }}</span>
                        <span class="player-rank-badge" :class="`rank--${player.rank.toLowerCase()}`">
                            {{ player.rank }}
                        </span>
                    </div>
                    <div class="player-bar-track">
                        <div class="player-bar-fill" :class="{ 'fill-top': idx === 0 }"
                            :style="{ width: `${(player.gpEarned / topGP) * 100}%` }"></div>
                    </div>
                </div>
                <div class="player-gp">
                    <span class="gp-amount">{{ formatGPShort(player.gpEarned) }}</span>
                    <span class="gp-full">{{ formatGP(player.gpEarned) }}</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { CLAN_PLAYERS } from '@/data/mockData.js'

const GP_GOAL = 300_000_000

const players = ref(CLAN_PLAYERS.map(p => ({ ...p })))

const sortedPlayers = computed(() =>
    [...players.value].sort((a, b) => b.gpEarned - a.gpEarned)
)
const topGP = computed(() => sortedPlayers.value[0]?.gpEarned || 1)
const clanTotal = computed(() => players.value.reduce((s, p) => s + p.gpEarned, 0))
const clanProgress = computed(() => Math.min((clanTotal.value / GP_GOAL) * 100, 100))

function formatGP(val) {
    return val.toLocaleString('en-US') + ' gp'
}
function formatGPShort(val) {
    if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(2)}B`
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`
    if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`
    return `${val}`
}

// Simulate live GP ticks
let timer = null
onMounted(() => {
    timer = setInterval(() => {
        const idx = Math.floor(Math.random() * players.value.length)
        const gain = Math.floor(Math.random() * 500_000) + 50_000
        players.value[idx].gpEarned += gain
    }, 5000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.gp-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
}

.section-title {
    font-family: var(--font-heading);
    font-size: 18px;
    font-weight: 700;
    color: var(--soul-gold);
    letter-spacing: 2px;
    text-shadow: 0 0 12px rgba(255, 179, 71, 0.4);
    display: flex;
    align-items: center;
    gap: 8px;
}

.title-deco {
    font-size: 16px;
}

.section-subtitle {
    font-size: 11px;
    color: var(--ash);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 3px;
    font-style: italic;
}

.total-badge {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.total-label {
    font-size: 10px;
    color: var(--ash);
    letter-spacing: 2px;
    text-transform: uppercase;
}

.total-value {
    font-family: var(--font-subhead);
    font-size: 24px;
    font-weight: 700;
    color: var(--sulfur);
    text-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
    line-height: 1;
}

/* Clan bar */
.clan-bar-wrap {
    padding: 14px 16px;
}

.clan-bar-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 12px;
    color: var(--parchment);
}

.clan-bar-amount {
    font-family: var(--font-subhead);
    color: var(--soul-gold);
    font-size: 13px;
}

.clan-bar-track {
    height: 12px;
    background: rgba(139, 0, 0, 0.15);
    border-radius: 6px;
    border: 1px solid rgba(139, 0, 0, 0.3);
    overflow: hidden;
    position: relative;
}

.clan-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--blood-red), var(--ember), var(--sulfur));
    border-radius: 6px;
    transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 8px rgba(255, 107, 53, 0.5);
}

.clan-bar-goal {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    font-size: 11px;
    color: var(--ash);
}

.goal-pct {
    color: var(--ember);
    font-family: var(--font-subhead);
    font-weight: 600;
}

/* Players list */
.players-list {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.player-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 10px;
    border-radius: 4px;
    border: 1px solid transparent;
    transition: all 0.2s;
    background: rgba(20, 3, 3, 0.4);
}

.player-row:hover {
    background: rgba(35, 5, 5, 0.7);
    border-color: rgba(139, 0, 0, 0.3);
}

.player-row.is-top {
    background: rgba(60, 15, 5, 0.5);
    border-color: rgba(255, 179, 71, 0.2);
}

.player-rank {
    font-family: var(--font-subhead);
    font-size: 12px;
    color: var(--ash);
    width: 22px;
    text-align: center;
    flex-shrink: 0;
}

.is-top .player-rank {
    color: var(--sulfur);
    text-shadow: 0 0 6px rgba(255, 215, 0, 0.4);
}

.player-avatar {
    font-size: 20px;
    flex-shrink: 0;
    filter: drop-shadow(0 0 3px rgba(255, 107, 53, 0.3));
}

.player-info {
    flex: 1;
    min-width: 0;
}

.player-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
}

.player-name {
    font-family: var(--font-subhead);
    font-size: 13px;
    font-weight: 600;
    color: var(--bone);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.is-top .player-name {
    color: var(--soul-gold);
}

.player-rank-badge {
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 1px 6px;
    border-radius: 2px;
    font-family: var(--font-subhead);
    flex-shrink: 0;
}

.rank--overlord {
    background: rgba(255, 179, 71, 0.15);
    border: 1px solid rgba(255, 179, 71, 0.4);
    color: var(--soul-gold);
}

.rank--archon {
    background: rgba(139, 0, 0, 0.2);
    border: 1px solid rgba(139, 0, 0, 0.4);
    color: var(--crimson);
}

.rank--initiate {
    background: rgba(80, 60, 40, 0.2);
    border: 1px solid rgba(122, 106, 90, 0.3);
    color: var(--ash);
}

.player-bar-track {
    height: 5px;
    background: rgba(139, 0, 0, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.player-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--blood-red), var(--crimson));
    border-radius: 3px;
    transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fill-top {
    background: linear-gradient(90deg, var(--ember), var(--sulfur));
    box-shadow: 0 0 6px rgba(255, 215, 0, 0.3);
}

.player-gp {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
}

.gp-amount {
    font-family: var(--font-subhead);
    font-size: 14px;
    font-weight: 700;
    color: var(--soul-gold);
    line-height: 1;
}

.is-top .gp-amount {
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
}

.gp-full {
    font-size: 10px;
    color: var(--ash);
    font-style: italic;
}
</style>