"use strict";

const seasons = ["Spring", "Summer", "Autumn", "Winter"];

const difficultySettings = {
  apprentice: {
    label: "Apprentice Steward",
    foodConsumption: 0.84,
    eventSeverity: 0.75,
    unrestPressure: 0.75,
    rewardScale: 1.2,
    rebellionLimit: 86,
    adaptiveScale: 0.6,
  },
  balanced: {
    label: "Balanced Manor",
    foodConsumption: 1,
    eventSeverity: 1,
    unrestPressure: 1,
    rewardScale: 1,
    rebellionLimit: 78,
    adaptiveScale: 1,
  },
  hard: {
    label: "Hard Winter",
    foodConsumption: 1.15,
    eventSeverity: 1.2,
    unrestPressure: 1.18,
    rewardScale: 0.9,
    rebellionLimit: 70,
    adaptiveScale: 1.25,
  },
  expert: {
    label: "Iron Crown",
    foodConsumption: 1.32,
    eventSeverity: 1.45,
    unrestPressure: 1.35,
    rewardScale: 0.8,
    rebellionLimit: 64,
    adaptiveScale: 1.5,
  },
};

const glossary = {
  Population:
    "The people who live in the fief. Most medieval villagers were peasants who farmed land in exchange for protection and rights to use fields.",
  "Food Surplus":
    "Stored grain, livestock, and produce. A surplus supports population growth; shortages create hunger and unrest.",
  Coin:
    "Money collected from rents, tolls, fairs, and trade. Coin pays for diplomacy, soldiers, and feudal dues.",
  Timber:
    "Wood used for houses, palisades, carts, and tools. Forest resources were important to medieval villages.",
  Happiness:
    "How satisfied villagers feel about taxes, food, safety, and justice. Low happiness makes unrest grow.",
  Unrest:
    "The risk of protest, refusal to work, or rebellion. Medieval peasants sometimes resisted unfair dues or hardship.",
  Vassalage:
    "A political relationship in which a vassal pledged loyalty and service to a more powerful lord in exchange for land or protection.",
  Diplomacy:
    "Negotiation between communities or leaders. In this game, diplomacy includes trade, alliances, and mediation.",
  Levy:
    "A temporary military force called up from local people. Medieval lords often relied on levies for short campaigns.",
  Manorialism:
    "The economic system of medieval estates, where peasants worked land controlled by a lord and paid rents or labor services.",
  Fief:
    "Land or rights granted by a lord to a vassal. A fief could include villages, fields, mills, or tax privileges.",
  "Feudal Dues":
    "Payments or services owed by a vassal to a lord, such as coin, military support, or attendance at court.",
  "Three-field system":
    "A farming rotation using winter crops, spring crops, and fallow land. It helped some European villages improve yields.",
  Guild:
    "An association of craftspeople or merchants that regulated training, quality, and trade in many medieval towns.",
};

const actions = [
  {
    id: "fields",
    title: "Improve Open Fields",
    description:
      "Organize crop rotation and repair drainage ditches to increase food production.",
    lesson:
      "Open-field farming and crop rotation were common in parts of medieval Europe.",
    ap: 1,
    cost: { timber: 5, coin: 4 },
    effects: { food: 18, prosperity: 5, happiness: 2, xp: 6 },
  },
  {
    id: "mill",
    title: "Repair the Lord's Mill",
    description:
      "A working mill turns grain into flour faster and raises coin through milling fees.",
    lesson:
      "Many peasants were required to use a lord's mill and pay a fee, a source of manorial income.",
    ap: 1,
    cost: { timber: 12, coin: 8 },
    effects: { coin: 15, prosperity: 7, favor: 2, xp: 7 },
  },
  {
    id: "market",
    title: "Host a Weekly Market",
    description:
      "Invite traders and craftspeople to exchange goods under your protection.",
    lesson:
      "Markets and fairs helped connect rural manors to wider trade networks.",
    ap: 1,
    cost: { food: 8, coin: 6 },
    effects: { coin: 20, prosperity: 6, happiness: 3, reputation: 3, xp: 6 },
  },
  {
    id: "commons",
    title: "Protect Common Rights",
    description:
      "Confirm village access to pasture, firewood, and gleaning after harvest.",
    lesson:
      "Common rights were important to peasant survival and could become a source of conflict.",
    ap: 1,
    cost: { coin: 5 },
    effects: { happiness: 9, unrest: -8, favor: -1, xp: 5 },
  },
  {
    id: "chapel",
    title: "Support the Parish Chapel",
    description:
      "Fund repairs and ask the priest to organize care for the sick and poor.",
    lesson:
      "The medieval Church was central to community life, charity, education, and record keeping.",
    ap: 1,
    cost: { timber: 6, coin: 10 },
    effects: { piety: 7, happiness: 5, unrest: -4, xp: 6 },
  },
  {
    id: "reeve",
    title: "Hold Manor Court",
    description:
      "Settle disputes publicly with the reeve and village elders.",
    lesson:
      "Manor courts handled local disagreements, fines, inheritance claims, and customary rules.",
    ap: 1,
    cost: { coin: 3 },
    effects: { unrest: -7, favor: 2, reputation: 2, xp: 5 },
  },
  {
    id: "workshop",
    title: "Invite Skilled Artisans",
    description:
      "Offer safe workshop space for a blacksmith, carpenter, or weaver.",
    lesson:
      "Specialized crafts supported farming, trade, and military preparedness.",
    ap: 1,
    cost: { timber: 10, coin: 12, food: 6 },
    effects: { prosperity: 8, defense: 3, coin: 10, xp: 7 },
  },
  {
    id: "scribe",
    title: "Hire a Traveling Scribe",
    description:
      "Improve records of dues, harvests, and agreements with your neighbors.",
    lesson:
      "Literacy was limited, but written charters, rolls, and accounts became increasingly important.",
    ap: 1,
    cost: { coin: 9 },
    effects: { knowledge: 8, reputation: 2, favor: 1, xp: 5 },
  },
];

