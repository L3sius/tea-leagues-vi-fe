<template>
    <section class="stat-trackers">
        <div class="section-header">
            <h2 class="section-title">Clan Stats</h2>
        </div>

        <div class="trackers-list">
            <div v-for="tracker in trackers" :key="tracker.key" class="tracker-card panel"
                :class="[`tracker--${tracker.key}`, { 'is-expanded': expanded[tracker.key] }]">

                <div class="card-header" @click="toggle(tracker.key)">
                    <div class="card-title-group">
                        <span class="card-label">{{ tracker.label }}</span>
                        <span class="card-total" :class="{ 'total--bad': tracker.key === 'deaths' }">
                            {{ tracker.format(clanTotal(tracker.key)) }}
                        </span>
                    </div>
                    <div class="card-meta">
                        <span class="card-leader">
                            #1 {{ topPlayer(tracker.key)?.name }}
                            <span class="leader-val">{{ tracker.format(topPlayer(tracker.key)?.[tracker.key] ?? 0)
                            }}</span>
                        </span>
                        <button class="expand-btn" :aria-label="expanded[tracker.key] ? 'Collapse' : 'Expand'">
                            <span class="expand-chevron" :class="{ 'is-open': expanded[tracker.key] }">▾</span>
                        </button>
                    </div>
                </div>

                <Transition name="expand">
                    <div v-if="expanded[tracker.key]" class="leaderboard">
                        <div v-for="(player, idx) in sorted(tracker.key)" :key="player.id" class="lb-row"
                            :class="{ 'lb-row--gold': idx === 0, 'lb-row--silver': idx === 1, 'lb-row--bronze': idx === 2 }">
                            <span class="lb-pos">{{ idx + 1 }}</span>
                            <span class="lb-name">{{ player.name }}</span>
                            <div class="lb-bar-wrap">
                                <div class="lb-bar"
                                    :class="{ 'lb-bar--gold': idx === 0, 'lb-bar--bad': tracker.key === 'deaths' }"
                                    :style="{ width: barWidth(player[tracker.key], tracker.key) + '%' }"></div>
                            </div>
                            <span class="lb-val" :class="{ 'lb-val--bad': tracker.key === 'deaths' }">
                                {{ tracker.format(player[tracker.key]) }}
                            </span>
                        </div>
                    </div>
                </Transition>

            </div>
        </div>
    </section>
</template>

<script setup>
import { reactive } from 'vue'
import { players } from '@/stores/statsStore.js'

const expanded = reactive({})
function toggle(key) { expanded[key] = !expanded[key] }

const trackers = [
    { key: 'gpEarned', label: 'GP Earned', format: v => v >= 1_000_000_000 ? `${(v / 1_000_000_000).toFixed(2)}B` : v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : `${v}` },
    { key: 'itemsReceived', label: 'Items Received', format: v => v.toLocaleString() },
    { key: 'levelsEarned', label: 'Levels Earned', format: v => v.toLocaleString() },
    { key: 'petsEarned', label: 'Pets Earned', format: v => v.toString() },
    { key: 'deaths', label: 'Deaths', format: v => v.toLocaleString() },
    { key: 'clogsEarned', label: 'Clog Slots', format: v => v.toLocaleString() },
    { key: 'combatTasks', label: 'Combat Tasks', format: v => v.toLocaleString() },
    { key: 'clueScrolls', label: 'Clue Scrolls', format: v => v.toLocaleString() },
]

function sorted(key) { return [...players.value].sort((a, b) => b[key] - a[key]) }
function topN(key, n) { return sorted(key).slice(0, n) }
function restN(key, n) { return sorted(key).slice(n) }
function topPlayer(key) { return sorted(key)[0] }
function clanTotal(key) { return players.value.reduce((s, p) => s + p[key], 0) }
function barWidth(val, key) {
    const max = Math.max(...players.value.map(p => p[key]))
    return max === 0 ? 0 : Math.round((val / max) * 100)
}


</script>

