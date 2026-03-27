<template>
    <header class="site-header">
        <div class="embers" aria-hidden="true">
            <span v-for="i in 12" :key="i" class="ember" :style="emberStyle(i)">✦</span>
        </div>

        <div class="header-inner">
            <div class="logo-area">
                <img src="/logo.png" alt="TEA Clan Logo" class="clan-logo" />
            </div>

            <div class="header-title-area">
                <h1 class="league-title glow-text">
                    <span class="title-top">Demonic Pacts</span>
                    <span class="title-bottom">League</span>
                </h1>
            </div>

            <div class="links-area">
                <a href="https://secure.runescape.com/m=news/archive?oldschool=1&year=2026&month=4" target="_blank"
                    rel="noopener" class="quick-link">News</a>
                <a href="https://oldschool.runescape.wiki/w/Demonic_Pacts_League" target="_blank" rel="noopener"
                    class="quick-link">Wiki</a>
                <a href="https://secure.runescape.com/m=hiscore_oldschool_seasonal/overall" target="_blank"
                    rel="noopener" class="quick-link">Hiscores</a>
                <a href="https://x.com/OldSchoolRS" target="_blank" rel="noopener" class="quick-link">Twitter</a>
            </div>
        </div>

        <div class="header-glow-bar"></div>
    </header>
</template>

<script setup>
defineProps({
    playerCount: { type: Number, default: 6 }
})

function emberStyle(i) {
    const seed = i * 137.5
    return {
        left: `${seed % 100}%`,
        animationDelay: `${(i * 0.7) % 4}s`,
        animationDuration: `${3 + (i % 3)}s`,
        fontSize: `${8 + (i % 6)}px`,
        opacity: 0.3 + (i % 4) * 0.15
    }
}
</script>

<style scoped>
.site-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 100;
    padding: 12px 0 0;
    overflow: hidden;
    background: rgba(5, 0, 0, 0.75);
    backdrop-filter: blur(6px);
}

.embers {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
}

.ember {
    position: absolute;
    color: var(--ember);
    animation: floatEmber var(--dur, 3s) ease-in-out infinite;
    bottom: 10%;
}

.header-inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 220px 1fr 220px;
    align-items: center;
    width: 100%;
}

.logo-area {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-left: 20px;
}

.clan-logo {
    height: 100px;
    width: auto;
    object-fit: contain;
}

.header-title-area {
    text-align: center;
}

.league-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
    margin-bottom: 6px;
}

.title-top {
    font-family: var(--font-display);
    font-size: clamp(24px, 3vw, 42px);
    color: var(--crimson);
    letter-spacing: 3px;
    text-shadow: 0 0 10px rgba(255, 60, 30, 0.8), 0 0 30px rgba(139, 0, 0, 0.6), 0 2px 0 rgba(0, 0, 0, 0.8);
    animation: flicker 8s infinite;
}

.title-bottom {
    font-family: var(--font-heading);
    font-size: clamp(14px, 1.8vw, 26px);
    color: var(--sulfur);
    letter-spacing: 8px;
    text-transform: uppercase;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 140, 0, 0.4);
    margin-top: 4px;
}

.links-area {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin-right: 20px;
}

.quick-link {
    display: block;
    font-family: var(--font-subhead);
    font-size: 12px;
    letter-spacing: 1px;
    color: var(--ash);
    text-decoration: none;
    padding: 6px 10px;
    border: 1px solid rgba(139, 0, 0, 0.4);
    border-radius: 3px;
    background: rgba(139, 0, 0, 0.1);
    transition: all 0.2s;
    text-align: center;
    white-space: nowrap;
}

.quick-link:hover {
    color: var(--ember);
    background: rgba(139, 0, 0, 0.3);
    border-color: var(--blood-red);
    text-shadow: 0 0 8px rgba(255, 107, 53, 0.4);
}

.header-glow-bar {
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, rgba(139, 0, 0, 0.4) 15%, var(--blood-red) 40%, var(--ember) 50%, var(--blood-red) 60%, rgba(139, 0, 0, 0.4) 85%, transparent 100%);
    box-shadow: 0 0 16px rgba(220, 20, 20, 0.5);
}
</style>