const events = [
  {
    id: "bountiful-harvest",
    title: "Bountiful Harvest",
    description:
      "Warm weather and careful fieldwork produce more grain than expected.",
    history:
      "Good harvests could lower food prices and support population growth. Medieval communities often marked harvest success with church feasts.",
    weight: 1.2,
    choices: [
      {
        text: "Store the surplus in village barns",
        result: "Granaries are full, making winter safer.",
        effects: { food: 40, happiness: 3 },
      },
      {
        text: "Sell grain at market",
        result: "Merchants pay well for the extra grain.",
        effects: { coin: 32, prosperity: 5 },
      },
      {
        text: "Hold a harvest feast",
        result: "Peasants remember your generosity.",
        effects: { food: 12, happiness: 10, unrest: -6 },
      },
    ],
  },
  {
    id: "poor-harvest",
    title: "Poor Harvest",
    description:
      "Heavy rain spoils part of the crop, and villagers worry about winter.",
    history:
      "Medieval food supplies were vulnerable to weather. The Great Famine of 1315-1317 followed years of crop failure in northern Europe.",
    weight: 1,
    severity: true,
    choices: [
      {
        text: "Ration grain fairly",
        result: "Careful rationing limits panic.",
        effects: { food: -20, happiness: -2, unrest: 4 },
      },
      {
        text: "Buy grain from a neighbor",
        result: "Imported grain prevents the worst shortage.",
        cost: { coin: 15 },
        effects: { food: 24, reputation: 1 },
      },
      {
        text: "Collect dues anyway",
        result: "The lord is pleased, but villagers grumble.",
        effects: { coin: 18, favor: 5, happiness: -10, unrest: 12 },
      },
    ],
  },
  {
    id: "plague",
    title: "Sickness in the Village",
    description:
      "A dangerous illness spreads through nearby settlements.",
    history:
      "The Black Death reached Europe in the 1340s and killed a huge share of the population. This game uses a simplified disease event for classroom play.",
    weight: 0.75,
    severity: true,
    minTurn: 4,
    choices: [
      {
        text: "Quarantine travelers and care for the sick",
        result: "Trade slows, but the outbreak is contained.",
        cost: { coin: 10, food: 8 },
        effects: { population: -3, prosperity: -3, piety: 2 },
      },
      {
        text: "Ask the parish for aid",
        result: "The chapel organizes help for vulnerable families.",
        cost: { piety: 4 },
        effects: { population: -2, happiness: 4, unrest: -5 },
      },
      {
        text: "Keep markets open",
        result: "Coin still flows, but sickness spreads faster.",
        effects: { coin: 18, population: -8, happiness: -8, unrest: 10 },
      },
    ],
  },
  {
    id: "royal-summons",
    title: "Royal Summons",
    description:
      "Your lord calls vassals to provide coin or soldiers for a campaign.",
    history:
      "Feudal contracts often included military service, though obligations varied greatly by region and period.",
    weight: 0.9,
    minTurn: 3,
    choices: [
      {
        text: "Send coin and a small levy",
        result: "Your lord praises your loyalty.",
        cost: { coin: 14 },
        effects: { militia: -1, favor: 10, defense: -1 },
      },
      {
        text: "Negotiate a smaller obligation",
        result: "A careful letter wins partial relief.",
        cost: { knowledge: 4 },
        effects: { favor: 3, reputation: 4 },
      },
      {
        text: "Delay the response",
        result: "The lord's steward records your hesitation.",
        effects: { favor: -10, coin: 5, unrest: 3 },
      },
    ],
  },
  {
    id: "bandits",
    title: "Bandits on the Road",
    description:
      "Travelers report raids near the bridge, threatening trade.",
    history:
      "Road security mattered because trade routes, toll bridges, and fairs helped manors earn income.",
    weight: 1,
    severity: true,
    choices: [
      {
        text: "Send patrols",
        result: "The roads become safer.",
        cost: { food: 6 },
        effects: { militia: -1, defense: 5, prosperity: 3, reputation: 2 },
      },
      {
        text: "Pay informants",
        result: "Local knowledge helps find the raiders' camp.",
        cost: { coin: 10 },
        effects: { defense: 4, unrest: -3 },
      },
      {
        text: "Ignore the reports",
        result: "Merchants avoid your market.",
        effects: { coin: -15, prosperity: -6, happiness: -3 },
      },
    ],
  },
  {
    id: "monastery-fair",
    title: "Monastery Fair",
    description:
      "A nearby monastery invites traders, pilgrims, and scholars to a fair.",
    history:
      "Monasteries preserved manuscripts, cared for travelers, and sometimes hosted markets that supported local economies.",
    weight: 1,
    choices: [
      {
        text: "Send goods to sell",
        result: "Your village earns coin and new contacts.",
        cost: { food: 10, timber: 5 },
        effects: { coin: 34, reputation: 3, prosperity: 4 },
      },
      {
        text: "Sponsor students to learn letters",
        result: "A few villagers return with useful record-keeping skills.",
        cost: { coin: 12 },
        effects: { knowledge: 10, piety: 3 },
      },
      {
        text: "Offer charity to pilgrims",
        result: "Your generosity becomes known.",
        cost: { food: 14 },
        effects: { piety: 8, happiness: 4, reputation: 2 },
      },
    ],
  },
  {
    id: "new-plow",
    title: "A Heavy Plow Design",
    description:
      "A smith suggests improving plow blades for the heavier local soil.",
    history:
      "The heavy plow helped farming in some wetter, clay-rich parts of northern Europe, though adoption varied by place and resources.",
    weight: 0.85,
    minTurn: 2,
    choices: [
      {
        text: "Invest in better plows",
        result: "Fields become more productive.",
        cost: { coin: 18, timber: 10 },
        effects: { prosperity: 12, food: 22, knowledge: 3 },
      },
      {
        text: "Test the design on one field",
        result: "A cautious trial teaches useful lessons.",
        cost: { timber: 5 },
        effects: { prosperity: 4, food: 10, knowledge: 5 },
      },
      {
        text: "Reject the expense",
        result: "Coin is saved, but farmers miss a chance to improve yields.",
        effects: { coin: 5, happiness: -2 },
      },
    ],
  },
  {
    id: "tithe-dispute",
    title: "Tithe Dispute",
    description:
      "Villagers disagree with the priest about how much grain should go to the Church.",
    history:
      "A tithe was commonly understood as a tenth owed to support the Church, though collection practices differed.",
    weight: 0.9,
    choices: [
      {
        text: "Mediate a fair count",
        result: "The dispute cools after a public accounting.",
        cost: { knowledge: 3 },
        effects: { piety: 3, unrest: -8, reputation: 2 },
      },
      {
        text: "Support the priest fully",
        result: "The parish is pleased, but some peasants feel squeezed.",
        effects: { piety: 8, happiness: -5, unrest: 6 },
      },
      {
        text: "Reduce the burden this season",
        result: "Families have more food during a hard month.",
        cost: { coin: 8 },
        effects: { happiness: 8, unrest: -5, piety: -2 },
      },
    ],
  },
  {
    id: "peasant-petition",
    title: "Peasant Petition",
    description:
      "A group of villagers asks for relief from extra labor services.",
    history:
      "Peasants were not powerless. They bargained, used courts, fled, or rebelled when burdens seemed unjust.",
    weight: 1,
    choices: [
      {
        text: "Grant temporary relief",
        result: "Work slows, but trust improves.",
        effects: { prosperity: -3, happiness: 10, unrest: -10 },
      },
      {
        text: "Ask for coin instead of labor",
        result: "A compromise gives villagers flexibility.",
        effects: { coin: 10, happiness: 3, unrest: -3 },
      },
      {
        text: "Refuse the petition",
        result: "Short-term work continues, but anger spreads.",
        effects: { prosperity: 5, happiness: -9, unrest: 12 },
      },
    ],
  },
  {
    id: "marriage-alliance",
    title: "Noble Marriage Negotiations",
    description:
      "A neighboring household proposes a symbolic alliance feast.",
    history:
      "Marriage alliances were a major tool of medieval diplomacy among elites, linking property, loyalty, and peace.",
    weight: 0.7,
    minTurn: 5,
    choices: [
      {
        text: "Host the alliance feast",
        result: "Neighbors toast a calmer border.",
        cost: { food: 16, coin: 12 },
        effects: { reputation: 8, defense: 2, favor: 2 },
      },
      {
        text: "Send a modest gift",
        result: "The proposal remains friendly.",
        cost: { coin: 7 },
        effects: { reputation: 3 },
      },
      {
        text: "Decline publicly",
        result: "The neighbor takes offense.",
        effects: { reputation: -4, defense: -2, coin: 4 },
      },
    ],
  },
];

