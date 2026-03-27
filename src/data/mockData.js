// Mock data — replace with real API calls later
export const CLAN_PLAYERS = [
    { id: 1, name: 'DemonSlayer99', avatar: '😈', gpEarned: 42_500_000, itemsReceived: 37, levelsEarned: 312, petsEarned: 1, deaths: 14, clogsEarned: 182, combatTasks: 94, clueScrolls: 38, rank: 'Archon' },
    { id: 2, name: 'BoneCrusherX', avatar: '💀', gpEarned: 28_750_000, itemsReceived: 24, levelsEarned: 204, petsEarned: 0, deaths: 31, clogsEarned: 140, combatTasks: 61, clueScrolls: 22, rank: 'Archon' },
    { id: 3, name: 'L3sius', avatar: '🔥', gpEarned: 61_200_000, itemsReceived: 52, levelsEarned: 489, petsEarned: 2, deaths: 7, clogsEarned: 267, combatTasks: 158, clueScrolls: 71, rank: 'Overlord' },
    { id: 4, name: 'SoulReaper_VII', avatar: '⚔️', gpEarned: 15_300_000, itemsReceived: 18, levelsEarned: 143, petsEarned: 0, deaths: 22, clogsEarned: 98, combatTasks: 42, clueScrolls: 15, rank: 'Archon' },
    { id: 5, name: 'AbyssWarden', avatar: '🩸', gpEarned: 33_100_000, itemsReceived: 29, levelsEarned: 271, petsEarned: 1, deaths: 18, clogsEarned: 155, combatTasks: 87, clueScrolls: 44, rank: 'Archon' },
    { id: 6, name: 'RuneWitch666', avatar: '🧿', gpEarned: 9_800_000, itemsReceived: 11, levelsEarned: 88, petsEarned: 0, deaths: 44, clogsEarned: 51, combatTasks: 19, clueScrolls: 8, rank: 'Initiate' },
]

export const LIVE_FEED_EVENTS = [
    { id: 1, player: 'L3sius', type: 'drop', message: 'received Dragon Claws', value: 78_000_000, time: '2m ago', icon: '🗡️' },
    { id: 2, player: 'DemonSlayer99', type: 'gp', message: 'earned 4.2M GP from Barrows', value: 4_200_000, time: '5m ago', icon: '💰' },
    { id: 3, player: 'BoneCrusherX', type: 'drop', message: 'received Abyssal Whip', value: 2_100_000, time: '9m ago', icon: '🪱' },
    { id: 4, player: 'AbyssWarden', type: 'kill', message: 'defeated Cerberus (x3)', value: null, time: '12m ago', icon: '💀' },
    { id: 5, player: 'SoulReaper_VII', type: 'drop', message: 'received Primordial Crystal', value: 42_000_000, time: '18m ago', icon: '💎' },
    { id: 6, player: 'L3sius', type: 'gp', message: 'earned 7.8M GP from Zulrah', value: 7_800_000, time: '22m ago', icon: '💰' },
    { id: 7, player: 'RuneWitch666', type: 'drop', message: 'received Trident of the Swamp', value: 1_800_000, time: '31m ago', icon: '🔱' },
    { id: 8, player: 'DemonSlayer99', type: 'kill', message: "slew K'ril Tsutsaroth (final boss)", value: null, time: '45m ago', icon: '⚔️' },
    { id: 9, player: 'BoneCrusherX', type: 'drop', message: 'received Bandos Chestplate', value: 9_200_000, time: '52m ago', icon: '🛡️' },
    { id: 10, player: 'AbyssWarden', type: 'gp', message: 'earned 2.1M GP from Slayer tasks', value: 2_100_000, time: '1h ago', icon: '💰' },
    { id: 11, player: 'L3sius', type: 'level', message: 'reached 99 Slayer', value: null, time: '1h ago', icon: '⬆️' },
    { id: 12, player: 'DemonSlayer99', type: 'pet', message: 'received Chompy chick pet', value: null, time: '2h ago', icon: '🐾' },
    { id: 13, player: 'RuneWitch666', type: 'death', message: 'died to Vorkath (ouch)', value: null, time: '2h ago', icon: '💀' },
    { id: 14, player: 'AbyssWarden', type: 'clog', message: 'got a new collection log slot', value: null, time: '3h ago', icon: '📖' },
    { id: 15, player: 'BoneCrusherX', type: 'combat', message: 'completed Elite Combat Task', value: null, time: '3h ago', icon: '🏹' },
    { id: 16, player: 'SoulReaper_VII', type: 'clue', message: 'completed Master Clue Scroll', value: null, time: '4h ago', icon: '📜' },
]

export const NOTABLE_ITEMS = [
    { name: 'Dragon Claws', player: 'L3sius', value: 78_000_000, rarity: 'legendary', icon: '🗡️' },
    { name: 'Primordial Crystal', player: 'SoulReaper_VII', value: 42_000_000, rarity: 'legendary', icon: '💎' },
    { name: 'Bandos Chestplate', player: 'BoneCrusherX', value: 9_200_000, rarity: 'rare', icon: '🛡️' },
    { name: 'Abyssal Whip', player: 'BoneCrusherX', value: 2_100_000, rarity: 'rare', icon: '🪱' },
    { name: 'Trident of the Swamp', player: 'RuneWitch666', value: 1_800_000, rarity: 'uncommon', icon: '🔱' },
]