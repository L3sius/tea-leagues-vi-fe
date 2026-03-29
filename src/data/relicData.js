// Mock data — replace with real API data when available.

export const RELIC_TIERS = [
    { tier: 1, choices: ['Endless Harvest', 'Prospector', 'Infernal Gathering'] },
    { tier: 2, choices: ['Master of Combat', 'Swift Spells', 'Runic Mastery'] },
    { tier: 3, choices: ['Guardian', 'Avatar of Destruction', 'Soul Stealer'] },
    { tier: 4, choices: ["Slayer's Shroud", 'Treasure Hunter', 'Penance Prince'] },
    { tier: 5, choices: ["Death's Embrace", 'Dragon Slayer', 'Demonic Fury'] },
    { tier: 6, choices: ['Undying Retribution', 'Arcane Conduit', 'Blade of Fortune'] },
    { tier: 7, choices: ['Eternal Champion', 'Void Walker', 'Blood Pact'] },
    { tier: 8, choices: ['Hellfire Embodiment', 'Soulbound Warrior', 'Rift Walker'] },
]

export const AREAS = [
    { key: 'asgarnia', label: 'Asgarnia', badge: '/badges/asgarnia.png' },
    { key: 'desert', label: 'Desert', badge: '/badges/desert.png' },
    { key: 'fremennik', label: 'Fremennik', badge: '/badges/fremennik.png' },
    { key: 'kandarin', label: 'Kandarin', badge: '/badges/kandarin.png' },
    { key: 'karamja', label: 'Karamja', badge: '/badges/karamja.png' },
    { key: 'kourend', label: 'Kourend', badge: '/badges/kourend.png' },
    { key: 'morytania', label: 'Morytania', badge: '/badges/morytania.png' },
    { key: 'tirannwn', label: 'Tirannwn', badge: '/badges/tirannwn.png' },
    { key: 'varlamore', label: 'Varlamore', badge: '/badges/varlamore.png' },
    { key: 'wilderness', label: 'Wilderness', badge: '/badges/wilderness.png' },
]

export const PLAYER_RELICS = [
    {
        name: 'complex',
        relics: [
            'Endless Harvest',
            'Master of Combat',
            'Avatar of Destruction',
            "Slayer's Shroud",
            'Demonic Fury',
            'Undying Retribution',
            'Eternal Champion',
            'Hellfire Embodiment',
        ],
        areas: ['asgarnia', 'kandarin', 'morytania'],
    },
    {
        name: 'Solo H',
        relics: [
            'Endless Harvest',
            'Master of Combat',
            'Avatar of Destruction',
            "Slayer's Shroud",
            'Demonic Fury',
            'Undying Retribution',
            'Eternal Champion',
            'Hellfire Embodiment',
        ],
        areas: ['asgarnia', 'kandarin', 'morytania'],
    },
    {
        name: 'hc l3sius',
        relics: [
            'Prospector',
            'Runic Mastery',
            'Guardian',
            'Treasure Hunter',
            "Death's Embrace",
            'Arcane Conduit',
            'Void Walker',
            'Rift Walker',
        ],
        areas: ['varlamore', 'kourend', 'tirannwn', 'desert'],
    },
    {
        name: 'l3sius',
        relics: [
            'Infernal Gathering',
            'Swift Spells',
            'Soul Stealer',
            'Penance Prince',
            'Dragon Slayer',
            'Blade of Fortune',
            'Blood Pact',
            'Soulbound Warrior',
        ],
        areas: ['wilderness', 'morytania', 'asgarnia'],
    },
    {
        name: 'tearavager',
        relics: [
            'Endless Harvest',
            'Master of Combat',
            'Soul Stealer',
            "Slayer's Shroud",
            'Demonic Fury',
            'Blade of Fortune',
            'Eternal Champion',
            'Soulbound Warrior',
        ],
        areas: ['karamja', 'kandarin', 'asgarnia', 'varlamore'],
    },
    {
        name: 'demonpact69',
        relics: [
            'Prospector',
            'Runic Mastery',
            'Avatar of Destruction',
            'Penance Prince',
            "Death's Embrace",
            'Undying Retribution',
            'Blood Pact',
            'Hellfire Embodiment',
        ],
        areas: ['desert', 'kourend', 'wilderness'],
    },
]