const questions = [
  {
    prompt: "What was a fief?",
    answers: [
      "A grant of land or rights held from a lord",
      "A tax paid only by merchants",
      "A cathedral school",
      "A type of medieval helmet",
    ],
    correct: 0,
    explanation:
      "A fief was land or rights granted by a lord, usually in return for loyalty or service.",
  },
  {
    prompt: "In feudal relationships, what did a vassal usually promise?",
    answers: [
      "Loyalty and service to a lord",
      "To abolish all taxes",
      "To become a monk",
      "To leave the village each winter",
    ],
    correct: 0,
    explanation:
      "Vassals pledged loyalty and might owe military aid, counsel, or payments depending on the agreement.",
  },
  {
    prompt: "Why were harvests so important in medieval villages?",
    answers: [
      "Most people depended on local agriculture for survival",
      "Villages were forbidden to store grain",
      "Harvests only mattered to kings",
      "Food was imported by train",
    ],
    correct: 0,
    explanation:
      "Agriculture fed the population, supplied rents, and determined whether a village had surplus or hunger.",
  },
  {
    prompt: "What was a medieval tithe commonly associated with?",
    answers: [
      "Support for the Church",
      "A knight's shield design",
      "A bridge toll paid to merchants",
      "A tournament weapon",
    ],
    correct: 0,
    explanation:
      "A tithe was commonly a portion, often described as a tenth, owed to support the Church.",
  },
  {
    prompt: "Which statement about peasants is most accurate?",
    answers: [
      "They had obligations but could still bargain, use courts, and resist",
      "They never worked the land",
      "They were all knights",
      "They had no role in the economy",
    ],
    correct: 0,
    explanation:
      "Peasants had different legal statuses and obligations, but they were active members of village society.",
  },
  {
    prompt: "What did manor courts often handle?",
    answers: [
      "Local disputes, fines, and customary rules",
      "Ocean navigation charts",
      "Printing newspapers",
      "Elections to modern parliaments",
    ],
    correct: 0,
    explanation:
      "Manor courts recorded and resolved local matters such as land transfers, fines, and disputes.",
  },
  {
    prompt: "Why might a lord want a market or fair?",
    answers: [
      "It encouraged trade and could create tolls or fees",
      "It stopped all travel",
      "It replaced farming entirely",
      "It made feudal duties disappear",
    ],
    correct: 0,
    explanation:
      "Markets and fairs brought traders, goods, and revenue to a region.",
  },
  {
    prompt: "What was a levy?",
    answers: [
      "A temporary military force raised for service",
      "A monastery library",
      "A crop disease",
      "A royal crown",
    ],
    correct: 0,
    explanation:
      "A levy was a force called up for military service, often for a limited time.",
  },
  {
    prompt: "What is one historically accurate effect of plague?",
    answers: [
      "Population could fall sharply and labor relationships could change",
      "No one changed their behavior",
      "It only affected castles",
      "It made harvests unlimited",
    ],
    correct: 0,
    explanation:
      "Major outbreaks such as the Black Death caused enormous population loss and disrupted labor and society.",
  },
  {
    prompt: "What did the three-field system try to improve?",
    answers: [
      "Crop rotation and soil use",
      "Castle wall height",
      "Knightly armor decoration",
      "The number of royal crowns",
    ],
    correct: 0,
    explanation:
      "The three-field system rotated crops and fallow land to support better long-term yields.",
  },
];

