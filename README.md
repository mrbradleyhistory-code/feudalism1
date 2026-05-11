# Fief Keeper

Fief Keeper is a browser-based classroom strategy RPG about European
feudalism. Students manage a granted fief, grow a village, respond to
historical events, maintain feudal obligations, negotiate with neighboring
fiefs, and answer review questions in a medieval tournament.

## Run locally

No installation is required for solo practice.

1. Open `index.html` in a browser.
2. Optional: serve the directory with any static file server, for example:
   `python3 -m http.server 8000`, then visit `http://localhost:8000`.

## Run multiplayer classroom mode

For persistent team saves, generated team codes, and multiple classroom worlds,
run the included no-dependency Node server:

```sh
npm start
```

Then open `http://localhost:3000`.

Default teacher login:

- Username: `teacher`
- Password: `fiefkeeper`

For classroom use, set your own credentials before starting the server:

```sh
TEACHER_USERNAME=yourname TEACHER_PASSWORD=yourpassword npm start
```

Student teams do not create accounts and do not use Google sign-in. The teacher
creates a world, shares generated team codes, and each team logs in with only
its code. Saves are written to `data/fiefkeeper-save.json`, which is ignored by
git so classroom data is not committed.

## Included systems

- Turn-based resource management with food, coin, timber, prosperity, defense,
  population, happiness, unrest, and steward XP.
- Multiplayer classroom mode with multiple worlds, generated student team
  codes, and persistent JSON-backed saves.
- Feudal system mechanics: vassalage, oaths, feudal dues, lord favor, and aid
  requests.
- Diplomacy with neighboring fiefs through trade envoys, alliances, and
  mediation.
- Light combat for border disputes using militia, defense, reputation, and
  morale.
- Peasant happiness and unrest, including rebellion consequences when unrest is
  ignored.
- Dynamic events with historically grounded explanations, including harvests,
  plague, banditry, church tithe disputes, noble marriage alliances, and
  peasant petitions.
- Difficulty scaling for replayability. Harder modes increase food pressure,
  event severity, unrest pressure, and lower rewards.
- Educational tooltips and a glossary for key terms such as fief, vassalage,
  manorialism, levy, tithe, and the three-field system.
- A guided tutorial explaining the main classroom mechanics.
- A tournament-themed review game with historically accurate multiple-choice
  questions that reward correct answers with in-game resources.
- Two built-in maps: a local fief map showing village features and a world map
  showing the player's fief in relation to other teams' fiefs.

## Classroom use

The game is designed for short classroom rounds or projected whole-class play.
Students can work individually or in small groups, explain their choices, and
connect outcomes back to historical concepts:

- Why did food shortages create political pressure?
- How did feudal obligations shape choices for local leaders?
- What tradeoffs existed between helping peasants and pleasing higher lords?
- How could diplomacy prevent conflict?
- Why did disease, weather, and harvests matter so much in premodern society?

The historical content is simplified for young learners while preserving the
core ideas: feudal relationships varied across time and place, peasants had
agency, the Church played a major social role, and village economies depended
heavily on agriculture, labor obligations, and local custom.
