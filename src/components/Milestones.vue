<template>
    <section class="milestones-section">
        <div class="section-header">
            <h2 class="section-title">Clan Milestones</h2>
            <p class="section-subtitle">Group objectives</p>
        </div>

        <div class="overall-badge panel">
            <div class="overall-left">
                <span class="overall-label">Overall</span>
                <span class="overall-pct">{{ overallPct }}%</span>
            </div>
            <div class="overall-bar-track">
                <div class="overall-bar-fill" :style="{ width: overallPct + '%' }"></div>
            </div>
            <div class="overall-completed">
                <span class="completed-num">{{ completedCount }}</span>
                <span class="completed-label">/ {{ milestones.length }} done</span>
            </div>
        </div>

        <div class="milestones-list">
            <div v-for="ms in milestones" :key="ms.key" class="milestone-card panel"
                :class="{ 'is-complete': ms.pct >= 100 }">
                <div v-if="ms.pct >= 100" class="complete-flash" aria-hidden="true"></div>

                <div class="ms-header">
                    <div class="ms-title-group">
                        <span class="ms-title">{{ ms.label }}</span>
                        <span class="ms-detail">{{ ms.formatCurrent(ms.current) }} / {{ ms.formatGoal(ms.goal) }}</span>
                    </div>
                    <div class="ms-badge" :class="badgeClass(ms.pct)">
                        {{ ms.pct >= 100 ? 'DONE' : ms.pct + '%' }}
                    </div>
                </div>

                <div class="ms-bar-track">
                    <div class="ms-bar-fill" :class="{ 'fill-complete': ms.pct >= 100 }"
                        :style="{ width: Math.min(ms.pct, 100) + '%' }"></div>
                    <div class="ms-tick" style="left: 25%"></div>
                    <div class="ms-tick" style="left: 50%"></div>
                    <div class="ms-tick" style="left: 75%"></div>
                </div>

                <div class="ms-footer">
                    <span class="ms-remaining" v-if="ms.pct < 100">{{ ms.formatGoal(ms.goal - ms.current) }}
                        remaining</span>
                    <span class="ms-remaining complete-text" v-else>Milestone achieved!</span>
                    <span class="ms-leader" v-if="ms.leader">{{ ms.leader }}</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'
import { players } from '@/stores/statsStore.js'