const tutorialSteps = [
  {
    title: "Welcome to Your Fief",
    body:
      "You are the steward of a medieval fief. Your job is to keep villagers fed, maintain loyalty to a higher lord, and build prosperity without causing rebellion.",
  },
  {
    title: "Resources and Population",
    body:
      "Food, coin, and timber are spent on actions. Population grows when the village is safe and well fed, but hunger, plague, and combat can reduce it.",
  },
  {
    title: "Action Points",
    body:
      "Each turn gives 3 action points. Steward actions improve fields, markets, courts, churches, workshops, and records. Tooltips explain historical terms.",
  },
  {
    title: "Feudal Obligations",
    body:
      "You are a vassal of Countess Matilda. Renewing oaths, sending dues, or requesting aid changes your lord's favor. Ignoring obligations can create penalties.",
  },
  {
    title: "Happiness and Unrest",
    body:
      "Happiness reflects village wellbeing. Unrest rises when people are hungry, overtaxed, or unsafe. If unrest becomes too high, a rebellion can damage the fief.",
  },
  {
    title: "Events and Difficulty",
    body:
      "Dynamic events represent challenges and opportunities such as harvests, sickness, bandits, fairs, and petitions. Higher difficulties make shortages and unrest more dangerous.",
  },
  {
    title: "Tournament Review",
    body:
      "The tournament is a history review game. Correct answers earn resources and score, making content knowledge directly useful for your village strategy.",
  },
];

const initialState = {
  fiefName: "Oakbridge",
  difficulty: "balanced",
  turn: 1,
  seasonIndex: 0,
  actionPoints: 3,
  population: 86,
  food: 118,
  coin: 62,
  timber: 54,
  prosperity: 34,
  defense: 26,
  happiness: 62,
  unrest: 18,
  favor: 52,
  militia: 7,
  piety: 8,
  knowledge: 5,
  reputation: 12,
  xp: 0,
  tournamentScore: 0,
  questionIndex: 0,
  event: null,
  eventResolved: true,
  lord: {
    name: "Countess Matilda of the River March",
    duesDue: 0,
    aidCooldown: 0,
  },
  neighbors: [
    { name: "Stoneford", focus: "quarry village", trust: 45, treaty: false },
    { name: "Larkwell", focus: "market hamlet", trust: 58, treaty: false },
    { name: "Redmere", focus: "border manor", trust: 35, treaty: false },
  ],
  log: [
    "You receive Oakbridge as a fief and swear to govern it wisely.",
  ],
};

let state = cloneData(initialState);
let tutorialIndex = 0;
let answeredQuestion = false;
let selectedAnswer = null;

const el = {
  fiefName: document.querySelector("#fiefName"),
  renameFief: document.querySelector("#renameFief"),
  difficultySelect: document.querySelector("#difficultySelect"),
  tutorialButton: document.querySelector("#tutorialButton"),
  populationValue: document.querySelector("#populationValue"),
  populationTrend: document.querySelector("#populationTrend"),
  foodValue: document.querySelector("#foodValue"),
  coinValue: document.querySelector("#coinValue"),
  timberValue: document.querySelector("#timberValue"),
  happinessValue: document.querySelector("#happinessValue"),
  happinessWarning: document.querySelector("#happinessWarning"),
  unrestValue: document.querySelector("#unrestValue"),
  unrestWarning: document.querySelector("#unrestWarning"),
  turnValue: document.querySelector("#turnValue"),
  fiefTitle: document.querySelector("#fiefTitle"),
  seasonValue: document.querySelector("#seasonValue"),
  prosperityBar: document.querySelector("#prosperityBar"),
  defenseBar: document.querySelector("#defenseBar"),
  favorBar: document.querySelector("#favorBar"),
  villageNarrative: document.querySelector("#villageNarrative"),
  resourceList: document.querySelector("#resourceList"),
  actionPointsValue: document.querySelector("#actionPointsValue"),
  actionList: document.querySelector("#actionList"),
  endTurnButton: document.querySelector("#endTurnButton"),
  lordStatus: document.querySelector("#lordStatus"),
  pledgeButton: document.querySelector("#pledgeButton"),
  sendTaxButton: document.querySelector("#sendTaxButton"),
  requestAidButton: document.querySelector("#requestAidButton"),
  diplomacyList: document.querySelector("#diplomacyList"),
  trainButton: document.querySelector("#trainButton"),
  patrolButton: document.querySelector("#patrolButton"),
  skirmishButton: document.querySelector("#skirmishButton"),
  combatResult: document.querySelector("#combatResult"),
  eventTitle: document.querySelector("#eventTitle"),
  eventDescription: document.querySelector("#eventDescription"),
  eventHistory: document.querySelector("#eventHistory"),
  eventChoices: document.querySelector("#eventChoices"),
  tournamentScore: document.querySelector("#tournamentScore"),
  questionCard: document.querySelector("#questionCard"),
  answerList: document.querySelector("#answerList"),
  nextQuestionButton: document.querySelector("#nextQuestionButton"),
  glossaryList: document.querySelector("#glossaryList"),
  logList: document.querySelector("#logList"),
  resetButton: document.querySelector("#resetButton"),
  tooltipBubble: document.querySelector("#tooltipBubble"),
  tutorialDialog: document.querySelector("#tutorialDialog"),
  tutorialTitle: document.querySelector("#tutorialTitle"),
  tutorialBody: document.querySelector("#tutorialBody"),
  tutorialProgress: document.querySelector("#tutorialProgress"),
  closeTutorial: document.querySelector("#closeTutorial"),
  prevTutorial: document.querySelector("#prevTutorial"),
  nextTutorial: document.querySelector("#nextTutorial"),
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function signed(value) {
  return value > 0 ? `+${value}` : String(value);
}

function formatCost(cost = {}) {
  const entries = Object.entries(cost);
  if (!entries.length) {
    return "No cost";
  }
  return entries.map(([resource, amount]) => `${amount} ${resource}`).join(", ");
}

function canAfford(cost = {}) {
  return Object.entries(cost).every(([resource, amount]) => state[resource] >= amount);
}

function payCost(cost = {}) {
  if (!canAfford(cost)) {
    return false;
  }
  Object.entries(cost).forEach(([resource, amount]) => {
    state[resource] -= amount;
  });
  return true;
}

function difficulty() {
  return difficultySettings[state.difficulty];
}

function currentPressure() {
  const thriving = state.prosperity + state.food / 5 + state.coin / 4;
  const hardship = state.unrest + Math.max(0, 50 - state.happiness);
  return clamp((thriving - hardship) / 100, 0, 1.2) * difficulty().adaptiveScale;
}

function scaledEffect(resource, amount) {
  if (amount >= 0) {
    return Math.round(amount * difficulty().rewardScale);
  }
  const challengeScale = difficulty().eventSeverity + currentPressure() * 0.15;
  if (["happiness", "favor", "prosperity", "defense", "population"].includes(resource)) {
    return Math.round(amount * challengeScale);
  }
  return Math.round(amount * (difficulty().eventSeverity + currentPressure() * 0.1));
}

function applyEffects(effects = {}, options = {}) {
  Object.entries(effects).forEach(([resource, rawAmount]) => {
    const amount = options.scale ? scaledEffect(resource, rawAmount) : rawAmount;
    state[resource] = (state[resource] ?? 0) + amount;
  });
  normalizeState();
}

function normalizeState() {
  state.population = clamp(Math.round(state.population), 12, 260);
  state.food = clamp(Math.round(state.food), 0, 999);
  state.coin = clamp(Math.round(state.coin), 0, 999);
  state.timber = clamp(Math.round(state.timber), 0, 999);
  state.prosperity = clamp(Math.round(state.prosperity), 0, 100);
  state.defense = clamp(Math.round(state.defense), 0, 100);
  state.happiness = clamp(Math.round(state.happiness), 0, 100);
  state.unrest = clamp(Math.round(state.unrest), 0, 100);
  state.favor = clamp(Math.round(state.favor), 0, 100);
  state.militia = clamp(Math.round(state.militia), 0, 60);
  state.piety = clamp(Math.round(state.piety), 0, 100);
  state.knowledge = clamp(Math.round(state.knowledge), 0, 100);
  state.reputation = clamp(Math.round(state.reputation), 0, 100);
  state.xp = clamp(Math.round(state.xp), 0, 999);
  state.neighbors.forEach((neighbor) => {
    neighbor.trust = clamp(Math.round(neighbor.trust), 0, 100);
  });
}

function log(message) {
  state.log.unshift(`Turn ${state.turn}: ${message}`);
  state.log = state.log.slice(0, 14);
}

function effectSummary(effects = {}, scale = false) {
  return Object.entries(effects)
    .map(([resource, amount]) => {
      const display = scale ? scaledEffect(resource, amount) : amount;
      return `${resource} ${signed(display)}`;
    })
    .join(", ");
}

function makeButton(label, onClick, options = {}) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  if (options.className) {
    button.className = options.className;
  }
  if (options.disabled) {
    button.disabled = true;
  }
  button.addEventListener("click", onClick);
  return button;
}

