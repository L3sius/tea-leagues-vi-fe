<template>
    <section class="league-info-section">
        <div class="section-header">
            <h2 class="section-title">League Info</h2>
            <p class="section-subtitle">Relics & Areas</p>
        </div>

        <!-- Search -->
        <div class="search-box">
            <input
                v-model="search"
                class="search-input"
                type="text"
                placeholder="Search player..."
                @focus="searchFocused = true"
                @blur="onSearchBlur"
            />
            <div v-if="searchFocused && searchSuggestions.length" class="search-dropdown">
                <div
                    v-for="p in searchSuggestions"
                    :key="p.name"
                    class="search-option"
                    @mousedown.prevent="selectPlayer(p.name)"
                >
                    {{ p.name }}
                </div>
            </div>
        </div>

        <!-- Region filter -->
        <div class="region-filter">
            <div
                v-for="area in AREAS"
                :key="area.key"
                class="filter-slot"
                :class="{
                    'filter-slot--active': selectedRegion === area.key,
                    'filter-slot--disabled': !availableRegions.has(area.key),
                }"
                :title="area.label"
                @click="toggleRegion(area.key)"
            >
                <img :src="area.badge" :alt="area.label" class="filter-icon" />
            </div>
        </div>

        <!-- Active filters summary -->
        <div v-if="selectedRegion || search" class="filter-summary">
            <span v-if="selectedRegion" class="filter-tag">
                {{ AREAS.find(a => a.key === selectedRegion)?.label }}
                <button class="clear-tag" @click="selectedRegion = null">✕</button>
            </span>
            <span v-if="search" class="filter-tag">
                "{{ search }}"
                <button class="clear-tag" @click="search = ''">✕</button>
            </span>
            <span class="result-count">{{ filteredPlayers.length }} player{{ filteredPlayers.length !== 1 ? 's' : '' }}</span>
        </div>

        <!-- Player cards -->
        <div class="player-cards">
            <div v-if="filteredPlayers.length === 0" class="no-results">
                No players match the current filter.
            </div>

            <div v-for="player in filteredPlayers" :key="player.name" class="player-card panel">

                <div class="card-name">{{ player.name }}</div>

                <div class="relics-grid">
                    <div v-for="(relic, idx) in player.relics" :key="idx" class="relic-cell">
                        <span class="relic-tier">T{{ idx + 1 }}</span>
                        <span class="relic-name">{{ relic }}</span>
                    </div>
                </div>

                <div class="areas-strip">
                    <div
                        v-for="area in AREAS"
                        :key="area.key"
                        class="area-slot"
                        :class="{
                            'area-slot--chosen': player.areas.includes(area.key),
                            'area-slot--highlighted': area.key === selectedRegion,
                        }"
                        :title="area.label"
                    >
                        <img :src="area.badge" :alt="area.label" class="area-icon" />
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { AREAS, PLAYER_RELICS } from '@/data/relicData.js'

const search = ref('')
const searchFocused = ref(false)
const selectedRegion = ref(null)

// Players matching the current search query
const searchMatchedPlayers = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return PLAYER_RELICS
    return PLAYER_RELICS.filter(p => p.name.toLowerCase().includes(q))
})

// Regions valid given the current search — prevents picking a region no matched player has
const availableRegions = computed(() => {
    const regions = new Set()
    searchMatchedPlayers.value.forEach(p => p.areas.forEach(a => regions.add(a)))
    return regions
})

// Players valid given the current region — prevents searching someone who isn't in that region
const regionMatchedPlayers = computed(() => {
    if (!selectedRegion.value) return PLAYER_RELICS
    return PLAYER_RELICS.filter(p => p.areas.includes(selectedRegion.value))
})

// Search dropdown only shows players compatible with the active region filter
const searchSuggestions = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return []
    return regionMatchedPlayers.value.filter(
        p => p.name.toLowerCase().includes(q) && p.name.toLowerCase() !== q
    )
})

// Auto-clear region when search changes and makes it incompatible
watch(search, () => {
    if (selectedRegion.value && !availableRegions.value.has(selectedRegion.value)) {
        selectedRegion.value = null
    }
})

function selectPlayer(name) {
    search.value = name
    searchFocused.value = false
}

function onSearchBlur() {
    setTimeout(() => { searchFocused.value = false }, 150)
}

function toggleRegion(key) {
    if (!availableRegions.value.has(key)) return
    selectedRegion.value = selectedRegion.value === key ? null : key
}

const filteredPlayers = computed(() => {
    let list = PLAYER_RELICS
    if (selectedRegion.value) {
        list = list.filter(p => p.areas.includes(selectedRegion.value))
    }
    const q = search.value.trim().toLowerCase()
    if (q) {
        list = list.filter(p => p.name.toLowerCase().includes(q))
    }
    return list
})
</script>

<style scoped>
.league-info-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
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

/* ── Search ── */
.search-box {
    position: relative;
}

