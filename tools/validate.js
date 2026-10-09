// Validates the question bank: unique ids, known personas/topics, fuzzes every template.
const vm = require('vm'), fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'renderer', 'data');
const ctx = { window: {}, console }; ctx.window = ctx; vm.createContext(ctx);
const order = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
for (const f of order) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f });
const { QUESTIONS, TEMPLATES, PERSONAS, makeRng } = ctx;
let errs = [], ids = new Set();
for (const q of QUESTIONS) {
  if (ids.has(q.id)) errs.push('dup id ' + q.id); ids.add(q.id);
  if (!(q.tier >= 1 && q.tier <= 6)) errs.push('bad tier ' + q.id);
  const ps = q.template ? q.personas : [q.persona];
  for (const p of ps) if (!PERSONAS[p]) errs.push(`unknown persona ${p} in ${q.id}`);
  if (!q.template) {
    for (const k of ['msg', 'hint', 'answer']) if (!q[k] || typeof q[k] !== 'string' || q[k].length < (k === 'hint' ? 4 : k === 'msg' ? 10 : 20)) errs.push(`missing ${k} in ${q.id}`);
    if (!Array.isArray(q.keys) || q.keys.length < 2) errs.push('keys ' + q.id);
  }
}
for (const [id, t] of Object.entries(TEMPLATES)) {
  for (let s = 1; s <= 500; s++) {
    for (const pid of t.personas) {
      let g; try { g = t.gen(makeRng(s * 7919 + 13), pid); } catch (e) { errs.push(`${id} seed ${s} threw ${e.message}`); break; }
      const all = [g.msg, g.hint, g.answer, ...(g.keys || [])].join(' | ');
      if (/NaN|undefined|Infinity|null/.test(all)) { errs.push(`${id} seed ${s} ${pid}: ${all.match(/.{0,40}(NaN|undefined|Infinity|null).{0,20}/)[0]}`); break; }
      if (!g.keys || g.keys.length < 2) errs.push(`${id} keys`);
    }
    if (errs.length > 40) break;
  }
}
const topics = {}; const tiers = {}; const per = {};
for (const q of QUESTIONS) { topics[q.topic] = (topics[q.topic] || 0) + 1; tiers[q.tier] = (tiers[q.tier] || 0) + 1; for (const p of (q.template ? q.personas : [q.persona])) per[p] = (per[p] || 0) + 1; }
console.log('total', QUESTIONS.length, 'templates', Object.keys(TEMPLATES).length, 'fixed', QUESTIONS.length - Object.keys(TEMPLATES).length);
console.log('tiers', JSON.stringify(tiers)); console.log('topics', JSON.stringify(topics)); console.log('personas', JSON.stringify(per));
console.log(errs.length ? 'ERRORS:\n' + errs.slice(0, 40).join('\n') : 'ALL OK');
process.exit(errs.length ? 1 : 0);