function render() {
  normalizeState();
  const season = seasons[state.seasonIndex];
  el.fiefName.value = state.fiefName;
  el.difficultySelect.value = state.difficulty;
  el.populationValue.textContent = state.population;
  el.foodValue.textContent = state.food;
  el.coinValue.textContent = state.coin;
  el.timberValue.textContent = state.timber;
  el.happinessValue.textContent = state.happiness;
  el.unrestValue.textContent = state.unrest;
  el.turnValue.textContent = state.turn;
  el.fiefTitle.textContent = state.fiefName;
  el.seasonValue.textContent = season;
  el.actionPointsValue.textContent = state.actionPoints;
  el.tournamentScore.textContent = state.tournamentScore;
  el.prosperityBar.style.width = `${state.prosperity}%`;
  el.defenseBar.style.width = `${state.defense}%`;
  el.favorBar.style.width = `${state.favor}%`;
  el.happinessWarning.textContent = state.happiness < 35 ? "Villagers are angry" : state.happiness < 55 ? "Needs attention" : "Mostly content";
  el.unrestWarning.textContent = state.unrest > 70 ? "Rebellion risk" : state.unrest > 45 ? "Tension rising" : "Low risk";
  el.populationTrend.textContent = populationTrendText();
  el.villageNarrative.textContent = villageNarrative();
  renderResourceList();
  renderActions();
  renderLord();
  renderDiplomacy();
  renderEvent();
  renderQuestion();
  renderGlossary();
  renderLog();
}

function populationTrendText() {
  if (state.food < state.population * 0.25) return "Food shortage";
  if (state.happiness > 70 && state.unrest < 25) return "Families growing";
  if (state.unrest > 65) return "People may flee";
  return "Stable";
}

function villageNarrative() {
  if (state.unrest >= difficulty().rebellionLimit - 5) {
    return "Rumors of rebellion spread near the tavern. Fair justice and food relief are urgent.";
  }
  if (state.food < state.population * 0.3) {
    return "Granaries are thin. A food shortage could quickly become a political crisis.";
  }
  if (state.favor < 25) {
    return "Your higher lord is losing patience. Feudal obligations need attention.";
  }
  if (state.prosperity > 70 && state.happiness > 65) {
    return "The fief is becoming a model manor: productive, orderly, and respected.";
  }
  return "Your village balances harvests, duties, and local needs under the watchful eyes of lord and peasants.";
}

function renderResourceList() {
  const resources = [
    ["Militia", state.militia, "Trained villagers available for defense and disputes."],
    ["Piety", state.piety, "Goodwill with parish and religious institutions."],
    ["Knowledge", state.knowledge, "Records, literacy, and practical learning."],
    ["Reputation", state.reputation, "How other fiefs perceive your leadership."],
    ["Feudal Dues Due", state.lord.duesDue, "Unpaid obligations to your lord."],
    ["Steward XP", state.xp, "Represents learning from decisions and events."],
  ];
  el.resourceList.replaceChildren(
    ...resources.map(([label, value, note]) => {
      const row = document.createElement("div");
      row.innerHTML = `<strong>${label}: ${value}</strong><br><small>${note}</small>`;
      return row;
    }),
  );
}