.search-input {
    width: 100%;
    box-sizing: border-box;
    background: rgba(18, 2, 2, 0.85);
    border: 1px solid rgba(139, 0, 0, 0.5);
    border-radius: 3px;
    padding: 9px 14px;
    font-family: var(--font-subhead);
    font-size: 15px;
    color: var(--bone);
    letter-spacing: 0.5px;
    outline: none;
    transition: border-color 0.15s;
}

.search-input::placeholder {
    color: var(--ash);
    opacity: 0.6;
}

.search-input:focus {
    border-color: rgba(139, 0, 0, 0.9);
    box-shadow: 0 0 10px rgba(139, 0, 0, 0.25);
}

.search-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: rgba(12, 1, 1, 0.97);
    border: 1px solid rgba(139, 0, 0, 0.5);
    border-radius: 3px;
    z-index: 10;
    overflow: hidden;
}

.search-option {
    padding: 9px 14px;
    font-family: var(--font-subhead);
    font-size: 15px;
    color: var(--bone);
    cursor: pointer;
    transition: background 0.12s;
}

.search-option:hover {
    background: rgba(139, 0, 0, 0.25);
    color: var(--soul-gold);
}

/* ── Region filter ── */
.region-filter {
    display: flex;
    gap: 5px;
    justify-content: space-between;
    background: rgba(18, 2, 2, 0.6);
    border: 1px solid rgba(139, 0, 0, 0.3);
    border-radius: 4px;
    padding: 8px;
}

.filter-slot {
    flex: 1;
    display: flex;
    justify-content: center;
    opacity: 0.35;
    cursor: pointer;
    border-radius: 3px;
    padding: 3px;
    transition: opacity 0.15s, background 0.15s;
}

.filter-slot:hover {
    opacity: 0.75;
    background: rgba(139, 0, 0, 0.2);
}

.filter-slot--active {
    opacity: 1;
    background: rgba(139, 0, 0, 0.3);
    box-shadow: 0 0 8px rgba(255, 69, 0, 0.4);
    filter: drop-shadow(0 0 4px rgba(255, 69, 0, 0.5));
}

.filter-slot--disabled {
    opacity: 0.12;
    cursor: not-allowed;
    pointer-events: none;
}

.filter-icon {
    width: 28px;
    height: 28px;
    object-fit: contain;
}

/* ── Active filter tags ── */
.filter-summary {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.filter-tag {
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(139, 0, 0, 0.25);
    border: 1px solid rgba(139, 0, 0, 0.5);
    border-radius: 3px;
    padding: 3px 8px;
    font-family: var(--font-subhead);
    font-size: 13px;
    color: var(--ember);
    letter-spacing: 0.5px;
}

.clear-tag {
    background: none;
    border: none;
    color: var(--ash);
    cursor: pointer;
    padding: 0;
    font-size: 11px;
    line-height: 1;
    transition: color 0.12s;
}

.clear-tag:hover {
    color: var(--ember);
}

.result-count {
    font-family: var(--font-subhead);
    font-size: 13px;
    color: var(--ash);
    margin-left: auto;
}

/* ── Player cards ── */
.player-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.no-results {
    font-size: 16px;
    color: var(--ash);
    font-style: italic;
    text-align: center;
    padding: 24px 0;
}

.player-card {
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.card-name {
    font-family: var(--font-subhead);
    font-size: 20px;
    font-weight: 700;
    color: var(--soul-gold);
    letter-spacing: 1px;
    text-shadow: 0 0 8px rgba(255, 179, 71, 0.3);
    border-bottom: 1px solid rgba(139, 0, 0, 0.3);
    padding-bottom: 8px;
}

/* ── Relics 4×2 grid ── */
.relics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
}

.relic-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    background: rgba(139, 0, 0, 0.15);
    border: 1px solid rgba(139, 0, 0, 0.35);
    border-radius: 3px;
    padding: 6px 4px;
}

.relic-tier {
    font-family: var(--font-subhead);
    font-size: 13px;
    color: var(--ember);
    letter-spacing: 1px;
    line-height: 1;
}

.relic-name {
    font-size: 13px;
    color: var(--bone);
    text-align: center;
    line-height: 1.3;
    word-break: break-word;
}

/* ── Areas strip ── */
.areas-strip {
    display: flex;
    gap: 5px;
    justify-content: space-between;
    border-top: 1px solid rgba(139, 0, 0, 0.2);
    padding-top: 10px;
}

.area-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.18;
    flex: 1;
    border-radius: 3px;
    padding: 2px;
    transition: opacity 0.15s;
}

.area-slot--chosen {
    opacity: 1;
    filter: drop-shadow(0 0 5px rgba(255, 69, 0, 0.6));
}

.area-slot--highlighted {
    outline: 2px solid rgba(255, 107, 53, 0.7);
    outline-offset: 1px;
    border-radius: 3px;
}

.area-icon {
    width: 100%;
    max-width: 32px;
    height: 32px;
    object-fit: contain;
}
</style>
