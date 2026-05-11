"use strict";

const crypto = require("crypto");
const fs = require("fs/promises");
const http = require("http");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const TEACHER_USERNAME = process.env.TEACHER_USERNAME || "teacher";
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || "fiefkeeper";
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "fiefkeeper-save.json");
const PUBLIC_DIR = __dirname;
const MAX_BODY_BYTES = 1_000_000;

const sessions = new Map();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await writeStore({ worlds: [] });
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(raw);
}

async function writeStore(store) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, `${JSON.stringify(store, null, 2)}\n`);
}

function json(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function error(res, statusCode, message) {
  json(res, statusCode, { error: message });
}

function randomId(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

function generateTeamCode(existingCodes) {
  const words = ["CROWN", "MILL", "OATH", "FIELD", "KEEP", "PLOW", "HALL", "HART"];
  let code = "";
  do {
    const word = words[Math.floor(Math.random() * words.length)];
    const suffix = crypto.randomBytes(2).toString("hex").toUpperCase();
    code = `${word}-${suffix}`;
  } while (existingCodes.has(code));
  existingCodes.add(code);
  return code;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (Buffer.byteLength(raw) > MAX_BODY_BYTES) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });
    req.on("error", reject);
  });
}

function requireTeacher(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = sessions.get(token);
  if (!session || session.role !== "teacher") {
    return null;
  }
  session.lastSeenAt = new Date().toISOString();
  return session;
}

function sanitizeText(value, fallback, maxLength = 48) {
  const text = String(value || fallback)
    .replace(/[^\w\s'-]/g, "")
    .trim()
    .slice(0, maxLength);
  return text || fallback;
}

function clampInt(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, parsed));
}

function makeTeam(index, existingCodes, difficulty) {
  const grid = [
    { x: 16, y: 24 },
    { x: 44, y: 18 },
    { x: 72, y: 28 },
    { x: 28, y: 54 },
    { x: 58, y: 52 },
    { x: 82, y: 62 },
    { x: 18, y: 76 },
    { x: 48, y: 82 },
    { x: 74, y: 82 },
    { x: 36, y: 34 },
    { x: 64, y: 38 },
    { x: 88, y: 42 },
  ];
  const colors = ["#8d2e24", "#355c7d", "#356b42", "#9b6b24", "#6d4775", "#7a4b2a"];
  return {
    id: randomId("team"),
    name: `Team ${index + 1}`,
    code: generateTeamCode(existingCodes),
    color: colors[index % colors.length],
    position: grid[index % grid.length],
    difficulty,
    state: null,
    lastSavedAt: null,
    summary: {
      turn: 1,
      population: 86,
      prosperity: 34,
      defense: 26,
      happiness: 62,
      unrest: 18,
    },
  };
}

function publicTeam(team, includeCode = false) {
  const payload = {
    id: team.id,
    name: team.name,
    color: team.color,
    position: team.position,
    difficulty: team.difficulty,
    lastSavedAt: team.lastSavedAt,
    summary: team.summary,
  };
  if (includeCode) {
    payload.code = team.code;
  }
  return payload;
}

function publicWorld(world, includeCodes = false) {
  return {
    id: world.id,
    name: world.name,
    difficulty: world.difficulty,
    createdAt: world.createdAt,
    updatedAt: world.updatedAt,
    teamCount: world.teams.length,
    teams: world.teams.map((team) => publicTeam(team, includeCodes)),
  };
}

function summarizeState(state) {
  return {
    turn: Number(state.turn || 1),
    population: Number(state.population || 0),
    prosperity: Number(state.prosperity || 0),
    defense: Number(state.defense || 0),
    happiness: Number(state.happiness || 0),
    unrest: Number(state.unrest || 0),
    food: Number(state.food || 0),
    coin: Number(state.coin || 0),
    timber: Number(state.timber || 0),
  };
}