function renderActions() {
  el.actionList.replaceChildren(
    ...actions.map((action) => {
      const card = document.createElement("div");
      card.className = "action-card";
      const disabled = state.actionPoints < action.ap || !canAfford(action.cost);
      card.innerHTML = `
        <header>
          <h3>${action.title}</h3>
          <span class="pill">${action.ap} AP</span>
        </header>
        <p>${action.description}</p>
        <small class="cost">Cost: ${formatCost(action.cost)}. Effect: ${effectSummary(action.effects)}.</small>
        <small>${action.lesson}</small>
      `;
      card.append(
        makeButton("Choose action", () => useAction(action.id), {
          disabled,
          className: "secondary",
        }),
      );
      return card;
    }),
  );
}

function renderLord() {
  const dueText = state.lord.duesDue
    ? `${state.lord.duesDue} coin in dues is expected.`
    : "No dues are currently outstanding.";
  el.lordStatus.innerHTML = `
    <div class="lord-card">
      <strong>${state.lord.name}</strong>
      <p>Favor: ${state.favor}/100. ${dueText}</p>
      <small>Keep favor high to receive aid, but remember that pushing peasants too hard raises unrest.</small>
    </div>
  `;
  el.pledgeButton.disabled = state.actionPoints < 1;
  el.sendTaxButton.disabled = state.lord.duesDue <= 0 || state.coin < state.lord.duesDue;
  el.requestAidButton.disabled = state.lord.aidCooldown > 0 || state.favor < 38;
}

function renderDiplomacy() {
  el.diplomacyList.replaceChildren(
    ...state.neighbors.map((neighbor, index) => {
      const card = document.createElement("div");
      card.className = "neighbor-card";
      card.innerHTML = `
        <header>
          <h3>${neighbor.name}</h3>
          <span class="pill">${neighbor.trust} trust</span>
        </header>
        <p>${neighbor.name} is a ${neighbor.focus}. ${neighbor.treaty ? "A treaty is active." : "No treaty yet."}</p>
      `;
      const controls = document.createElement("div");
      controls.className = "button-grid";
      controls.append(
        makeButton("Trade Envoy", () => diplomacyAction(index, "trade"), {
          disabled: state.actionPoints < 1 || state.coin < 4,
        }),
        makeButton("Offer Alliance", () => diplomacyAction(index, "alliance"), {
          disabled: state.actionPoints < 1 || state.reputation < 10 || neighbor.treaty,
        }),
        makeButton("Mediate Dispute", () => diplomacyAction(index, "mediate"), {
          disabled: state.actionPoints < 1 || state.knowledge < 3,
        }),
      );
      card.append(controls);
      return card;
    }),
  );
}

function renderEvent() {
  if (!state.event || state.eventResolved) {
    el.eventTitle.textContent = "Awaiting Court News";
    el.eventDescription.textContent =
      "End the turn to draw a new event. Events are weighted by difficulty, season, and how prosperous your fief has become.";
    el.eventHistory.textContent =
      "Historical note: medieval life was shaped by local harvests, disease, legal customs, warfare, religion, and trade.";
    el.eventChoices.replaceChildren();
    return;
  }

  el.eventTitle.textContent = state.event.title;
  el.eventDescription.textContent = state.event.description;
  el.eventHistory.textContent = `Historical example: ${state.event.history}`;
  el.eventChoices.replaceChildren(
    ...state.event.choices.map((choice) => {
      const disabled = !canAfford(choice.cost);
      const label = `${choice.text}${choice.cost ? ` (${formatCost(choice.cost)})` : ""}`;
      const button = makeButton(label, () => resolveEvent(choice), {
        disabled,
        className: "answer-button",
      });
      button.title = `Result: ${effectSummary(choice.effects, Boolean(state.event.severity))}`;
      return button;
    }),
  );
}

function renderQuestion() {
  const question = questions[state.questionIndex];
  el.questionCard.innerHTML = `<strong>Joust ${state.questionIndex + 1} of ${questions.length}</strong><p>${question.prompt}</p>`;
  el.answerList.replaceChildren(
    ...question.answers.map((answer, index) => {
      const button = makeButton(answer, () => answerQuestion(index), {
        className: "answer-button",
        disabled: answeredQuestion,
      });
      if (answeredQuestion) {
        if (index === question.correct) {
          button.classList.add("correct");
        } else if (index === selectedAnswer) {
          button.classList.add("incorrect");
        }
      }
      return button;
    }),
  );
}

function renderGlossary() {
  el.glossaryList.replaceChildren(
    ...Object.entries(glossary).map(([term, definition]) => {
      const item = document.createElement("div");
      item.innerHTML = `<strong>${term}</strong><br><small>${definition}</small>`;
      return item;
    }),
  );
}

function renderLog() {
  el.logList.replaceChildren(
    ...state.log.map((entry) => {
      const item = document.createElement("li");
      item.textContent = entry;
      return item;
    }),
  );
}

function useAction(id) {
  const action = actions.find((item) => item.id === id);
  if (!action || state.actionPoints < action.ap || !payCost(action.cost)) {
    return;
  }
  state.actionPoints -= action.ap;
  applyEffects(action.effects);
  log(`${action.title}: ${action.lesson}`);
  render();
}

function renewOath() {
  if (state.actionPoints < 1) return;
  state.actionPoints -= 1;
  applyEffects({ favor: 8, reputation: 2, unrest: -1, xp: 4 });
  log("You renew your oath of loyalty and receive public recognition from your lord.");
  render();
}

function sendDues() {
  if (state.lord.duesDue <= 0 || state.coin < state.lord.duesDue) return;
  const paid = state.lord.duesDue;
  state.coin -= paid;
  state.lord.duesDue = 0;
  applyEffects({ favor: 12, reputation: 2 });
  log(`You send ${paid} coin in feudal dues to your lord.`);
  render();
}

function requestAid() {
  if (state.lord.aidCooldown > 0 || state.favor < 38) return;
  state.lord.aidCooldown = 4;
  applyEffects({ food: 24, timber: 12, favor: -12, happiness: 3 });
  log("Your lord sends emergency aid, expecting future loyalty in return.");
  render();
}

