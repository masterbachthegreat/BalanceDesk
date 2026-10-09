// Randomised templates: microeconomics, macroeconomics, international, behavioural.
(() => {
const { n, nt, e, p, sgn } = FMT;
const mic = 'Microeconomics', mac = 'Macroeconomics', intl = 'International economics', beh = 'Behavioural & game theory', pub = 'Public finance';

// Linear market helper: Qd = a − bP, Qs = dP − c (supply starts at price c/d).
function market(r) {
  const b = r.int(2, 10), d = r.int(2, 10), c = r.int(0, 60), a = r.int(150, 600);
  const P = (a + c) / (b + d), Q = a - b * P;
  return { a, b, c, d, P, Q };
}
const sup = (m) => `Qs = ${m.d}P${m.c ? ` − ${m.c}` : ''}`;
const dem = (m) => `Qd = ${m.a} − ${m.b}P`;

TPL({ id: 'q205', tier: 2, topic: mic, personas: ['marco', 'anna', 'diego'], gen(r) {
  const dp = r.step(0.05, 0.25, 0.01), el = r.step(0.3, 3, 0.1), dq = -dp * el, rev = (1 + dp) * (1 + dq) - 1;
  return {
    msg: `Problem set: a café raises its price ${p(dp, 0)} and the quantity sold falls ${p(-dq, 1)}. What's the price elasticity of demand, is demand elastic or inelastic, and what happens to revenue?`,
    hint: 'Elasticity = % change in quantity / % change in price. Revenue = P × Q.',
    answer: `Price elasticity = ${sgn(dq, 1)} / ${sgn(dp, 0)} ≈ **−${nt(el, 2)}** (|E| = ${nt(el, 2)}). ${el > 1 ? '|E| > 1: **elastic**' : el < 1 ? '|E| < 1: **inelastic**' : '|E| = 1: unit elastic'}. Revenue factor = ${nt(1 + dp, 2)} × ${nt(1 + dq, 3)} ≈ ${nt(1 + rev, 4)}, so revenue changes by **${sgn(rev, 1)}**. Rule: with elastic demand a price rise lowers revenue; with inelastic demand it raises revenue.`,
    keys: [`Elasticity ≈ −${nt(el, 1)}`, el > 1 ? 'Elastic' : el < 1 ? 'Inelastic' : 'Unit elastic', `Revenue ${sgn(rev, 1)}`]
  };
}});

TPL({ id: 'tp-midpoint', tier: 3, topic: mic, personas: ['marco', 'anna'], gen(r) {
  const P1 = r.step(2, 20, 0.5), P2 = +(P1 * r.step(1.1, 1.5, 0.05)).toFixed(2), Q1 = r.step(200, 2000, 50), Q2 = Math.round(Q1 * r.step(0.5, 0.95, 0.05) / 10) * 10;
  const el = ((Q2 - Q1) / ((Q1 + Q2) / 2)) / ((P2 - P1) / ((P1 + P2) / 2));
  return {
    msg: `When the cinema raised ticket prices from ${e(P1, 2)} to ${e(P2, 2)}, weekly tickets fell from ${n(Q1)} to ${n(Q2)}. Using the midpoint (arc) method, what's the price elasticity? Why use midpoints?`,
    hint: '%ΔQ = (Q₂ − Q₁) / average Q; same for price.',
    answer: `%ΔQ = (${n(Q2)} − ${n(Q1)}) / ${n((Q1 + Q2) / 2)} ≈ ${sgn((Q2 - Q1) / ((Q1 + Q2) / 2), 1)}. %ΔP = (${e(P2, 2)} − ${e(P1, 2)}) / ${e((P1 + P2) / 2, 2)} ≈ ${sgn((P2 - P1) / ((P1 + P2) / 2), 1)}. Elasticity ≈ **${nt(el, 2)}** → ${Math.abs(el) > 1 ? 'elastic' : 'inelastic'}. The midpoint method gives the same answer whether the price goes up or down, unlike using the starting values.`,
    keys: [`Elasticity ≈ ${nt(el, 2)}`, Math.abs(el) > 1 ? 'Elastic' : 'Inelastic', 'Midpoint avoids direction dependence']
  };
}});

TPL({ id: 'tp-equilibrium', tier: 3, topic: mic, personas: ['marco', 'anna'], gen(r) {
  const m = market(r), shift = r.int(20, 80), P2 = (m.a + shift + m.c) / (m.b + m.d), Q2 = m.a + shift - m.b * P2;
  return {
    msg: `Demand: ${dem(m)}. Supply: ${sup(m)}. Find the equilibrium price and quantity. Then a heatwave raises demand by ${shift} units at every price. New equilibrium?`,
    hint: 'Set Qd = Qs and solve for P.',
    answer: `${m.a} − ${m.b}P = ${m.d}P${m.c ? ` − ${m.c}` : ''} → ${m.b + m.d}P = ${m.a + m.c} → **P* ≈ ${nt(m.P, 2)}**, **Q* ≈ ${nt(m.Q, 1)}**. After the shift (Qd = ${m.a + shift} − ${m.b}P): P ≈ **${nt(P2, 2)}**, Q ≈ **${nt(Q2, 1)}**. A demand increase raises both price and quantity; how the change splits between them depends on the slopes.`,
    keys: [`P* ≈ ${nt(m.P, 2)}, Q* ≈ ${nt(m.Q, 0)}`, `New P ≈ ${nt(P2, 2)}, Q ≈ ${nt(Q2, 0)}`, 'Demand shift raises P and Q']
  };
}});

TPL({ id: 'tp-tax-incidence', tier: 5, topic: pub, personas: ['sofia', 'marco'], gen(r) {
  const m = market(r), t = r.int(2, Math.max(3, Math.floor(m.P * 0.4)));
  const Pb = (m.a + m.c + m.d * t) / (m.b + m.d), Ps = Pb - t, Qt = m.a - m.b * Pb, rev = t * Qt, dwl = 0.5 * t * (m.Q - Qt);
  return {
    msg: `Market: ${dem(m)}, ${sup(m)}. The government adds a €${t} per-unit tax collected from sellers. What prices do buyers pay and sellers receive, who bears more of the tax, how much revenue is raised, and what's the deadweight loss?`,
    hint: 'Sellers receive P − t, so supply becomes Qs = d(P − t) − c. Solve again.',
    answer: `Before: P* ≈ ${nt(m.P, 2)}, Q* ≈ ${nt(m.Q, 1)}. With tax: ${m.a} − ${m.b}P = ${m.d}(P − ${t})${m.c ? ` − ${m.c}` : ''} → buyers pay **≈ ${nt(Pb, 2)}**, sellers keep **≈ ${nt(Ps, 2)}**, Q ≈ ${nt(Qt, 1)}. Buyers bear ${nt(Pb - m.P, 2)} (${p(m.d / (m.b + m.d), 0)}), sellers ${nt(m.P - Ps, 2)} (${p(m.b / (m.b + m.d), 0)}): the **less elastic side bears more**, regardless of who legally pays. Revenue = ${t} × ${nt(Qt, 1)} ≈ **${nt(rev, 0)}**. DWL = ½ × ${t} × ${nt(m.Q - Qt, 1)} ≈ **${nt(dwl, 1)}**.`,
    keys: [`Buyer price ≈ ${nt(Pb, 2)}, seller price ≈ ${nt(Ps, 2)}`, 'Incidence depends on relative elasticities', `Revenue ≈ ${nt(rev, 0)}, DWL ≈ ${nt(dwl, 0)}`]
  };
}});

TPL({ id: 'tp-ceiling', tier: 4, topic: mic, personas: ['marco', 'sofia', 'anna'], gen(r) {
  const m = market(r), Pc = +(m.P * r.step(0.6, 0.85, 0.05)).toFixed(1), Qd = m.a - m.b * Pc, Qs = Math.max(0, m.d * Pc - m.c);
  return {
    msg: `Rental market: ${dem(m)}, ${sup(m)} (thousands of flats, price in €10s). The city caps rent at ${nt(Pc, 1)}. What happens to quantity supplied, quantity demanded and the shortage?`,
    hint: 'Plug the ceiling price into both equations.',
    answer: `Equilibrium: P* ≈ ${nt(m.P, 2)}, Q* ≈ ${nt(m.Q, 1)}. At the ceiling ${nt(Pc, 1)} (binding, since it's below P*): Qd = ${nt(Qd, 1)}, Qs = ${nt(Qs, 1)} → **shortage ≈ ${nt(Qd - Qs, 1)}**. Fewer flats are rented than before (${nt(Qs, 1)} vs ${nt(m.Q, 1)}). Expect queues, side payments, less maintenance and less new construction; sitting tenants gain while newcomers lose.`,
    keys: [`Qd ≈ ${nt(Qd, 0)}, Qs ≈ ${nt(Qs, 0)}`, `Shortage ≈ ${nt(Qd - Qs, 0)}`, 'Non-price rationing / lower supply effects']
  };
}});

TPL({ id: 'tp-surplus', tier: 4, topic: mic, personas: ['marco', 'anna'], gen(r) {
  const m = market(r), choke = m.a / m.b, minP = m.c / m.d, cs = 0.5 * (choke - m.P) * m.Q, ps = 0.5 * (m.P - minP) * m.Q;
  return {
    msg: `Market: ${dem(m)}, ${sup(m)}. Compute consumer surplus and producer surplus at equilibrium. What do they measure?`,
    hint: 'Each is a triangle: ½ × base (Q*) × height.',
    answer: `Equilibrium P* ≈ ${nt(m.P, 2)}, Q* ≈ ${nt(m.Q, 1)}. Demand hits zero at P = ${nt(choke, 2)}; supply starts at P = ${nt(minP, 2)}. CS = ½ × ${nt(m.Q, 1)} × (${nt(choke, 2)} − ${nt(m.P, 2)}) ≈ **${nt(cs, 0)}**. PS = ½ × ${nt(m.Q, 1)} × (${nt(m.P, 2)} − ${nt(minP, 2)}) ≈ **${nt(ps, 0)}**. CS is buyers' willingness to pay above the price; PS is sellers' revenue above their minimum acceptable price. Their sum, total surplus, is maximised at the competitive equilibrium.`,
    keys: [`CS ≈ ${nt(cs, 0)}`, `PS ≈ ${nt(ps, 0)}`, 'Definitions; total surplus maximised at equilibrium']
  };
}});

TPL({ id: 'tp-cross', tier: 3, topic: mic, personas: ['anna', 'diego', 'raj'], gen(r) {
  const pairs = [['coffee', 'tea'], ['printers', 'ink cartridges'], ['e-books', 'paperbacks'], ['burgers', 'fries'], ['trains', 'domestic flights'], ['game consoles', 'video games']];
  const [x, y] = r.pick(pairs), dp = r.step(0.05, 0.3, 0.01), comp = ['ink cartridges', 'fries', 'video games'].includes(y), dq = (comp ? -1 : 1) * dp * r.step(0.3, 1.8, 0.1), ex = dq / dp;
  return {
    msg: `The price of ${x} rose ${p(dp, 0)} and the quantity demanded of ${y} changed by ${sgn(dq, 1)}. What's the cross-price elasticity, and are they substitutes or complements?`,
    hint: 'Cross elasticity = %ΔQ of one good / %ΔP of the other. The sign tells you the relationship.',
    answer: `Cross elasticity = ${sgn(dq, 1)} / ${sgn(dp, 0)} ≈ **${nt(ex, 2)}**. ${ex > 0 ? 'Positive → **substitutes**: when one gets dearer, people switch to the other.' : 'Negative → **complements**: they\'re used together, so a dearer one reduces demand for both.'} The size shows how strong the link is; firms use it to anticipate how rivals' prices (or their own other products) affect sales.`,
    keys: [`Cross elasticity ≈ ${nt(ex, 2)}`, ex > 0 ? 'Substitutes' : 'Complements', 'Sign interpretation']
  };
}});

TPL({ id: 'tp-income-el', tier: 3, topic: mic, personas: ['anna', 'omar'], gen(r) {
  const goods = ['restaurant meals', 'bread', 'bus tickets', 'foreign holidays', 'instant noodles', 'organic food'];
  const g = r.pick(goods), dy = r.step(0.03, 0.15, 0.01), elas = { 'restaurant meals': r.step(1.2, 2.2, 0.1), bread: r.step(0.1, 0.5, 0.05), 'bus tickets': -r.step(0.2, 0.8, 0.1), 'foreign holidays': r.step(1.5, 2.5, 0.1), 'instant noodles': -r.step(0.3, 1, 0.1), 'organic food': r.step(1.1, 1.8, 0.1) }[g], dq = dy * elas;
  const kind = elas < 0 ? 'an **inferior good**' : elas < 1 ? 'a **normal necessity**' : 'a **normal luxury**';
  return {
    msg: `Household incomes rose ${p(dy, 0)} and spending on ${g} (quantity) changed ${sgn(dq, 1)}. What's the income elasticity, and what kind of good is it?`,
    hint: 'Income elasticity = %ΔQ / %ΔIncome.',
    answer: `Income elasticity = ${sgn(dq, 1)} / ${sgn(dy, 0)} ≈ **${nt(elas, 2)}**, so ${g} are ${kind}. Negative: demand falls as incomes rise (people switch to better alternatives). Between 0 and 1: demand rises less than income. Above 1: demand rises more than income, so its budget share grows. Useful for forecasting demand as economies grow.`,
    keys: [`Income elasticity ≈ ${nt(elas, 1)}`, elas < 0 ? 'Inferior' : elas < 1 ? 'Necessity' : 'Luxury', 'Interpretation of ranges']
  };
}});

TPL({ id: 'tp-monopoly', tier: 5, topic: mic, personas: ['marco', 'sofia'], gen(r) {
  const a = r.int(50, 200), b = r.step(0.5, 4, 0.5), c = r.int(5, Math.floor(a * 0.5));
  const Qm = (a - c) / (2 * b), Pm = (a + c) / 2, prof = (Pm - c) * Qm, Qc = (a - c) / b, dwl = 0.5 * (Pm - c) * (Qc - Qm);
  return {
    msg: `A monopolist faces demand P = ${a} − ${nt(b, 1)}Q and constant marginal cost ${c} (no fixed costs). Find its profit-maximising output, price and profit. Compare with perfect competition. What's the deadweight loss?`,
    hint: 'MR = a − 2bQ. Set MR = MC.',
    answer: `MR = ${a} − ${nt(2 * b, 1)}Q. MR = MC: ${a} − ${nt(2 * b, 1)}Q = ${c} → **Q_m = ${nt(Qm, 2)}**, **P_m = ${nt(Pm, 2)}**, profit = (${nt(Pm, 2)} − ${c}) × ${nt(Qm, 2)} ≈ **${nt(prof, 1)}**. Competition (P = MC = ${c}): Q_c = ${nt(Qc, 2)}. The monopolist produces half as much at a higher price. DWL = ½ × (${nt(Pm, 2)} − ${c}) × (${nt(Qc, 2)} − ${nt(Qm, 2)}) ≈ **${nt(dwl, 1)}**: trades that would benefit both sides but don't happen.`,
    keys: [`Q_m ≈ ${nt(Qm, 1)}, P_m ≈ ${nt(Pm, 1)}`, `Profit ≈ ${nt(prof, 0)}`, `DWL ≈ ${nt(dwl, 0)} vs competitive Q ${nt(Qc, 1)}`]
  };
}});

TPL({ id: 'q505', tier: 5, topic: beh, personas: ['marco', 'hana'], gen(r) {
  const S = r.int(0, 3), P = S + r.int(2, 4), R = P + r.int(3, 7), T = R + r.int(2, 6);
  return {
    msg: `Game theory exam: two firms can each charge High or Low prices. Both High = €${R}m profit each; both Low = €${P}m each; if one goes Low while the other stays High, the Low one gets €${T}m and the High one €${S}m. What happens, and why do cartels tend to collapse?`,
    hint: "Find each firm's best response to each of the other's choices.",
    answer: `If the rival plays High, my best response is Low (${T} > ${R}). If the rival plays Low, my best response is Low (${P} > ${S}). So **Low is a dominant strategy** for both: the Nash equilibrium is **(Low, Low) with €${P}m each**, although (High, High) with €${R}m each is better for both. It's a **prisoner's dilemma**. Cartels collapse because each member gains by secretly undercutting and agreements are hard (and illegal) to enforce. Repeated interaction with credible punishment (trigger strategies) can sustain collusion.`,
    keys: ['Low is dominant for both', `Nash equilibrium (Low, Low) at €${P}m`, 'Cheating incentive / prisoner\'s dilemma; repeated games']
  };
}});

TPL({ id: 'q605', tier: 6, topic: intl, personas: ['marco', 'omar'], gen(r) {
  let a1, a2, b1, b2;
  do { a1 = r.int(1, 4); a2 = r.int(1, 5); b1 = a1 + r.int(1, 5); b2 = a2 + r.int(1, 5); } while (Math.abs(a1 / a2 - b1 / b2) < 0.15);
  const ocA = a1 / a2, ocB = b1 / b2, aCloth = ocA < ocB;
  const lo = Math.min(ocA, ocB), hi = Math.max(ocA, ocB);
  return {
    msg: `Trade exam: Country A makes 1 cloth in ${a1} hour${a1 > 1 ? 's' : ''} or 1 wine in ${a2} hour${a2 > 1 ? 's' : ''}. Country B needs ${b1} hours per cloth and ${b2} hours per wine. A is better at both. Should they trade? Who specialises in what?`,
    hint: 'Compute opportunity costs: how much wine does one cloth cost in each country?',
    answer: `A has the **absolute** advantage in both, but trade depends on **comparative** advantage. Opportunity cost of 1 cloth: A = ${a1}/${a2} ≈ ${nt(ocA, 2)} wine; B = ${b1}/${b2} ≈ ${nt(ocB, 2)} wine. So **${aCloth ? 'A' : 'B'} specialises in cloth** and **${aCloth ? 'B' : 'A'} in wine** (wine costs ${nt(1 / ocA, 2)} cloth in A vs ${nt(1 / ocB, 2)} in B). Any price between ${nt(lo, 2)} and ${nt(hi, 2)} wine per cloth makes both better off, because total output rises when each produces where its opportunity cost is lowest.`,
    keys: ['Distinguishes absolute vs comparative advantage', `Opportunity costs ${nt(ocA, 2)} vs ${nt(ocB, 2)}`, `${aCloth ? 'A' : 'B'} → cloth, ${aCloth ? 'B' : 'A'} → wine; both gain`]
  };
}});

TPL({ id: 'tp-shutdown', tier: 4, topic: mic, personas: ['pavlo', 'marco', 'diego'], gen(r) {
  const avc = r.step(5, 30, 0.5), afc = r.step(2, 10, 0.5), atc = avc + afc, P = r.pick([avc * r.step(0.7, 0.95, 0.05), avc + afc * r.step(0.2, 0.8, 0.1), atc * r.step(1.05, 1.3, 0.05)]);
  const v = P >= atc ? 'profit' : P >= avc ? 'keep operating at a loss' : 'shut down';
  return {
    msg: `In a competitive market the price is ${e(P, 2)}. At my best output, average variable cost is ${e(avc, 2)} and average total cost is ${e(atc, 2)}. Should I keep producing in the short run?`,
    hint: 'Compare price with AVC (shutdown point) and ATC (break-even point).',
    answer: `${P >= atc ? `P (${e(P, 2)}) ≥ ATC (${e(atc, 2)}): **making a profit**, so produce.` : P >= avc ? `AVC (${e(avc, 2)}) ≤ P (${e(P, 2)}) < ATC (${e(atc, 2)}): making a loss, but **keep producing in the short run**, since each unit covers its variable cost plus ${e(P - avc, 2)} towards fixed costs that must be paid anyway.` : `P (${e(P, 2)}) < AVC (${e(avc, 2)}): **shut down** now; producing loses more than the fixed costs alone.`} In the long run, a firm needs P ≥ ATC or it should exit.`,
    keys: ['Compares price with AVC and ATC', `Decision: ${v}`, 'Fixed costs are sunk in the short run']
  };
}});

// ───────── Macro ─────────
TPL({ id: 'q406', tier: 4, topic: mac, personas: ['jonas', 'sofia'], gen(r) {
  const mpc = r.step(0.5, 0.9, 0.05), G = r.step(2, 50, 1), mult = 1 / (1 - mpc);
  return {
    msg: `The government plans €${G}bn of extra spending. An economist says the marginal propensity to consume is ${nt(mpc, 2)}. What's the simple multiplier and total GDP effect? Why are real-world estimates much smaller?`,
    hint: 'Multiplier = 1 / (1 − MPC).',
    answer: `Multiplier = 1 / (1 − ${nt(mpc, 2)}) = **${nt(mult, 2)}**, so GDP rises by up to **€${nt(G * mult, 1)}bn** in the simplest closed-economy model: each round of spending becomes income, ${p(mpc, 0)} of which is spent again. Real multipliers are usually ~0.5–1.5 because of leakages and offsets: taxes on extra income, imports, crowding out via higher interest rates, central bank tightening, expectations of future taxes, and capacity limits.`,
    keys: [`Multiplier ${nt(mult, 2)}`, `Total ≈ €${nt(G * mult, 0)}bn`, 'Leakages / crowding out / capacity']
  };
}});

TPL({ id: 'tp-real-growth', tier: 2, topic: mac, personas: ['jonas', 'anna'], gen(r) {
  const ng = r.step(0.01, 0.1, 0.005), inf = r.step(0.005, 0.08, 0.005), rg = (1 + ng) / (1 + inf) - 1;
  return {
    msg: `Headline: "Economy grew ${p(ng)}!" That's nominal GDP. The GDP deflator rose ${p(inf)}. How much did the economy really grow?`,
    hint: 'Real growth ≈ nominal growth − inflation (exact: divide the factors).',
    answer: `Real growth ≈ ${p(ng)} − ${p(inf)} = ${p(ng - inf)}; exactly (1 + ${nt(ng, 3)}) / (1 + ${nt(inf, 3)}) − 1 ≈ **${sgn(rg)}**. ${rg < 0 ? 'Despite the headline, real output **shrank**.' : 'That\'s the actual increase in the volume of goods and services.'} Always compare real growth when asking whether the economy produces more.`,
    keys: [`Real growth ≈ ${sgn(rg, 1)}`, 'Removes price effect', 'Nominal headline misleading']
  };
}});

TPL({ id: 'tp-deflator', tier: 3, topic: mac, personas: ['jonas', 'anna', 'marco'], gen(r) {
  const R1 = r.step(1000, 4000, 50), R2 = Math.round(R1 * r.step(0.98, 1.05, 0.005)), D1 = r.step(100, 115, 0.5), D2 = +(D1 * r.step(1, 1.08, 0.005)).toFixed(1);
  const N1 = R1 * D1 / 100, N2 = R2 * D2 / 100, infl = N2 / R2 / (N1 / R1) - 1;
  return {
    msg: `Nominal GDP was €${nt(N1, 1)}bn in year 1 and €${nt(N2, 1)}bn in year 2. Real GDP (base-year prices) was €${n(R1)}bn and €${n(R2)}bn. Compute the GDP deflator each year, inflation, and real growth.`,
    hint: 'Deflator = nominal / real × 100.',
    answer: `Deflator year 1 = ${nt(N1, 1)} / ${n(R1)} × 100 ≈ **${nt(N1 / R1 * 100, 1)}**; year 2 ≈ **${nt(N2 / R2 * 100, 1)}**. Inflation (deflator) ≈ **${sgn(infl, 2)}**. Real growth = ${n(R2)} / ${n(R1)} − 1 ≈ **${sgn(R2 / R1 - 1, 2)}**. Nominal growth (${sgn(N2 / N1 - 1, 2)}) ≈ real growth + inflation.`,
    keys: [`Deflators ≈ ${nt(N1 / R1 * 100, 1)} and ${nt(N2 / R2 * 100, 1)}`, `Inflation ≈ ${sgn(infl, 1)}`, `Real growth ≈ ${sgn(R2 / R1 - 1, 1)}`]
  };
}});

TPL({ id: 'tp-unemp', tier: 1, topic: mac, personas: ['jonas', 'anna', 'sofia'], gen(r) {
  const W = r.step(5, 60, 0.5), E = +(W * r.step(0.55, 0.75, 0.01)).toFixed(2), U = +(E * r.step(0.03, 0.12, 0.005)).toFixed(2), LF = E + U;
  return {
    msg: `A country has ${nt(W, 1)}m working-age people. ${nt(E, 2)}m are employed and ${nt(U, 2)}m are unemployed (no job, looking for one). The rest are students, retirees, carers, etc. What are the unemployment rate and the participation rate?`,
    hint: 'Labour force = employed + unemployed. Unemployment rate = unemployed / labour force.',
    answer: `Labour force = ${nt(E, 2)} + ${nt(U, 2)} = ${nt(LF, 2)}m. Unemployment rate = ${nt(U, 2)} / ${nt(LF, 2)} ≈ **${p(U / LF, 1)}** (not divided by the whole population!). Participation rate = ${nt(LF, 2)} / ${nt(W, 1)} ≈ **${p(LF / W, 1)}**. People who stop looking ("discouraged workers") leave the labour force, which can lower the unemployment rate even when the job market is weak.`,
    keys: [`Unemployment ≈ ${p(U / LF, 1)}`, `Participation ≈ ${p(LF / W, 1)}`, 'Denominator is the labour force']
  };
}});

TPL({ id: 'tp-cpi', tier: 2, topic: mac, personas: ['jonas', 'anna', 'brandt'], gen(r) {
  const items = [['bread (kg)', r.int(5, 15), r.step(2, 5, 0.1)], ['petrol (litres)', r.int(30, 80), r.step(1.4, 2.0, 0.05)], ['cinema tickets', r.int(1, 4), r.step(8, 14, 0.5)]];
  const ch = items.map(() => r.step(-0.05, 0.15, 0.01));
  const c1 = items.reduce((s, [, q, pr]) => s + q * pr, 0), c2 = items.reduce((s, [, q, pr], i) => s + q * pr * (1 + ch[i]), 0), inf = c2 / c1 - 1;
  return {
    msg: `Mini CPI: a monthly basket of ${items.map(([nm, q, pr]) => `${q} ${nm} at ${e(pr, 2)}`).join(', ')}. A year later the prices are ${items.map(([nm, q, pr], i) => `${e(pr * (1 + ch[i]), 2)}`).join(', ')}. What's the inflation rate?`,
    hint: 'Cost the same basket in both years and compare.',
    answer: `Basket cost year 1 = ${items.map(([, q, pr]) => `${q} × ${e(pr, 2)}`).join(' + ')} = ${e(c1, 2)}. Year 2 = ${e(c2, 2)}. Index (year 1 = 100): ${nt(c2 / c1 * 100, 1)}. Inflation ≈ **${sgn(inf, 1)}**. A fixed basket ignores substitution (people buy less of what got expensive) and quality changes, which is why CPI can overstate the cost-of-living increase.`,
    keys: [`Year 1 ${e(c1, 2)}, year 2 ${e(c2, 2)}`, `Inflation ≈ ${sgn(inf, 1)}`, 'Fixed-basket limitations']
  };
}});

TPL({ id: 'tp-money-mult', tier: 3, topic: mac, personas: ['jonas', 'sam', 'anna'], gen(r) {
  const rr = r.pick([0.01, 0.02, 0.05, 0.1, 0.2]), D = r.step(1000, 50000, 1000), m = 1 / rr;
  return {
    msg: `Textbook question: with a reserve requirement of ${p(rr, 0)}, a new ${e(D)} deposit could support how much total deposits in the banking system? Why is the real-world effect usually smaller?`,
    hint: 'Simple deposit multiplier = 1 / reserve ratio.',
    answer: `Multiplier = 1 / ${nt(rr, 2)} = **${nt(m, 0)}**, so up to ${e(D)} × ${nt(m, 0)} = **${e(D * m)}** of deposits (${e(D * m - D)} newly created through lending and re-depositing). Real effects are smaller because banks hold excess reserves, people hold cash, and lending depends on loan demand, creditworthiness and capital requirements. In practice banks lend first and find reserves later; the binding constraints are capital and profitable lending opportunities.`,
    keys: [`Multiplier ${nt(m, 0)}`, `Max deposits ${e(D * m)}`, 'Leakages / demand-driven lending']
  };
}});

TPL({ id: 'tp-qtm', tier: 4, topic: mac, personas: ['jonas', 'marco'], gen(r) {
  const mg = r.step(0.02, 0.2, 0.01), yg = r.step(0, 0.05, 0.005), vg = r.pick([0, 0, -0.02, 0.02]), inf = mg + vg - yg;
  return {
    msg: `Quantity theory: the money supply grows ${p(mg, 0)} a year, real GDP grows ${p(yg, 1)}, and velocity ${vg === 0 ? 'is stable' : vg > 0 ? `rises ${p(vg, 0)}` : `falls ${p(-vg, 0)}`}. What inflation rate does MV = PY predict? Why doesn't this always hold?`,
    hint: 'In growth rates: %ΔM + %ΔV ≈ %ΔP + %ΔY.',
    answer: `%ΔP ≈ %ΔM + %ΔV − %ΔY = ${p(mg, 0)} ${vg >= 0 ? '+' : '−'} ${p(Math.abs(vg), 0)} − ${p(yg, 1)} ≈ **${p(inf, 1)}**. It works well over long periods and in high inflations, but in the short run velocity is unstable (e.g. when money is hoarded in crises or at near-zero interest rates), and output can respond to money too, so the link to inflation is loose.`,
    keys: [`Predicted inflation ≈ ${p(inf, 1)}`, 'Uses growth-rate form of MV = PY', 'Velocity instability / short-run caveats']
  };
}});

TPL({ id: 'tp-taylor', tier: 5, topic: mac, personas: ['jonas', 'felix'], gen(r) {
  const rs = r.step(0, 0.02, 0.005), pi = r.step(0, 0.08, 0.005), gap = r.step(-0.04, 0.03, 0.005), i = rs + pi + 0.5 * (pi - 0.02) + 0.5 * gap;
  return {
    msg: `Using a simple Taylor rule (neutral real rate ${p(rs, 1)}, inflation target 2%, weights 0.5 and 0.5): inflation is ${p(pi, 1)} and the output gap is ${sgn(gap, 1)}. What policy rate does the rule suggest?`,
    hint: 'i = r* + π + 0.5(π − 2%) + 0.5 × output gap.',
    answer: `i = ${p(rs, 1)} + ${p(pi, 1)} + 0.5 × (${p(pi, 1)} − 2%) + 0.5 × ${sgn(gap, 1)} ≈ **${p(i, 2)}**. The rule raises rates more than one-for-one with inflation (the "Taylor principle"), so the real rate rises when inflation is high, and cuts when output is below potential. ${i < 0 ? 'A negative result shows why central banks hit the zero lower bound and use tools like QE.' : 'Central banks use it as a benchmark, not a mechanical formula.'}`,
    keys: [`Suggested rate ≈ ${p(i, 1)}`, 'Correct formula use', 'Taylor principle / benchmark interpretation']
  };
}});

TPL({ id: 'tp-debt-dyn', tier: 6, topic: pub, personas: ['sofia', 'jonas'], gen(r) {
  const b = r.step(0.4, 1.4, 0.05), ir = r.step(0.01, 0.06, 0.005), g = r.step(0.01, 0.06, 0.005), pb = r.step(-0.04, 0.03, 0.005);
  const db = (ir - g) / (1 + g) * b - pb, stab = (ir - g) / (1 + g) * b;
  return {
    msg: `Public debt is ${p(b, 0)} of GDP. The average nominal interest rate on it is ${p(ir, 1)}, nominal GDP growth is ${p(g, 1)}, and the primary balance is ${pb >= 0 ? `a surplus of ${p(pb, 1)}` : `a deficit of ${p(-pb, 1)}`} of GDP. Does the debt ratio rise or fall? What primary balance stabilises it?`,
    hint: 'Δb ≈ (r − g)/(1 + g) × b − primary balance.',
    answer: `Δb ≈ (${p(ir, 1)} − ${p(g, 1)})/(1 + ${nt(g, 3)}) × ${p(b, 0)} − (${sgn(pb, 1)}) ≈ **${sgn(db, 2)} of GDP per year**, so the ratio ${db > 0 ? '**rises**' : '**falls**'}. Debt-stabilising primary balance = (r − g)/(1 + g) × b ≈ **${sgn(stab, 2)}** of GDP. When r < g, a country can run modest primary deficits with a stable debt ratio; when r > g, it needs surpluses. That's why the interest-growth gap is central to debt sustainability.`,
    keys: [`Δ debt ratio ≈ ${sgn(db, 1)}`, `Stabilising primary balance ≈ ${sgn(stab, 1)}`, 'Role of r − g']
  };
}});

TPL({ id: 'tp-tax-mult', tier: 5, topic: mac, personas: ['sofia', 'jonas'], gen(r) {
  const mpc = r.step(0.5, 0.9, 0.05), X = r.step(5, 40, 1), gm = 1 / (1 - mpc), tm = -mpc / (1 - mpc);
  return {
    msg: `Simple Keynesian model, MPC = ${nt(mpc, 2)}. Compare: (a) €${X}bn more government spending, (b) a €${X}bn tax cut, (c) €${X}bn more spending financed by €${X}bn higher taxes. Effect on GDP of each?`,
    hint: 'Spending multiplier 1/(1−MPC); tax multiplier −MPC/(1−MPC).',
    answer: `(a) Spending multiplier = ${nt(gm, 2)} → **+€${nt(X * gm, 1)}bn**. (b) Tax multiplier = −${nt(mpc, 2)}/${nt(1 - mpc, 2)} = ${nt(tm, 2)}; a cut raises GDP by **€${nt(-X * tm, 1)}bn**. It's smaller because households save part of the tax cut before the first round. (c) Balanced budget: ${nt(gm, 2)} + (${nt(tm, 2)}) = 1 → **+€${X}bn**. Real-world multipliers are smaller (imports, crowding out, expectations).`,
    keys: [`Spending +€${nt(X * gm, 0)}bn`, `Tax cut +€${nt(-X * tm, 0)}bn`, 'Balanced-budget multiplier = 1']
  };
}});

TPL({ id: 'tp-okun', tier: 4, topic: mac, personas: ['jonas', 'sofia'], gen(r) {
  const gp = r.step(0.01, 0.03, 0.0025), g = r.step(-0.03, 0.05, 0.0025), beta = r.pick([0.3, 0.4, 0.5]), du = -beta * (g - gp);
  return {
    msg: `Potential GDP grows about ${p(gp, 2)} a year. Okun's coefficient is ${beta}. If real GDP grows ${sgn(g, 2)} next year, how much should the unemployment rate change?`,
    hint: 'Δu ≈ −β × (actual growth − potential growth).',
    answer: `Δu ≈ −${beta} × (${sgn(g, 2)} − ${p(gp, 2)}) ≈ **${sgn(du, 2)} percentage points**. Growth ${g > gp ? 'above' : 'below'} potential ${g > gp ? 'lowers' : 'raises'} unemployment. Growing at potential just keeps unemployment stable, because productivity and labour-force growth absorb it. Okun's law is an empirical rule of thumb and varies across countries and time.`,
    keys: [`Δu ≈ ${sgn(du, 1)} pp`, 'Compares growth with potential', 'Empirical rule of thumb']
  };
}});

TPL({ id: 'tp-rule70', tier: 3, topic: mac, personas: ['omar', 'anna'], gen(r) {
  const g1 = r.step(0.01, 0.03, 0.005), g2 = r.step(0.04, 0.08, 0.005), y = r.int(20, 50), Y = r.step(2000, 20000, 500);
  return {
    msg: `Two countries both have income per head of €${n(Y)}. One grows ${p(g1, 1)} a year, the other ${p(g2, 1)}. How long does each take to double, and where are they after ${y} years?`,
    hint: 'Doubling time ≈ 70 / growth rate in %.',
    answer: `Rule of 70: ${p(g1, 1)} → ≈ **${nt(70 / (g1 * 100), 0)} years**; ${p(g2, 1)} → ≈ **${nt(70 / (g2 * 100), 0)} years**. After ${y} years: €${n(Y)} × ${nt(1 + g1, 3)}^${y} ≈ **€${n(Y * (1 + g1) ** y)}** vs €${n(Y)} × ${nt(1 + g2, 3)}^${y} ≈ **€${n(Y * (1 + g2) ** y)}**. Small differences in growth rates compound into huge differences in living standards, which is why long-run growth matters so much in development.`,
    keys: [`Doubling ≈ ${nt(70 / (g1 * 100), 0)} vs ${nt(70 / (g2 * 100), 0)} years`, `After ${y} years ≈ €${n(Y * (1 + g1) ** y)} vs €${n(Y * (1 + g2) ** y)}`, 'Compounding of growth']
  };
}});

TPL({ id: 'tp-fisher', tier: 2, topic: mac, personas: ['jonas', 'brandt', 'sam'], gen(r) {
  const i = r.step(0.01, 0.09, 0.0025), pe = r.step(0.01, 0.08, 0.0025), real = (1 + i) / (1 + pe) - 1;
  return {
    msg: `A bank deposit pays ${p(i)} and expected inflation is ${p(pe)}. What's the expected real interest rate? Who gains if inflation turns out higher than expected: borrowers or lenders?`,
    hint: 'Fisher: real ≈ nominal − expected inflation.',
    answer: `Real ≈ ${p(i)} − ${p(pe)} = ${p(i - pe)}; exactly (1 + ${nt(i, 4)})/(1 + ${nt(pe, 4)}) − 1 ≈ **${sgn(real)}**. If inflation comes in **higher** than expected, **borrowers gain** and lenders lose: debts are repaid in money that buys less, so the realised real rate is lower than agreed. Unexpected inflation redistributes from creditors to debtors.`,
    keys: [`Real ≈ ${sgn(real, 1)}`, 'Fisher relation', 'Unexpected inflation favours borrowers']
  };
}});

TPL({ id: 'tp-growth-acct', tier: 5, topic: mac, personas: ['omar'], gen(r) {
  const gY = r.step(0.01, 0.07, 0.005), gK = r.step(0.01, 0.08, 0.005), gL = r.step(-0.01, 0.03, 0.005), a = r.pick([0.3, 0.33, 0.35, 0.4]);
  const tfp = gY - a * gK - (1 - a) * gL;
  return {
    msg: `Growth accounting for a country: real GDP grew ${p(gY, 1)} a year, the capital stock ${p(gK, 1)}, labour input ${sgn(gL, 1)}. Capital's share of income is ${nt(a, 2)}. How much growth came from total factor productivity?`,
    hint: 'g_Y = g_A + α·g_K + (1 − α)·g_L. Solve for g_A.',
    answer: `Contribution of capital = ${nt(a, 2)} × ${p(gK, 1)} = ${p(a * gK, 2)}. Labour = ${nt(1 - a, 2)} × ${sgn(gL, 1)} = ${sgn((1 - a) * gL, 2)}. TFP growth (Solow residual) = ${p(gY, 1)} − ${p(a * gK, 2)} − (${sgn((1 - a) * gL, 2)}) ≈ **${sgn(tfp, 2)}**. TFP is the part not explained by more inputs (technology, efficiency, institutions). Sustained growth in income per person needs TFP growth, since capital alone hits diminishing returns.`,
    keys: [`Capital ${p(a * gK, 1)}, labour ${sgn((1 - a) * gL, 1)}`, `TFP ≈ ${sgn(tfp, 1)}`, 'Residual interpretation / diminishing returns']
  };
}});

TPL({ id: 'tp-ca', tier: 4, topic: intl, personas: ['omar', 'jonas', 'sofia'], gen(r) {
  const S = r.step(0.15, 0.3, 0.01), I = r.step(0.15, 0.3, 0.01), Bud = r.step(-0.06, 0.02, 0.005), ca = S + Bud - I;
  return {
    msg: `National accounts as % of GDP: private saving ${p(S, 0)}, investment ${p(I, 0)}, government budget balance ${sgn(Bud, 1)}. What's the current account balance, and what does it mean for borrowing from abroad?`,
    hint: 'CA = national saving − investment = (private saving + budget balance) − investment.',
    answer: `National saving = ${p(S, 0)} ${Bud >= 0 ? '+' : '−'} ${p(Math.abs(Bud), 1)} = ${p(S + Bud, 1)}. CA = ${p(S + Bud, 1)} − ${p(I, 0)} = **${sgn(ca, 1)} of GDP**. ${ca < 0 ? 'A **deficit**: the country invests more than it saves and borrows the difference from abroad (net capital inflow).' : 'A **surplus**: the country saves more than it invests and lends the difference abroad (net capital outflow).'} So budget deficits and current-account deficits are linked unless private saving or investment adjusts ("twin deficits").`,
    keys: [`CA ≈ ${sgn(ca, 1)} of GDP`, 'Uses S − I identity incl. government', ca < 0 ? 'Deficit → net borrowing from abroad' : 'Surplus → net lending abroad']
  };
}});

TPL({ id: 'tp-tot', tier: 4, topic: intl, personas: ['omar'], gen(r) {
  const xp = r.step(-0.2, 0.2, 0.01), mp = r.step(-0.1, 0.2, 0.01), tot = (1 + xp) / (1 + mp) - 1;
  return {
    msg: `A copper-exporting country: export prices changed ${sgn(xp, 0)} this year, import prices ${sgn(mp, 0)}. What happened to its terms of trade, and why does it matter for living standards?`,
    hint: 'Terms of trade = export price index / import price index.',
    answer: `ToT index = ${nt(1 + xp, 2)} / ${nt(1 + mp, 2)} ≈ ${nt(1 + tot, 3)} → terms of trade ${tot >= 0 ? 'improved' : 'worsened'} by **${sgn(tot, 1)}**. Each unit of exports now buys ${p(Math.abs(tot), 1)} ${tot >= 0 ? 'more' : 'fewer'} imports, so real national income ${tot >= 0 ? 'rises' : 'falls'} even with unchanged output. Commodity exporters face volatile terms of trade, a major source of boom-bust cycles.`,
    keys: [`ToT ${sgn(tot, 1)}`, 'Export prices / import prices', 'Effect on purchasing power of exports']
  };
}});

// ───────── International / FX ─────────
TPL({ id: 'tp-ppp', tier: 4, topic: intl, personas: ['felix', 'omar', 'jonas'], gen(r) {
  const eur = r.step(4, 6, 0.1), usd = +(eur * r.step(0.95, 1.3, 0.01)).toFixed(2), act = +(usd / eur * r.step(0.85, 1.15, 0.01)).toFixed(3), ppp = usd / eur;
  const over = act > ppp;
  return {
    msg: `A burger costs ${e(eur, 2)} in the euro area and $${nt(usd, 2)} in the US. The market exchange rate is ${nt(act, 3)} dollars per euro. What's the PPP exchange rate? Is the euro over- or undervalued by this measure?`,
    hint: 'PPP rate = US price / euro price.',
    answer: `PPP rate = ${nt(usd, 2)} / ${nt(eur, 2)} ≈ **${nt(ppp, 3)} $/€**. The market rate ${nt(act, 3)} is ${over ? 'above' : 'below'} that, so the euro is **${over ? 'overvalued' : 'undervalued'} by ≈ ${p(Math.abs(act / ppp - 1), 1)}**: a euro buys ${over ? 'more' : 'less'} in the US than at home. PPP is a long-run anchor at best: non-traded inputs (rent, wages), taxes and trade costs keep prices apart for years.`,
    keys: [`PPP ≈ ${nt(ppp, 3)}`, `Euro ${over ? 'overvalued' : 'undervalued'} ≈ ${p(Math.abs(act / ppp - 1), 0)}`, 'Long-run anchor; non-traded goods caveat']
  };
}});

TPL({ id: 'tp-rel-ppp', tier: 5, topic: intl, personas: ['felix', 'omar'], gen(r) {
  const pa = r.step(0.01, 0.04, 0.005), pb = r.step(0.03, 0.25, 0.01), y = r.int(1, 5), cur = r.pick(['Turkish lira', 'Argentine peso', 'Ukrainian hryvnia', 'Brazilian real']);
  const dep = ((1 + pb) / (1 + pa)) ** y - 1;
  return {
    msg: `Inflation is ${p(pa, 1)} in the euro area and ${p(pb, 0)} for the ${cur}. Under relative PPP, how much should the ${cur} weaken against the euro over ${y} year${y > 1 ? 's' : ''}?`,
    hint: 'Exchange rate change ≈ inflation differential, compounding over the years.',
    answer: `Relative PPP: the high-inflation currency depreciates by roughly the inflation gap. Per year: (1 + ${nt(pb, 2)})/(1 + ${nt(pa, 3)}) − 1 ≈ ${p((1 + pb) / (1 + pa) - 1, 1)}. Over ${y} year${y > 1 ? 's' : ''}: the euro price of the ${cur} should rise by ≈ **${p(dep, 1)}** in terms of the number of ${cur} per euro. It holds best over longer horizons; capital flows, interest rates and risk sentiment dominate in the short run.`,
    keys: [`≈ ${p((1 + pb) / (1 + pa) - 1, 1)} per year`, `≈ ${p(dep, 0)} over ${y} year(s)`, 'Long-run tendency; short-run deviations']
  };
}});

TPL({ id: 'tp-fx-move', tier: 3, topic: intl, personas: ['felix', 'raj', 'jonas'], gen(r) {
  const s0 = r.step(1.0, 1.25, 0.005), s1 = +(s0 * r.step(0.88, 1.12, 0.005)).toFixed(3), usd = r.step(100, 5000, 50);
  const ch = s1 / s0 - 1, e0 = usd / s0, e1 = usd / s1;
  return {
    msg: `EUR/USD moved from ${nt(s0, 3)} to ${nt(s1, 3)} (dollars per euro). Did the euro strengthen or weaken, and by how much? What happens to the euro cost of a $${n(usd)} US product we import?`,
    hint: 'Change = new / old − 1. Euro cost = dollars / rate.',
    answer: `The euro ${ch >= 0 ? '**appreciated**' : '**depreciated**'} by ${sgn(ch, 2)} against the dollar (each euro buys ${ch >= 0 ? 'more' : 'fewer'} dollars). The import cost moves from $${n(usd)} / ${nt(s0, 3)} ≈ ${e(e0, 2)} to $${n(usd)} / ${nt(s1, 3)} ≈ **${e(e1, 2)}** (${sgn(e1 / e0 - 1, 1)}). A ${ch >= 0 ? 'stronger' : 'weaker'} euro makes imports ${ch >= 0 ? 'cheaper' : 'dearer'} and euro-area exports ${ch >= 0 ? 'less' : 'more'} competitive.`,
    keys: [`Euro ${sgn(ch, 1)}`, `Import cost ≈ ${e(e1, 0)}`, 'Effect on imports/exports']
  };
}});

TPL({ id: 'tp-cross-rate', tier: 3, topic: intl, personas: ['felix', 'raj'], gen(r) {
  const eu = r.step(1.02, 1.2, 0.005), uj = r.step(110, 160, 0.5), ej = eu * uj, amt = r.step(1000, 50000, 500);
  return {
    msg: `EUR/USD is ${nt(eu, 3)} and USD/JPY is ${nt(uj, 1)}. What's the EUR/JPY cross rate? How many yen do I get for ${e(amt)}?`,
    hint: 'Yen per euro = (dollars per euro) × (yen per dollar).',
    answer: `EUR/JPY = ${nt(eu, 3)} × ${nt(uj, 1)} ≈ **${nt(ej, 2)} yen per euro**. ${e(amt)} × ${nt(ej, 2)} ≈ **¥${n(amt * ej)}**. If a bank quoted EUR/JPY far from this, you could convert € → $ → ¥ → € for a riskless profit (triangular arbitrage), which keeps quoted cross rates in line.`,
    keys: [`EUR/JPY ≈ ${nt(ej, 1)}`, `≈ ¥${n(amt * ej)}`, 'Arbitrage keeps cross rates consistent']
  };
}});

TPL({ id: 'tp-tariff', tier: 6, topic: intl, personas: ['marco', 'sofia', 'omar'], gen(r) {
  const m = market(r), Pw = +(m.P * r.step(0.5, 0.75, 0.05)).toFixed(1), t = +(Math.min((m.P - Pw) * 0.6, Pw * r.step(0.15, 0.4, 0.05))).toFixed(1);
  const qd0 = m.a - m.b * Pw, qs0 = Math.max(0, m.d * Pw - m.c), P1 = Pw + t, qd1 = m.a - m.b * P1, qs1 = Math.max(0, m.d * P1 - m.c);
  const M0 = qd0 - qs0, M1 = qd1 - qs1, rev = t * M1, dwl = 0.5 * t * (qs1 - qs0) + 0.5 * t * (qd0 - qd1);
  return {
    msg: `Small open economy: domestic ${dem(m)}, ${sup(m)}. The world price is ${nt(Pw, 1)}. Imports before and after a tariff of ${nt(t, 1)} per unit? Tariff revenue and deadweight loss?`,
    hint: 'With free trade the domestic price equals the world price; with the tariff it rises to world price + tariff.',
    answer: `Free trade (P = ${nt(Pw, 1)}): Qd = ${nt(qd0, 1)}, Qs = ${nt(qs0, 1)} → imports **${nt(M0, 1)}**. With tariff (P = ${nt(P1, 1)}): Qd = ${nt(qd1, 1)}, Qs = ${nt(qs1, 1)} → imports **${nt(M1, 1)}**. Revenue = ${nt(t, 1)} × ${nt(M1, 1)} ≈ **${nt(rev, 1)}**. DWL = production distortion ½ × ${nt(t, 1)} × ${nt(qs1 - qs0, 1)} + consumption distortion ½ × ${nt(t, 1)} × ${nt(qd0 - qd1, 1)} ≈ **${nt(dwl, 1)}**. Domestic producers gain, consumers lose more than producers and government gain together.`,
    keys: [`Imports ${nt(M0, 0)} → ${nt(M1, 0)}`, `Revenue ≈ ${nt(rev, 0)}`, `DWL ≈ ${nt(dwl, 0)} (two triangles)`]
  };
}});

// ───────── Behavioural / decisions ─────────
TPL({ id: 'tp-ev-risk', tier: 2, topic: beh, personas: ['hana', 'tom'], gen(r) {
  const pw = r.pick([0.2, 0.25, 0.4, 0.5, 0.6]), W = r.step(100, 10000, 100), C = Math.round(pw * W * r.step(0.5, 0.95, 0.05));
  const ev = pw * W;
  return {
    msg: `Experiment: participants choose between ${e(C)} for sure, or a ${p(pw, 0)} chance of ${e(W)} (otherwise nothing). Most take the sure ${e(C)}. Are they being irrational?`,
    hint: 'Compute the expected value of the gamble and compare.',
    answer: `Expected value of the gamble = ${p(pw, 0)} × ${e(W)} = **${e(ev)}**, higher than the sure ${e(C)}. Choosing the sure amount isn't irrational: it shows **risk aversion**, and the difference (${e(ev - C)}) is the risk premium they'd give up for certainty. ${e(C)} is close to their certainty equivalent. Expected-utility theory explains it with diminishing marginal utility of money.`,
    keys: [`EV = ${e(ev)}`, 'Risk aversion, not irrationality', 'Certainty equivalent / risk premium']
  };
}});

TPL({ id: 'tp-mc-table', tier: 3, topic: mic, personas: ['olena', 'marco', 'diego'], gen(r) {
  const FC = r.step(50, 500, 10), v = r.step(2, 10, 0.5), w = r.step(0.5, 3, 0.5);
  const TC = [0, 1, 2, 3, 4, 5].map((q) => FC + v * q + w * q * q), P = r.step(v + 4 * w, v + 10 * w, 0.5);
  const MC = [1, 2, 3, 4, 5].map((q) => TC[q] - TC[q - 1]);
  let best = 0; for (let q = 1; q <= 5; q++) if (MC[q - 1] <= P) best = q;
  return {
    msg: `Total costs for batches of cakes (per hour): ${TC.map((c, q) => `${q} → ${e(c, 2)}`).join(', ')}. Each batch sells for ${e(P, 2)}. What's the marginal cost of each batch, and how many should I make?`,
    hint: 'MC = change in total cost for one more batch. Produce while P ≥ MC.',
    answer: `Marginal costs: ${MC.map((m, i) => `batch ${i + 1}: ${e(m, 2)}`).join('; ')}. Rising MC reflects diminishing returns. Produce while price ≥ MC: **${best} batch${best === 1 ? '' : 'es'}**. Fixed costs (${e(FC)}) don't change the decision, since they're the same whatever you produce. ${best ? `Profit at ${best}: ${e(P * best - TC[best], 2)}.` : ''}`,
    keys: [`MC: ${MC.map((m) => nt(m, 1)).join(', ')}`, `Produce ${best} batches`, 'Rule P = MC; fixed costs irrelevant']
  };
}});
})();
