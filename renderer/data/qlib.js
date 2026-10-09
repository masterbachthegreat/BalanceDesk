// Balance Desk — question library core.
// QUESTIONS holds every question. Fixed ones carry their own text; templates carry a gen() function
// that builds the text and the correct answer from random numbers (the game does the maths, not the AI).

window.PERSONAS = {
  olena:   { name: 'Olena Kovalenko',  role: 'Bakery owner, Lviv',             hue: 28 },
  marco:   { name: 'Marco Rossi',      role: 'Economics student',              hue: 200 },
  priya:   { name: 'Priya Nair',       role: 'Freelance designer',             hue: 320 },
  tom:     { name: 'Tom Fischer',      role: 'First-time investor',            hue: 140 },
  kat:     { name: 'Kateryna Bondar',  role: 'Startup founder',                hue: 265 },
  brandt:  { name: 'Herr Brandt',      role: 'Retired engineer',               hue: 45 },
  adeyemi: { name: 'Funmi Adeyemi',    role: 'CFO, Adeyemi Industrial',        hue: 170 },
  jonas:   { name: 'Jonas Weber',      role: 'Business journalist',            hue: 0 },
  lena:    { name: 'Lena Hoffmann',    role: 'Accounting student',             hue: 290 },
  diego:   { name: 'Diego Alvarez',    role: 'Restaurant manager',             hue: 15 },
  yuki:    { name: 'Yuki Tanaka',      role: 'Equity analyst intern',          hue: 190 },
  sam:     { name: 'Sam Okafor',       role: 'Bank loan officer',              hue: 100 },
  anna:    { name: 'Anna Novak',       role: 'Economics teacher',              hue: 340 },
  felix:   { name: 'Felix Braun',      role: 'FX & derivatives trader',        hue: 225 },
  ingrid:  { name: 'Ingrid Larsen',    role: 'Pension fund trustee',           hue: 60 },
  raj:     { name: 'Raj Mehta',        role: 'E-commerce founder',             hue: 250 },
  clara:   { name: 'Clara Weiss',      role: 'Junior auditor',                 hue: 305 },
  omar:    { name: 'Omar Haddad',      role: 'Development economist',          hue: 125 },
  sofia:   { name: 'Sofia Marino',     role: 'Policy analyst, finance ministry', hue: 5 },
  mikko:   { name: 'Mikko Virtanen',   role: 'Property investor',              hue: 35 },
  hana:    { name: 'Hana Kim',         role: 'Behavioural economics PhD',      hue: 275 },
  pavlo:   { name: 'Pavlo Shevchenko', role: 'Grain farmer, Poltava',          hue: 52 }
};

window.TIERS = [
  null,
  { name: 'Trainee',       xp: 0 },
  { name: 'Junior Agent',  xp: 300 },
  { name: 'Agent',         xp: 900 },
  { name: 'Senior Agent',  xp: 2000 },
  { name: 'Specialist',    xp: 3800 },
  { name: 'Chief Analyst', xp: 6500 }
];

window.QUESTIONS = [];
window.TEMPLATES = {};

// Fixed questions. rows: [persona, tier, msg, hint, answer, keys]. Ids are `${prefix}-001`…
// Only ever APPEND rows to a block; inserting shifts ids and confuses old save files.
window.B = function (prefix, topic, rows) {
  rows.forEach((r, i) => {
    const [persona, tier, msg, hint, answer, keys] = r;
    QUESTIONS.push({ id: `${prefix}-${String(i + 1).padStart(3, '0')}`, persona, tier, topic, msg, hint, answer, keys });
  });
};

// Single fixed question with an explicit id (used for the original bank).
window.FQ = function (q) { QUESTIONS.push(q); };

// Templates: { id, tier, topic, personas:[…], reps?, gen(r, pid) → { msg, hint, answer, keys } }
window.TPL = function (def) {
  TEMPLATES[def.id] = def;
  QUESTIONS.push({ id: def.id, tier: def.tier, topic: def.topic, personas: def.personas, template: true, reps: def.reps || 2 });
};

// Seeded random helpers handed to gen().
window.makeRng = function (seed) {
  let a = seed >>> 0;
  const f = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const r = {
    f,
    int: (lo, hi) => lo + Math.floor(f() * (hi - lo + 1)),
    step: (lo, hi, s) => +(lo + Math.floor(f() * (Math.round((hi - lo) / s) + 1)) * s).toFixed(6),
    pick: (arr) => arr[Math.floor(f() * arr.length)],
    chance: (p) => f() < p
  };
  return r;
};

// Formatting helpers (used in template text). They round for display only.
window.FMT = {
  n: (x, d = 0) => Number(x).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }),
  nt: (x, d = 2) => Number(x).toLocaleString('en-US', { maximumFractionDigits: d }),      // trims trailing zeros
  e: (x, d = 0) => (x < 0 ? '−€' : '€') + Math.abs(x).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }),
  p: (x, d = 2) => (x < 0 ? '−' : '') + Math.abs(x * 100).toLocaleString('en-US', { maximumFractionDigits: d }) + '%',
  pp: (x, d = 2) => (x * 100).toLocaleString('en-US', { maximumFractionDigits: d }),        // number only, no % sign
  sgn: (x, d = 2) => (x >= 0 ? '+' : '−') + Math.abs(x * 100).toLocaleString('en-US', { maximumFractionDigits: d }) + '%'
};