function diplomacyAction(index, type) {
  const neighbor = state.neighbors[index];
  if (!neighbor || state.actionPoints < 1) return;

  if (type === "trade") {
    if (!payCost({ coin: 4 })) return;
    state.actionPoints -= 1;
    neighbor.trust += 7;
    applyEffects({ coin: 12, prosperity: 3, reputation: 1 });
    log(`A trade envoy to ${neighbor.name} improves trust and brings useful goods.`);
  }

  if (type === "alliance") {
    if (state.reputation < 10 || neighbor.treaty) return;
    state.actionPoints -= 1;
    neighbor.treaty = true;
    neighbor.trust += 12;
    applyEffects({ reputation: 5, defense: 4, favor: 1 });
    log(`${neighbor.name} agrees to a mutual defense and trade understanding.`);
  }

  if (type === "mediate") {
    if (state.knowledge < 3) return;
    state.actionPoints -= 1;
    state.knowledge -= 3;
    neighbor.trust += 10;
    applyEffects({ unrest: -4, reputation: 3, xp: 4 });
    log(`You mediate a boundary disagreement with ${neighbor.name}.`);
  }

  render();
}

function trainMilitia() {
  if (state.actionPoints < 1 || !payCost({ food: 5, coin: 5 })) return;
  state.actionPoints -= 1;
  applyEffects({ militia: 2, defense: 5, happiness: -1, xp: 4 });
  el.combatResult.textContent = "The levy drills with spears and shields. Defense improves.";
  log("Militia training raises preparedness, though farmers grumble about time away from fields.");
  render();
}

function patrolBorders() {
  if (state.actionPoints < 1 || state.militia < 1) return;
  state.actionPoints -= 1;
  const success = randomInt(1, 100) + state.defense + state.reputation > 95;
  if (success) {
    applyEffects({ defense: 4, reputation: 2, unrest: -3 });
    el.combatResult.textContent = "The patrol deters raiders and reassures travelers.";
    log("Border patrols make roads safer.");
  } else {
    applyEffects({ militia: -1, defense: 1, happiness: -2 });
    el.combatResult.textContent = "A patrol gets lost in bad weather; one levy member returns injured.";
    log("A difficult patrol reminds villagers that local warfare was risky.");
  }
  render();
}

function settleDispute() {
  if (state.actionPoints < 1 || state.militia < 2) return;
  state.actionPoints -= 1;
  const weakestNeighbor = [...state.neighbors].sort((a, b) => a.trust - b.trust)[0];
  const roll = randomInt(1, 100) + state.defense + state.militia * 2 + state.happiness / 2;
  const threshold = 125 + difficulty().eventSeverity * 10 - weakestNeighbor.trust / 4;
  if (roll >= threshold) {
    applyEffects({ coin: 18, defense: 3, reputation: 4, unrest: -2 });
    weakestNeighbor.trust = Math.max(0, weakestNeighbor.trust - 4);
    el.combatResult.textContent =
      `Your levy wins a short border dispute with ${weakestNeighbor.name}.`;
    log(`A brief skirmish with ${weakestNeighbor.name} ends in your favor.`);
  } else {
    applyEffects({ militia: -2, coin: -10, happiness: -6, unrest: 8, defense: -3 });
    weakestNeighbor.trust = Math.max(0, weakestNeighbor.trust - 8);
    el.combatResult.textContent =
      `The dispute with ${weakestNeighbor.name} goes badly and villagers question your judgment.`;
    log(`A failed border skirmish with ${weakestNeighbor.name} raises unrest.`);
  }
  render();
}

function drawEvent() {
  const pool = events.filter((event) => !event.minTurn || state.turn >= event.minTurn);
  const weighted = pool.map((event) => {
    let weight = event.weight;
    if (event.severity) weight *= difficulty().eventSeverity + currentPressure() * 0.25;
    if (event.id === "bountiful-harvest" && seasons[state.seasonIndex] === "Autumn") weight *= 1.6;
    if (event.id === "poor-harvest" && seasons[state.seasonIndex] === "Autumn") weight *= 1.25;
    if (event.id === "plague" && state.population > 110) weight *= 1.35;
    if (event.id === "peasant-petition" && state.unrest > 45) weight *= 1.6;
    return { event, weight };
  });
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) {
      return cloneData(item.event);
    }
  }
  return cloneData(weighted[weighted.length - 1].event);
}

function resolveEvent(choice) {
  if (!state.event || !payCost(choice.cost)) return;
  applyEffects(choice.effects, { scale: Boolean(state.event.severity) });
  log(`${state.event.title}: ${choice.result}`);
  state.eventResolved = true;
  state.event = null;
  render();
}

function answerQuestion(index) {
  if (answeredQuestion) return;
  const question = questions[state.questionIndex];
  answeredQuestion = true;
  selectedAnswer = index;
  if (index === question.correct) {
    const reward = Math.round(12 * difficulty().rewardScale);
    state.tournamentScore += 1;
    applyEffects({ coin: reward, food: reward, reputation: 2, knowledge: 2 });
    log(`Tournament success: correct answer. ${question.explanation}`);
  } else {
    applyEffects({ knowledge: 1 });
    log(`Tournament lesson: ${question.explanation}`);
  }
  render();
}

function nextQuestion() {
  state.questionIndex = (state.questionIndex + 1) % questions.length;
  answeredQuestion = false;
  selectedAnswer = null;
  renderQuestion();
}