function clanSum(key) { return players.value.reduce((s, p) => s + (p[key] || 0), 0) }
function topPlayer(key) { return [...players.value].sort((a, b) => (b[key] || 0) - (a[key] || 0))[0]?.name }
function pct(current, goal) { return Math.min(Math.floor((current / goal) * 100), 100) }
function fmtGP(v) {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`
    return v.toString()
}
function fmtNum(v) { return v.toLocaleString() }

const milestones = computed(() => [
    { key: 'gpEarned', label: '10 Billion GP Earned', goal: 10_000_000_000, current: clanSum('gpEarned'), formatCurrent: fmtGP, formatGoal: fmtGP, pct: pct(clanSum('gpEarned'), 10_000_000_000), leader: topPlayer('gpEarned') },
    { key: 'itemsReceived', label: '10M Items Received', goal: 10_000_000, current: clanSum('itemsReceived'), formatCurrent: fmtNum, formatGoal: fmtNum, pct: pct(clanSum('itemsReceived'), 10_000_000), leader: topPlayer('itemsReceived') },
    { key: 'levelsEarned', label: '10,000 Levels Earned', goal: 10_000, current: clanSum('levelsEarned'), formatCurrent: fmtNum, formatGoal: fmtNum, pct: pct(clanSum('levelsEarned'), 10_000), leader: topPlayer('levelsEarned') },
    { key: 'petsEarned', label: '10 Pets Received', goal: 10, current: clanSum('petsEarned'), formatCurrent: fmtNum, formatGoal: fmtNum, pct: pct(clanSum('petsEarned'), 10), leader: topPlayer('petsEarned') },
    { key: 'clogsEarned', label: '10,000 Clog Slots', goal: 10_000, current: clanSum('clogsEarned'), formatCurrent: fmtNum, formatGoal: fmtNum, pct: pct(clanSum('clogsEarned'), 10_000), leader: topPlayer('clogsEarned') },
    { key: 'combatTasks', label: '1,000 Combat Tasks', goal: 1_000, current: clanSum('combatTasks'), formatCurrent: fmtNum, formatGoal: fmtNum, pct: pct(clanSum('combatTasks'), 1_000), leader: topPlayer('combatTasks') },
    { key: 'clueScrolls', label: '10,000 Clue Scrolls', goal: 10_000, current: clanSum('clueScrolls'), formatCurrent: fmtNum, formatGoal: fmtNum, pct: pct(clanSum('clueScrolls'), 10_000), leader: topPlayer('clueScrolls') },
])

const completedCount = computed(() => milestones.value.filter(m => m.pct >= 100).length)
const overallPct = computed(() => Math.floor((completedCount.value / milestones.value.length) * 100))

function badgeClass(p) {
    if (p >= 100) return 'badge--complete'
    if (p >= 75) return 'badge--high'
    if (p >= 40) return 'badge--mid'
    return 'badge--low'
}


</script>

<style scoped>
.milestones-section {
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

.overall-badge {
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 16px;
}

.overall-left {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.overall-label {
    font-size: 18px;
    color: var(--ash);
    letter-spacing: 1.5px;
    text-transform: uppercase;
}

.overall-pct {
    font-family: var(--font-subhead);
    font-size: 30px;
    font-weight: 700;
    color: var(--ember);
    line-height: 1;
    text-shadow: 0 0 10px rgba(255, 107, 53, 0.4);
}

.overall-bar-track {
    flex: 1;
    height: 9px;
    background: rgba(139, 0, 0, 0.15);
    border-radius: 4px;
    border: 1px solid rgba(139, 0, 0, 0.3);
    overflow: hidden;
}

.overall-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--blood-red), var(--ember), var(--sulfur));
    border-radius: 4px;
    transition: width 1.2s ease;
    box-shadow: 0 0 6px rgba(255, 107, 53, 0.4);
}

.overall-completed {
    display: flex;
    align-items: baseline;
    gap: 4px;
    flex-shrink: 0;
}

.completed-num {
    font-family: var(--font-subhead);
    font-size: 30px;
    font-weight: 700;
    color: var(--sulfur);
}

.completed-label {
    font-size: 21px;
    color: var(--ash);
}

.milestones-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
}

.milestone-card {
    padding: 13px 16px 11px;
    position: relative;
    transition: box-shadow 0.2s;
}

.milestone-card:hover {
    box-shadow: 0 0 0 1px rgba(139, 0, 0, 0.45) inset, 0 0 22px rgba(160, 8, 8, 0.2), 0 4px 24px rgba(0, 0, 0, 0.6);
}

.milestone-card.is-complete {
    border-color: rgba(255, 215, 0, 0.35);
}

.complete-flash {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.05) 50%, transparent 100%);
    pointer-events: none;
    border-radius: inherit;
}

.ms-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
}

.ms-title-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.ms-title {
    font-family: var(--font-subhead);
    font-size: 18px;
    font-weight: 600;
    color: var(--bone);
    letter-spacing: 0.5px;
}

.is-complete .ms-title {
    color: var(--soul-gold);
}

.ms-detail {
    font-size: 19px;
    color: var(--ash);
    font-style: italic;
}

.ms-badge {
    font-family: var(--font-subhead);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 4px 10px;
    border-radius: 3px;
    flex-shrink: 0;
}

.badge--low {
    background: rgba(139, 0, 0, 0.2);
    border: 1px solid rgba(139, 0, 0, 0.4);
    color: var(--ash);
}

.badge--mid {
    background: rgba(192, 57, 43, 0.2);
    border: 1px solid rgba(192, 57, 43, 0.4);
    color: var(--crimson);
}

.badge--high {
    background: rgba(255, 107, 53, 0.15);
    border: 1px solid rgba(255, 107, 53, 0.4);
    color: var(--ember);
}

.badge--complete {
    background: rgba(255, 215, 0, 0.12);
    border: 1px solid rgba(255, 215, 0, 0.5);
    color: var(--sulfur);
}

.ms-bar-track {
    height: 7px;
    background: rgba(139, 0, 0, 0.12);
    border-radius: 3px;
    border: 1px solid rgba(139, 0, 0, 0.2);
    overflow: visible;
    position: relative;
    margin-bottom: 9px;
}

.ms-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--blood-red), var(--crimson));
    border-radius: 3px;
    transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.ms-bar-fill.fill-complete {
    background: linear-gradient(90deg, var(--ember), var(--sulfur));
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.35);
}

.ms-tick {
    position: absolute;
    top: -1px;
    width: 1px;
    height: 9px;
    background: rgba(139, 0, 0, 0.3);
    transform: translateX(-50%);
}

.ms-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.ms-remaining {
    font-size: 19px;
    color: var(--ash);
    font-style: italic;
}

.complete-text {
    color: var(--soul-gold);
}

.ms-leader {
    font-size: 19px;
    color: var(--ash);
    font-family: var(--font-subhead);
}
</style>