<style scoped>
.stat-trackers {
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

.trackers-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.tracker-card {
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.2s;
}

.tracker-card:hover {
    box-shadow: 0 0 0 1px rgba(139, 0, 0, 0.45) inset, 0 0 22px rgba(160, 8, 8, 0.2), 0 4px 24px rgba(0, 0, 0, 0.65);
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 16px 11px;
    cursor: pointer;
    user-select: none;
    gap: 12px;
    border-bottom: 1px solid rgba(139, 0, 0, 0.15);
    transition: background 0.15s;
}

.card-header:hover {
    background: rgba(139, 0, 0, 0.06);
}

.is-expanded .card-header {
    border-bottom-color: rgba(139, 0, 0, 0.3);
}

.card-title-group {
    display: flex;
    align-items: baseline;
    gap: 12px;
    min-width: 0;
}

.card-label {
    font-family: var(--font-subhead);
    font-size: 19px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--ash);
    white-space: nowrap;
}

.card-total {
    font-family: var(--font-subhead);
    font-size: 30px;
    font-weight: 700;
    color: var(--soul-gold);
    line-height: 1;
    text-shadow: 0 0 8px rgba(255, 179, 71, 0.3);
    white-space: nowrap;
}

.total--bad {
    color: var(--crimson);
    text-shadow: 0 0 8px rgba(192, 57, 43, 0.35);
}

.card-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}

.card-leader {
    font-family: var(--font-subhead);
    font-size: 19px;
    color: var(--ash);
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
}

.leader-val {
    color: var(--ember);
    font-weight: 600;
}

.expand-btn {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    transition: border-color 0.15s, background 0.15s;
}

.expand-btn:hover {
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.4);
}

.expand-chevron {
    color: var(--ash);
    font-size: 19px;
    line-height: 1;
    transition: transform 0.25s ease;
    display: block;
}

.expand-chevron.is-open {
    transform: rotate(180deg);
}

.leaderboard {
    padding: 8px 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.leaderboard--rest {
    padding-top: 0;
    border-top: 1px dashed rgba(139, 0, 0, 0.2);
}

.lb-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 0;
}

.lb-row--gold .lb-name {
    color: var(--soul-gold);
}

.lb-row--silver .lb-name {
    color: var(--parchment);
}

.lb-row--bronze .lb-name {
    color: #8b7355;
}

.lb-row--rest .lb-name {
    color: var(--ash);
}

.lb-pos {
    font-family: var(--font-subhead);
    font-size: 19px;
    color: var(--ash);
    width: 18px;
    text-align: right;
    flex-shrink: 0;
}

.lb-row--gold .lb-pos {
    color: var(--sulfur);
}

.lb-row--silver .lb-pos {
    color: var(--parchment);
}

.lb-row--bronze .lb-pos {
    color: var(--ember);
}

.lb-name {
    font-family: var(--font-subhead);
    font-size: 21px;
    width: 130px;
    flex-shrink: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.lb-bar-wrap {
    flex: 1;
    height: 6px;
    background: rgba(139, 0, 0, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.lb-bar {
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(90deg, var(--blood-red), var(--crimson));
    transition: width 0.9s ease;
}

.lb-bar--gold {
    background: linear-gradient(90deg, var(--ember), var(--sulfur));
    box-shadow: 0 0 4px rgba(255, 215, 0, 0.25);
}

.lb-bar--bad {
    background: linear-gradient(90deg, #5a0000, var(--crimson));
}

.lb-bar--rest {
    background: rgba(139, 0, 0, 0.35);
}

.lb-val {
    font-family: var(--font-subhead);
    font-size: 21px;
    font-weight: 600;
    color: var(--soul-gold);
    flex-shrink: 0;
    min-width: 44px;
    text-align: right;
}

.lb-val--bad {
    color: var(--crimson);
}

.lb-val--dim {
    color: var(--ash);
    font-weight: 400;
}

.expand-divider {
    padding: 6px 0 4px;
}

.expand-divider span {
    font-size: 18px;
    color: rgba(122, 106, 90, 0.45);
    font-style: italic;
    letter-spacing: 1px;
}

.expand-enter-active,
.expand-leave-active {
    transition: opacity 0.25s ease, max-height 0.3s ease;
    max-height: 400px;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    opacity: 0;
    max-height: 0;
}
</style>