function endTurn() {
  if (state.event && !state.eventResolved) {
    log("The court waits for your decision on the current event before time can move on.");
    render();
    return;
  }

  const season = seasons[state.seasonIndex];
  const productionBonus = season === "Autumn" ? 1.25 : season === "Winter" ? 0.75 : 1;
  const foodProduced = Math.round((state.population * 0.2 + state.prosperity * 0.45) * productionBonus);
  const coinProduced = Math.round(state.population * 0.09 + state.prosperity * 0.18 + state.reputation * 0.04);
  const timberProduced = season === "Winter" ? 7 : 12;
  const foodNeeded = Math.round(state.population * 0.24 * difficulty().foodConsumption);
  state.food += foodProduced - foodNeeded;
  state.coin += coinProduced;
  state.timber += timberProduced;

  if (state.food < 0) {
    const shortage = Math.abs(state.food);
    state.food = 0;
    applyEffects({
      happiness: -Math.ceil(shortage / 3),
      unrest: Math.ceil(shortage / 2),
      population: -Math.ceil(shortage / 8),
    });
    log("Food runs short, increasing hunger and unrest.");
  } else if (state.food > state.population * 0.8 && state.happiness > 55) {
    const growth = clamp(Math.round((state.happiness - 45) / 18), 1, 5);
    applyEffects({ population: growth, happiness: 1 });
    log(`A stable food supply helps ${growth} new villagers settle or start families.`);
  }

  const unrestDrift = Math.round(
    (Math.max(0, 45 - state.happiness) / 7 + Math.max(0, state.lord.duesDue - 12) / 8) *
      difficulty().unrestPressure,
  );
  const calmDrift = state.happiness > 65 && state.food > state.population * 0.45 ? -3 : 0;
  applyEffects({
    unrest: unrestDrift + calmDrift,
    happiness: state.unrest > 55 ? -2 : 1,
  });

  state.seasonIndex = (state.seasonIndex + 1) % seasons.length;
  state.turn += 1;
  state.actionPoints = 3;
  if (state.turn % 4 === 0) {
    const dues = Math.round(12 + state.prosperity / 8 + difficulty().eventSeverity * 3);
    state.lord.duesDue += dues;
    log(`${dues} coin in feudal dues is now expected by your higher lord.`);
  }
  if (state.lord.duesDue > 30) {
    applyEffects({ favor: -5, unrest: 3 });
    log("Overdue feudal dues damage your lord's favor and village confidence.");
  }
  if (state.lord.aidCooldown > 0) {
    state.lord.aidCooldown -= 1;
  }
  checkRebellion();
  state.event = drawEvent();
  state.eventResolved = false;
  log(`${season} ends. Produced ${foodProduced} food, ${coinProduced} coin, and ${timberProduced} timber; consumed ${foodNeeded} food.`);
  render();
}

function checkRebellion() {
  const limit = difficulty().rebellionLimit;
  if (state.unrest < limit) {
    return;
  }
  const damage = Math.round((state.unrest - 40) * difficulty().eventSeverity);
  applyEffects({
    coin: -Math.round(damage / 2),
    food: -Math.round(damage / 2),
    timber: -Math.round(damage / 3),
    prosperity: -12,
    defense: -6,
    happiness: -8,
    unrest: -28,
    population: -4,
  });
  log("Rebellion erupts after unrest grows too high. The fief survives, but stores and trust are damaged.");
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showTooltip(event) {
  const target = event.target.closest("[data-term]");
  if (!target) return;
  const term = target.dataset.term;
  const definition = glossary[term];
  if (!definition) return;
  el.tooltipBubble.innerHTML = `<strong>${term}</strong>${definition}`;
  el.tooltipBubble.style.display = "block";
  const rect = target.getBoundingClientRect();
  const left = clamp(rect.left, 12, window.innerWidth - 360);
  el.tooltipBubble.style.left = `${left}px`;
  el.tooltipBubble.style.top = `${rect.bottom + 8}px`;
}

function hideTooltip() {
  el.tooltipBubble.style.display = "none";
}

function renderTutorial() {
  const step = tutorialSteps[tutorialIndex];
  el.tutorialTitle.textContent = step.title;
  el.tutorialBody.textContent = step.body;
  el.prevTutorial.disabled = tutorialIndex === 0;
  el.nextTutorial.textContent = tutorialIndex === tutorialSteps.length - 1 ? "Finish" : "Next";
  el.tutorialProgress.replaceChildren(
    ...tutorialSteps.map((_, index) => {
      const dot = document.createElement("i");
      if (index <= tutorialIndex) dot.className = "active";
      return dot;
    }),
  );
}

function openTutorial() {
  tutorialIndex = 0;
  renderTutorial();
  if (typeof el.tutorialDialog.showModal === "function") {
    el.tutorialDialog.showModal();
  } else {
    el.tutorialDialog.setAttribute("open", "");
  }
}

function changeTutorial(delta) {
  if (tutorialIndex === tutorialSteps.length - 1 && delta > 0) {
    el.tutorialDialog.close();
    return;
  }
  tutorialIndex = clamp(tutorialIndex + delta, 0, tutorialSteps.length - 1);
  renderTutorial();
}

function resetGame() {
  const difficultyValue = state.difficulty;
  state = cloneData(initialState);
  state.difficulty = difficultyValue;
  answeredQuestion = false;
  selectedAnswer = null;
  el.combatResult.textContent = "";
  log("The fief is reset for a new classroom run.");
  render();
}

function renameFief() {
  const name = el.fiefName.value.trim();
  if (!name) return;
  state.fiefName = name;
  log(`The charter now names the fief ${name}.`);
  render();
}

function changeDifficulty() {
  state.difficulty = el.difficultySelect.value;
  log(`Difficulty set to ${difficulty().label}. Scaling changes future food pressure, events, and rewards.`);
  render();
}

function bindEvents() {
  el.renameFief.addEventListener("click", renameFief);
  el.difficultySelect.addEventListener("change", changeDifficulty);
  el.tutorialButton.addEventListener("click", openTutorial);
  el.endTurnButton.addEventListener("click", endTurn);
  el.pledgeButton.addEventListener("click", renewOath);
  el.sendTaxButton.addEventListener("click", sendDues);
  el.requestAidButton.addEventListener("click", requestAid);
  el.trainButton.addEventListener("click", trainMilitia);
  el.patrolButton.addEventListener("click", patrolBorders);
  el.skirmishButton.addEventListener("click", settleDispute);
  el.nextQuestionButton.addEventListener("click", nextQuestion);
  el.resetButton.addEventListener("click", resetGame);
  el.closeTutorial.addEventListener("click", () => el.tutorialDialog.close());
  el.prevTutorial.addEventListener("click", () => changeTutorial(-1));
  el.nextTutorial.addEventListener("click", () => changeTutorial(1));
  document.addEventListener("mouseover", showTooltip);
  document.addEventListener("focusin", showTooltip);
  document.addEventListener("mouseout", hideTooltip);
  document.addEventListener("focusout", hideTooltip);
}

bindEvents();
render();