function findTeamByCode(store, code) {
  const normalized = String(code || "").trim().toUpperCase();
  for (const world of store.worlds) {
    const team = world.teams.find((candidate) => candidate.code === normalized);
    if (team) {
      return { world, team };
    }
  }
  return null;
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/status") {
    json(res, 200, {
      ok: true,
      teacherUsername: TEACHER_USERNAME,
      worldsSupported: true,
      studentDataPolicy: "Students use generated team codes; no names or emails are required.",
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/teacher/login") {
    const body = await readBody(req);
    if (body.username !== TEACHER_USERNAME || body.password !== TEACHER_PASSWORD) {
      error(res, 401, "Invalid teacher username or password.");
      return;
    }
    const token = crypto.randomBytes(24).toString("hex");
    sessions.set(token, {
      role: "teacher",
      createdAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    });
    json(res, 200, { token, username: TEACHER_USERNAME });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/teacher/worlds") {
    if (!requireTeacher(req)) {
      error(res, 401, "Teacher login required.");
      return;
    }
    const store = await readStore();
    json(res, 200, { worlds: store.worlds.map((world) => publicWorld(world, true)) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/teacher/worlds") {
    if (!requireTeacher(req)) {
      error(res, 401, "Teacher login required.");
      return;
    }
    const body = await readBody(req);
    const difficulty = ["apprentice", "balanced", "hard", "expert"].includes(body.difficulty)
      ? body.difficulty
      : "balanced";
    const teamCount = clampInt(body.teamCount, 1, 12, 4);
    const existingCodes = new Set();
    const store = await readStore();
    store.worlds.forEach((world) => {
      world.teams.forEach((team) => existingCodes.add(team.code));
    });
    const world = {
      id: randomId("world"),
      name: sanitizeText(body.name, "New Classroom World"),
      difficulty,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      teams: Array.from({ length: teamCount }, (_, index) => makeTeam(index, existingCodes, difficulty)),
    };
    store.worlds.unshift(world);
    await writeStore(store);
    json(res, 201, { world: publicWorld(world, true) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/team/login") {
    const body = await readBody(req);
    const store = await readStore();
    const match = findTeamByCode(store, body.code);
    if (!match) {
      error(res, 404, "No team was found for that code.");
      return;
    }
    json(res, 200, {
      world: publicWorld(match.world),
      team: {
        ...publicTeam(match.team),
        code: match.team.code,
        state: match.team.state,
      },
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/team/world") {
    const store = await readStore();
    const match = findTeamByCode(store, url.searchParams.get("code"));
    if (!match) {
      error(res, 404, "No team was found for that code.");
      return;
    }
    json(res, 200, { world: publicWorld(match.world), teamId: match.team.id });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/team/save") {
    const body = await readBody(req);
    if (!body.state || typeof body.state !== "object") {
      error(res, 400, "A game state object is required.");
      return;
    }
    const store = await readStore();
    const match = findTeamByCode(store, body.code);
    if (!match) {
      error(res, 404, "No team was found for that code.");
      return;
    }
    match.team.state = body.state;
    match.team.name = sanitizeText(body.state.fiefName, match.team.name);
    match.team.difficulty = body.state.difficulty || match.team.difficulty;
    match.team.summary = summarizeState(body.state);
    match.team.lastSavedAt = new Date().toISOString();
    match.world.updatedAt = match.team.lastSavedAt;
    await writeStore(store);
    json(res, 200, {
      savedAt: match.team.lastSavedAt,
      world: publicWorld(match.world),
      team: publicTeam(match.team),
    });
    return;
  }

  error(res, 404, "API route not found.");
}

async function serveStatic(req, res, url) {
  const rawPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(PUBLIC_DIR, rawPath));
  if (!filePath.startsWith(PUBLIC_DIR) || filePath.includes(`${path.sep}data${path.sep}`)) {
    error(res, 403, "Forbidden.");
    return;
  }
  try {
    const contents = await fs.readFile(filePath);
    const type = mimeTypes[path.extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(contents);
  } catch {
    error(res, 404, "File not found.");
  }
}

async function route(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    await serveStatic(req, res, url);
  } catch (err) {
    error(res, 500, err.message || "Unexpected server error.");
  }
}

ensureStore()
  .then(() => {
    http.createServer(route).listen(PORT, HOST, () => {
      console.log(`Fief Keeper server listening at http://${HOST}:${PORT}`);
      console.log(`Teacher login: ${TEACHER_USERNAME} / ${TEACHER_PASSWORD}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
