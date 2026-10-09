// Randomised templates: personal finance, investing, fixed income.
// Every number in the answer is computed here. The AI grader only compares the player's reply to it.
(() => {
const { n, nt, e, p, sgn } = FMT;
const pf = 'Personal finance', inv = 'Investing', fi = 'Fixed income', pub = 'Public finance';

// ───────── Personal finance ─────────
TPL({ id: 'q103', tier: 1, topic: pf, personas: ['priya', 'brandt'], gen(r) {
  const P = r.step(500, 5000, 100), rt = r.step(0.02, 0.08, 0.005), y = r.int(2, 4);
  const fv = P * (1 + rt) ** y, simple = P * (1 + rt * y);
  return {
    msg: `Hey 👋 I put ${e(P)} into a savings account at ${p(rt)} per year, compounded annually. How much will I have after ${y} years? And why is it more than ${e(simple, 2)}, which is what simple interest would give?`,
    hint: 'Each year the interest is calculated on a bigger balance than the year before.',
    answer: `FV = PV × (1 + r)^n = ${e(P)} × ${nt(1 + rt, 4)}^${y} ≈ **${e(fv, 2)}**. Simple interest would pay ${e(P * rt, 2)} a year, so ${e(simple, 2)} in total. The extra ${e(fv - simple, 2)} comes from **compounding**: from year 2 on you also earn interest on the interest already credited.`,
    keys: [`Result ≈ ${e(fv, 2)}`, 'Uses FV = PV(1+r)^n or year-by-year growth', 'Explains compounding: interest on interest']
  };
}});

TPL({ id: 'q108', tier: 1, topic: pf, personas: ['brandt', 'priya'], gen(r) {
  const nom = r.step(0.005, 0.04, 0.005); let inf = r.step(0.01, 0.08, 0.005);
  if (inf <= nom + 0.004) inf = nom + r.step(0.01, 0.04, 0.005);
  const real = (1 + nom) / (1 + inf) - 1;
  return {
    msg: `Guten Tag. Prices went up ${p(inf)} this year. My savings account paid me ${p(nom)} interest. My balance is higher, so I gained money, correct?`,
    hint: 'Compare the interest rate with inflation: nominal versus real.',
    answer: `The **nominal** balance rose ${p(nom)}, but the **real** return (purchasing power) is negative. Approximation: real ≈ nominal − inflation = ${p(nom)} − ${p(inf)} = ${p(nom - inf)}. Exactly: (1 + ${nt(nom, 4)}) / (1 + ${nt(inf, 4)}) − 1 ≈ **${p(real)}**. The savings buy less than a year ago, even though the number on the statement went up.`,
    keys: ['Distinguishes nominal and real return', `Real return ≈ ${p(nom - inf)} (exact ${p(real)})`, 'Conclusion: purchasing power fell']
  };
}});

TPL({ id: 'q204', tier: 2, topic: pf, personas: ['priya', 'tom'], gen(r) {
  const rate = r.int(3, 12), P = r.step(2000, 20000, 1000), rt = rate / 100;
  const rule = 72 / rate, exact = Math.log(2) / Math.log(1 + rt);
  return {
    msg: `If I invest ${e(P)} at ${rate}% a year, roughly how long until it doubles? Someone mentioned a "rule of 72". Does it actually work?`,
    hint: '72 divided by the interest rate in percent.',
    answer: `Rule of 72: doubling time ≈ 72 / ${rate} ≈ **${nt(rule, 1)} years**, so about ${e(2 * P)}. The exact answer is ln 2 / ln(1 + ${nt(rt, 2)}) ≈ ${nt(exact, 2)} years. The rule works because ln 2 ≈ 0.693, and 72 is a convenient nearby number with many divisors; it is most accurate for rates of roughly 6–10%.`,
    keys: [`About ${nt(rule, 1)} years (72 / ${rate})`, `Exact ≈ ${nt(exact, 1)} years or a check by compounding`, 'Knows it is an approximation']
  };
}});

TPL({ id: 'tp-simple', tier: 1, topic: pf, personas: ['priya', 'tom'], gen(r) {
  const P = r.step(1000, 10000, 500), rt = r.step(0.02, 0.07, 0.005), y = r.int(5, 15);
  const simple = P * rt * y, comp = P * ((1 + rt) ** y - 1);
  return {
    msg: `Two accounts both advertise ${p(rt)} on ${e(P)}. One pays simple interest, the other compounds annually. After ${y} years, how much interest does each pay me?`,
    hint: 'Simple: interest only on the original amount. Compound: interest on the growing balance.',
    answer: `Simple interest = P × r × n = ${e(P)} × ${nt(rt, 3)} × ${y} = **${e(simple, 2)}**. Compound interest = P × [(1 + r)^n − 1] = ${e(P)} × (${nt(1 + rt, 3)}^${y} − 1) ≈ **${e(comp, 2)}**. The compounding account earns ${e(comp - simple, 2)} more because interest is added to the balance and earns interest itself. The gap grows with time.`,
    keys: [`Simple ≈ ${e(simple, 0)}`, `Compound ≈ ${e(comp, 0)}`, 'Explains why compounding earns more']
  };
}});

TPL({ id: 'tp-pv', tier: 2, topic: pf, personas: ['priya', 'mikko', 'raj'], gen(r, pid) {
  const FV = r.step(5000, 60000, 1000), rt = r.step(0.02, 0.06, 0.005), y = r.int(3, 10);
  const pv = FV / (1 + rt) ** y;
  const goal = { priya: 'a new studio setup', mikko: 'the deposit on a flat', raj: 'a warehouse lease deposit' }[pid] || 'a big purchase';
  return {
    msg: `I need ${e(FV)} in ${y} years for ${goal}. A deposit account pays ${p(rt)} a year, compounded annually. How much do I have to put in today, as a single payment?`,
    hint: 'Discount the future amount back: PV = FV / (1 + r)^n.',
    answer: `PV = FV / (1 + r)^n = ${e(FV)} / ${nt(1 + rt, 3)}^${y} ≈ **${e(pv, 2)}**. Depositing that today and letting it compound at ${p(rt)} for ${y} years grows to ${e(FV)}. This is discounting: money in the future is worth less today because today's money can earn interest.`,
    keys: [`PV ≈ ${e(pv, 0)}`, 'Uses PV = FV / (1+r)^n', 'Explains discounting / time value of money']
  };
}});

TPL({ id: 'tp-savings-annuity', tier: 3, topic: pf, personas: ['priya', 'tom', 'brandt'], gen(r, pid) {
  const pmt = r.step(50, 500, 25), rt = r.step(0.03, 0.08, 0.005), y = r.int(5, 30);
  const i = rt / 12, m = y * 12, fv = pmt * (((1 + i) ** m - 1) / i), paid = pmt * m;
  const who = pid === 'brandt' ? 'My granddaughter wants to save' : 'I want to save';
  return {
    msg: `${who} ${e(pmt)} at the end of every month for ${y} years in a fund earning ${p(rt)} a year (monthly compounding). How much will be there at the end, and how much of it is interest?`,
    hint: 'Future value of an annuity with a monthly rate r/12 and n = years × 12 payments.',
    answer: `Monthly rate i = ${p(rt)} / 12 ≈ ${p(i, 3)}; number of payments n = ${m}. FV = PMT × [(1 + i)^n − 1] / i = ${e(pmt)} × [(1 + ${nt(i, 5)})^${m} − 1] / ${nt(i, 5)} ≈ **${e(fv, 0)}**. Total paid in = ${e(pmt)} × ${m} = ${e(paid)}, so about **${e(fv - paid, 0)}** is interest. The longer the horizon, the bigger the share of interest.`,
    keys: [`FV ≈ ${e(fv, 0)}`, `Contributions ${e(paid)} → interest ≈ ${e(fv - paid, 0)}`, 'Uses annuity FV formula with monthly rate']
  };
}});

TPL({ id: 'tp-mortgage', tier: 3, topic: pf, personas: ['mikko', 'sam'], gen(r, pid) {
  const L = r.step(80000, 400000, 10000), rt = r.step(0.02, 0.065, 0.0025), y = r.pick([15, 20, 25, 30]);
  const i = rt / 12, m = y * 12, pmt = L * i / (1 - (1 + i) ** -m), tot = pmt * m;
  const lead = pid === 'sam' ? 'A client asks me to explain her mortgage offer:' : "I'm looking at a mortgage:";
  return {
    msg: `${lead} ${e(L)} borrowed at ${p(rt)} a year, repaid monthly over ${y} years as a fixed annuity. What's the monthly payment, and how much interest is paid in total?`,
    hint: 'PMT = L × i / (1 − (1 + i)^−n) with i = annual rate / 12.',
    answer: `i = ${p(rt)} / 12 ≈ ${p(i, 4)}, n = ${m} payments. PMT = L × i / [1 − (1 + i)^−n] ≈ **${e(pmt, 2)} per month**. Total paid = ${e(pmt, 2)} × ${m} ≈ ${e(tot, 0)}, so total interest ≈ **${e(tot - L, 0)}**. Early payments are mostly interest; the principal share grows over time (amortisation).`,
    keys: [`Monthly payment ≈ ${e(pmt, 0)}`, `Total interest ≈ ${e(tot - L, 0)}`, 'Uses annuity / amortisation formula']
  };
}});

TPL({ id: 'q407', tier: 4, topic: pf, personas: ['priya'], gen(r) {
  const pmt = r.step(5000, 15000, 500), y = r.int(5, 12), rt = r.step(0.03, 0.08, 0.005);
  const pvA = pmt * (1 - (1 + rt) ** -y) / rt;
  const lump = Math.round(pvA * r.pick([0.9, 0.93, 0.96, 1.04, 1.07, 1.1]) / 1000) * 1000;
  const better = pvA > lump ? 'the annual payments' : 'the lump sum';
  return {
    msg: `I won a design prize! Option 1: ${e(lump)} now. Option 2: ${e(pmt)} at the end of each year for ${y} years (${e(pmt * y)} in total). I can earn ${p(rt)} a year elsewhere. Which should I take?`,
    hint: 'Compare present values. PV of an annuity = PMT × [1 − (1+r)^−n] / r.',
    answer: `PV of the payments = ${e(pmt)} × [1 − ${nt(1 + rt, 3)}^−${y}] / ${nt(rt, 3)} ≈ **${e(pvA, 0)}**. Compared with ${e(lump)} today, **${better}** ${pvA > lump ? 'are' : 'is'} worth more at ${p(rt)} (difference ≈ ${e(Math.abs(pvA - lump), 0)}). The undiscounted total of ${e(pmt * y)} is misleading because later euros are worth less today. Other factors: the payer's reliability, taxes and whether she needs the cash now.`,
    keys: ['Compares present values, not totals', `PV of annuity ≈ ${e(pvA, 0)}`, `Chooses ${better}`]
  };
}});

TPL({ id: 'q507', tier: 5, topic: pf, personas: ['priya', 'sam'], gen(r) {
  const mr = r.step(0.008, 0.025, 0.001), apr = mr * 12, ear = (1 + mr) ** 12 - 1;
  return {
    msg: `My credit card charges ${p(mr, 2)} interest per month on unpaid balances. The contract says "${p(apr, 1)} APR". Is ${p(apr, 1)} the real yearly cost?`,
    hint: 'Compound monthly: (1 + monthly rate)^12 − 1.',
    answer: `No. ${p(apr, 1)} is the **nominal** rate (${p(mr, 2)} × 12) and ignores compounding. The **effective annual rate** = (1 + ${nt(mr, 4)})^12 − 1 ≈ **${p(ear)}**. Interest is charged on previously added interest each month, so carrying a balance for a year costs about ${p(ear, 1)}. Compare loans using effective rates.`,
    keys: [`${p(apr, 1)} is nominal and ignores compounding`, `EAR ≈ ${p(ear, 1)}`, 'Uses (1 + r)^12 − 1']
  };
}});

TPL({ id: 'tp-compare-loans', tier: 4, topic: pf, personas: ['sam', 'priya', 'raj'], gen(r) {
  const a = r.step(0.04, 0.09, 0.0025), b = a + r.step(0, 0.003, 0.0005);
  const earA = (1 + a / 12) ** 12 - 1, earB = b;
  const cheaper = earA < earB ? 'Loan A' : earA > earB ? 'Loan B' : 'Neither';
  return {
    msg: `Two loan offers. Loan A: ${p(a)} a year, compounded monthly. Loan B: ${p(b)} a year, compounded annually. B's rate looks higher. Which one is actually cheaper?`,
    hint: 'Convert both to an effective annual rate.',
    answer: `Effective annual rate A = (1 + ${nt(a, 4)}/12)^12 − 1 ≈ **${p(earA, 3)}**. B compounds once a year, so its effective rate is simply **${p(earB, 3)}**. ${cheaper === 'Neither' ? 'They cost the same.' : `**${cheaper}** is cheaper.`} Monthly compounding adds roughly ${p(earA - a, 3)} to A's quoted rate, which is why quoted (nominal) rates with different compounding can't be compared directly.`,
    keys: [`EAR A ≈ ${p(earA, 2)}`, `EAR B = ${p(earB, 2)}`, `${cheaper} is cheaper`]
  };
}});

TPL({ id: 'tp-purchasing-power', tier: 2, topic: pf, personas: ['brandt', 'jonas'], gen(r) {
  const inf = r.step(0.015, 0.06, 0.005), y = r.int(5, 20), X = r.step(10000, 100000, 5000);
  const f = (1 + inf) ** y, pp = X / f;
  return {
    msg: `If inflation averages ${p(inf)} a year, what will ${e(X)} kept in cash be worth in today's money after ${y} years? And how much will a basket that costs ${e(100)} today cost then?`,
    hint: 'Prices grow by (1 + inflation)^years. Divide to get today\'s value.',
    answer: `Price level factor = (1 + ${nt(inf, 3)})^${y} ≈ ${nt(f, 3)}. A ${e(100)} basket will cost about **${e(100 * f, 2)}**. The cash keeps its nominal value but its real value is ${e(X)} / ${nt(f, 3)} ≈ **${e(pp, 0)}** in today's money, a loss of about ${p(1 - 1 / f, 1)} of purchasing power.`,
    keys: [`Factor ≈ ${nt(f, 2)}; basket ≈ ${e(100 * f, 0)}`, `Real value ≈ ${e(pp, 0)}`, 'Explains loss of purchasing power']
  };
}});

TPL({ id: 'tp-retire-pmt', tier: 4, topic: pf, personas: ['ingrid', 'priya', 'brandt'], gen(r, pid) {
  const T = r.step(100000, 800000, 25000), y = r.int(15, 40), rt = r.step(0.03, 0.07, 0.005);
  const pmt = T * rt / ((1 + rt) ** y - 1);
  const who = pid === 'ingrid' ? 'A young member of our pension fund asks:' : pid === 'brandt' ? 'My son asks me, and I want to check my maths:' : 'Retirement planning question:';
  return {
    msg: `${who} to have ${e(T)} in ${y} years, earning ${p(rt)} a year, how much needs to be saved at the end of each year?`,
    hint: 'Rearrange the future value of an annuity: PMT = FV × r / [(1 + r)^n − 1].',
    answer: `FV of an annuity: FV = PMT × [(1 + r)^n − 1] / r. Solving for PMT: PMT = ${e(T)} × ${nt(rt, 3)} / (${nt(1 + rt, 3)}^${y} − 1) ≈ **${e(pmt, 0)} per year**. Total contributions ≈ ${e(pmt * y, 0)}; the rest (≈ ${e(T - pmt * y, 0)}) comes from compound returns. Starting earlier lowers the required saving a lot.`,
    keys: [`≈ ${e(pmt, 0)} per year`, 'Uses (rearranged) annuity FV formula', 'Notes compounding supplies part of the target']
  };
}});

TPL({ id: 'tp-perpetuity', tier: 3, topic: pf, personas: ['brandt', 'ingrid', 'yuki'], gen(r, pid) {
  const C = r.step(1000, 20000, 500), rt = r.step(0.03, 0.08, 0.005), pv = C / rt;
  const thing = pid === 'yuki' ? `A preferred share pays a fixed dividend of ${e(C)} a year forever` : `A family foundation offers me an endowment that pays ${e(C)} a year forever`;
  return {
    msg: `${thing}. If the right discount rate is ${p(rt)}, what is it worth today? How can something that pays forever have a finite value?`,
    hint: 'Perpetuity: PV = C / r.',
    answer: `A level **perpetuity** is worth PV = C / r = ${e(C)} / ${nt(rt, 3)} = **${e(pv, 0)}**. It's finite because each later payment is discounted more heavily; the present values form a shrinking geometric series whose sum converges to C/r. Payments 50+ years out add very little.`,
    keys: [`PV = ${e(pv, 0)}`, 'Uses C / r', 'Explains convergence: distant payments worth little today']
  };
}});

TPL({ id: 'tp-growing-annuity', tier: 5, topic: pf, personas: ['ingrid'], gen(r) {
  const C = r.step(10000, 30000, 1000), g = r.step(0.01, 0.03, 0.005), rt = r.step(0.04, 0.07, 0.005), y = r.int(15, 30);
  const pv = C / (rt - g) * (1 - ((1 + g) / (1 + rt)) ** y);
  const flat = C * (1 - (1 + rt) ** -y) / rt;
  return {
    msg: `A retiring member gets a pension of ${e(C)} at the end of year 1, rising ${p(g)} a year with indexation, for ${y} years. Our discount rate is ${p(rt)}. What's the present value of that liability? How much does indexation add compared with a flat pension?`,
    hint: 'Growing annuity: PV = C / (r − g) × [1 − ((1 + g)/(1 + r))^n].',
    answer: `Growing annuity: PV = ${e(C)} / (${nt(rt, 3)} − ${nt(g, 3)}) × [1 − (${nt(1 + g, 3)}/${nt(1 + rt, 3)})^${y}] ≈ **${e(pv, 0)}**. A flat ${e(C)} pension would be worth ${e(C)} × [1 − ${nt(1 + rt, 3)}^−${y}] / ${nt(rt, 3)} ≈ ${e(flat, 0)}, so indexation adds ≈ **${e(pv - flat, 0)}** (${p(pv / flat - 1, 1)}). Indexed pensions are much more expensive liabilities.`,
    keys: [`PV ≈ ${e(pv, 0)}`, `Flat pension ≈ ${e(flat, 0)}`, 'Uses growing annuity formula; explains extra cost of indexation']
  };
}});

TPL({ id: 'tp-continuous', tier: 4, topic: pf, personas: ['felix', 'tom'], gen(r) {
  const P = r.step(1000, 50000, 1000), rt = r.step(0.02, 0.1, 0.005), t = r.int(2, 10);
  const c = P * Math.exp(rt * t), a = P * (1 + rt) ** t;
  return {
    msg: `Quick check: ${e(P)} at ${p(rt)} for ${t} years. What's the value with continuous compounding versus annual compounding? Why is the difference so small?`,
    hint: 'Continuous: P × e^(rt). Annual: P × (1 + r)^t.',
    answer: `Continuous: ${e(P)} × e^(${nt(rt, 3)} × ${t}) ≈ **${e(c, 2)}**. Annual: ${e(P)} × ${nt(1 + rt, 3)}^${t} ≈ **${e(a, 2)}**. Difference ≈ ${e(c - a, 2)}. Compounding more often helps, but with diminishing returns: the effective annual rate only rises from ${p(rt)} to e^r − 1 ≈ ${p(Math.exp(rt) - 1, 3)}.`,
    keys: [`Continuous ≈ ${e(c, 0)}`, `Annual ≈ ${e(a, 0)}`, 'Explains diminishing effect of more frequent compounding']
  };
}});

TPL({ id: 'tp-tax-brackets', tier: 2, topic: pub, personas: ['priya', 'sofia'], gen(r) {
  const A = r.step(10000, 13000, 500), B = r.step(40000, 55000, 1000), inc = r.step(20000, 95000, 1000);
  const tax = Math.max(0, Math.min(inc, B) - A) * 0.2 + Math.max(0, inc - B) * 0.4;
  const marg = inc > B ? 0.4 : inc > A ? 0.2 : 0;
  return {
    msg: `Explain progressive tax with a simple example. Say income up to ${e(A)} is tax-free, income between ${e(A)} and ${e(B)} is taxed at 20%, and everything above ${e(B)} at 40%. Someone earns ${e(inc)}. How much tax, what's their average rate and their marginal rate?`,
    hint: 'Each rate only applies to the slice of income inside its bracket.',
    answer: `Tax by slice: first ${e(A)} at 0%; ${e(Math.max(0, Math.min(inc, B) - A))} at 20% = ${e(Math.max(0, Math.min(inc, B) - A) * 0.2)}${inc > B ? `; ${e(inc - B)} at 40% = ${e((inc - B) * 0.4)}` : ''}. Total tax = **${e(tax)}**. Average rate = ${e(tax)} / ${e(inc)} ≈ **${p(tax / inc, 1)}**. Marginal rate (on the next euro) = **${p(marg, 0)}**. A raise never lowers take-home pay, because the higher rate only applies to the extra income.`,
    keys: [`Tax = ${e(tax)}`, `Average ≈ ${p(tax / inc, 1)}, marginal ${p(marg, 0)}`, 'Explains rates apply per slice']
  };
}});

TPL({ id: 'tp-vat', tier: 1, topic: pub, personas: ['diego', 'olena', 'raj'], gen(r) {
  const v = r.pick([0.07, 0.19, 0.2]), net = r.step(5, 80, 0.5), gross2 = r.step(20, 300, 1);
  const g = net * (1 + v), inside = gross2 * v / (1 + v);
  return {
    msg: `VAT confuses me. With a ${p(v, 0)} VAT rate: (1) if my net price is ${e(net, 2)}, what does the customer pay? (2) A supplier invoice shows ${e(gross2, 2)} including VAT. How much of that is VAT?`,
    hint: 'Gross = net × (1 + rate). To extract VAT from a gross amount, divide by (1 + rate), not multiply by the rate.',
    answer: `(1) Gross = ${e(net, 2)} × ${nt(1 + v, 2)} = **${e(g, 2)}**. (2) Net = ${e(gross2, 2)} / ${nt(1 + v, 2)} ≈ ${e(gross2 / (1 + v), 2)}, so VAT = **${e(inside, 2)}** (= gross × rate / (1 + rate)). Common mistake: ${p(v, 0)} × ${e(gross2, 2)} = ${e(gross2 * v, 2)} overstates the VAT. Businesses usually reclaim input VAT, so VAT is a cost for final consumers.`,
    keys: [`Gross price ${e(g, 2)}`, `VAT in invoice ≈ ${e(inside, 2)}`, 'Divides by (1 + rate) rather than multiplying gross by rate']
  };
}});

// ───────── Investing ─────────
TPL({ id: 'q403', tier: 4, topic: inv, personas: ['tom', 'yuki'], gen(r) {
  const rf = r.step(0.01, 0.05, 0.005), mrp = r.step(0.04, 0.07, 0.005), b = r.step(0.5, 2, 0.1);
  const req = rf + b * mrp;
  return {
    msg: `A stock has a beta of ${nt(b, 1)}. The risk-free rate is ${p(rf)} and the expected market return is ${p(rf + mrp)}. Using CAPM, what return should I demand? And what does beta actually mean?`,
    hint: 'r = rf + β × (rm − rf).',
    answer: `CAPM: r = rf + β(rm − rf) = ${p(rf)} + ${nt(b, 1)} × ${p(mrp)} = **${p(req)}**. Beta measures sensitivity to the market (systematic risk): β = ${nt(b, 1)} means the stock tends to move about ${nt(b, 1)}× as much as the market. CAPM only rewards systematic risk, because company-specific risk can be diversified away.`,
    keys: ['Applies CAPM formula', `Required return = ${p(req)}`, 'Beta = sensitivity to the market / systematic risk']
  };
}});

TPL({ id: 'tp-hpr', tier: 1, topic: inv, personas: ['tom'], gen(r) {
  const P0 = r.step(20, 200, 1), chg = r.step(-0.25, 0.4, 0.01), P1 = +(P0 * (1 + chg)).toFixed(2), D = +(P0 * r.step(0.01, 0.05, 0.005)).toFixed(2);
  const hpr = (P1 - P0 + D) / P0;
  return {
    msg: `I bought a share at ${e(P0, 2)}, received a dividend of ${e(D, 2)}, and sold it a year later at ${e(P1, 2)}. What was my total return? How much came from the price and how much from the dividend?`,
    hint: 'Total return = (price change + dividend) / purchase price.',
    answer: `Holding-period return = (P₁ − P₀ + D) / P₀ = (${e(P1, 2)} − ${e(P0, 2)} + ${e(D, 2)}) / ${e(P0, 2)} ≈ **${p(hpr, 2)}**. Price (capital gain) return = ${p((P1 - P0) / P0, 2)}; dividend yield = ${p(D / P0, 2)}. Total return counts both, which is why comparing only share prices understates returns of dividend-paying stocks.`,
    keys: [`Total return ≈ ${p(hpr, 1)}`, `Capital gain ${p((P1 - P0) / P0, 1)} + dividend yield ${p(D / P0, 1)}`, 'Formula (P1 − P0 + D) / P0']
  };
}});

TPL({ id: 'tp-cagr', tier: 2, topic: inv, personas: ['tom', 'ingrid', 'jonas'], gen(r) {
  const S = r.step(5000, 50000, 1000), y = r.int(3, 15), g = r.step(-0.03, 0.12, 0.005), E = Math.round(S * (1 + g) ** y);
  const cagr = (E / S) ** (1 / y) - 1, tot = E / S - 1;
  return {
    msg: `An investment grew from ${e(S)} to ${e(E)} over ${y} years. The brochure says it returned ${p(tot, 0)}. What was the average annual return, and why is "${p(tot, 0)} ÷ ${y}" the wrong way to get it?`,
    hint: 'CAGR = (end / start)^(1/years) − 1.',
    answer: `Total return = ${e(E)} / ${e(S)} − 1 ≈ ${p(tot, 1)}. Compound annual growth rate = (${e(E)} / ${e(S)})^(1/${y}) − 1 ≈ **${p(cagr, 2)} per year**. Dividing ${p(tot, 1)} by ${y} gives ${p(tot / y, 2)}, which ignores compounding: returns build on earlier returns, so the simple average ${tot > 0 ? 'overstates' : 'misstates'} the steady yearly rate.`,
    keys: [`CAGR ≈ ${p(cagr, 1)}`, 'Uses (End/Start)^(1/n) − 1', 'Explains why dividing total return ignores compounding']
  };
}});

TPL({ id: 'tp-port-return', tier: 2, topic: inv, personas: ['ingrid', 'tom'], gen(r) {
  const w1 = r.step(0.3, 0.7, 0.05), r1 = r.step(0.05, 0.12, 0.005), r2 = r.step(0.01, 0.05, 0.005), V = r.step(10000, 200000, 10000);
  const rp = w1 * r1 + (1 - w1) * r2;
  return {
    msg: `My portfolio is ${e(V)}: ${p(w1, 0)} in a stock fund expected to return ${p(r1)} and ${p(1 - w1, 0)} in a bond fund expected to return ${p(r2)}. What's the portfolio's expected return in % and in euros?`,
    hint: 'Weighted average of the expected returns.',
    answer: `Expected return = w₁r₁ + w₂r₂ = ${nt(w1, 2)} × ${p(r1)} + ${nt(1 - w1, 2)} × ${p(r2)} = **${p(rp)}**, i.e. about **${e(V * rp, 0)}** a year on ${e(V)}. Expected return is a simple weighted average, unlike risk: portfolio volatility is usually lower than the weighted average of volatilities because of diversification.`,
    keys: [`Expected return ${p(rp)}`, `≈ ${e(V * rp, 0)} per year`, 'Weighted average of returns']
  };
}});

TPL({ id: 'tp-port-sd', tier: 5, topic: inv, personas: ['ingrid', 'yuki'], gen(r) {
  const w = r.step(0.3, 0.7, 0.1), s1 = r.step(0.12, 0.25, 0.01), s2 = r.step(0.04, 0.1, 0.01), rho = r.step(-0.3, 0.6, 0.1);
  const v = w * w * s1 * s1 + (1 - w) ** 2 * s2 * s2 + 2 * w * (1 - w) * rho * s1 * s2, sd = Math.sqrt(v), avg = w * s1 + (1 - w) * s2;
  return {
    msg: `We hold ${p(w, 0)} equities (volatility ${p(s1, 0)}) and ${p(1 - w, 0)} bonds (volatility ${p(s2, 0)}). The correlation between them is ${nt(rho, 1)}. What is the portfolio's volatility, and why is it below the weighted average?`,
    hint: 'σp² = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂.',
    answer: `σp² = ${nt(w, 1)}² × ${nt(s1, 2)}² + ${nt(1 - w, 1)}² × ${nt(s2, 2)}² + 2 × ${nt(w, 1)} × ${nt(1 - w, 1)} × ${nt(rho, 1)} × ${nt(s1, 2)} × ${nt(s2, 2)} ≈ ${nt(v, 5)}, so σp ≈ **${p(sd, 2)}**. The weighted average of volatilities is ${p(avg, 2)}. Because correlation is below 1, the assets don't always move together and part of their risk cancels: that's diversification.`,
    keys: [`Portfolio volatility ≈ ${p(sd, 1)}`, 'Uses two-asset variance formula with correlation', `Below weighted average ${p(avg, 1)} because ρ < 1`]
  };
}});

TPL({ id: 'q608', tier: 6, topic: inv, personas: ['priya', 'ingrid'], gen(r) {
  const rf = r.step(0.01, 0.04, 0.005);
  const ra = r.step(0.09, 0.14, 0.005), sa = r.step(0.16, 0.25, 0.01), sb = r.step(0.06, 0.1, 0.01);
  const shA = (ra - rf) / sa, shB = shA * r.step(1.2, 1.7, 0.05); let sbx = sb;
  if (rf + shB * sbx > ra - 0.015) sbx = +((ra - 0.015 - rf) / shB).toFixed(3);
  const rb = rf + shB * sbx;
  const lev = sa / sbx, rLev = rf + shB * sa;
  return {
    msg: `Comparing two funds. Fund A: ${p(ra)} expected return, ${p(sa, 0)} volatility. Fund B: ${p(rb, 2)} expected return, ${p(sbx, 1)} volatility. Risk-free rate ${p(rf)}. Which is the better investment? A seems obvious…`,
    hint: 'Sharpe ratio = (return − risk-free) / volatility. What if you leverage B?',
    answer: `Sharpe A = (${p(ra)} − ${p(rf)}) / ${p(sa, 0)} ≈ **${nt(shA, 2)}**. Sharpe B = (${p(rb, 2)} − ${p(rf)}) / ${p(sbx, 1)} ≈ **${nt(shB, 2)}**. B delivers more excess return per unit of risk. Borrowing at the risk-free rate to lever B ${nt(lev, 2)}× brings it to A's ${p(sa, 0)} volatility with an expected return of ≈ ${p(rLev, 1)}, beating A. Caveats: volatility isn't the only risk (tails, drawdowns), and real borrowing costs exceed rf.`,
    keys: [`Sharpe A ≈ ${nt(shA, 2)}, B ≈ ${nt(shB, 2)}`, 'B better on a risk-adjusted basis', `Levered B at A's risk ≈ ${p(rLev, 1)}`]
  };
}});

TPL({ id: 'tp-pe', tier: 2, topic: inv, personas: ['yuki', 'tom'], gen(r) {
  const P = r.step(20, 300, 1), eps = +(P / r.step(8, 35, 0.5)).toFixed(2), peer = r.step(10, 30, 1);
  const pe = P / eps, implied = peer * eps;
  return {
    msg: `A share trades at ${e(P, 2)} and earnings per share are ${e(eps, 2)}. What's the P/E and the earnings yield? If similar companies trade at a P/E of ${peer}, what price would that imply?`,
    hint: 'P/E = price / EPS. Earnings yield is the inverse.',
    answer: `P/E = ${e(P, 2)} / ${e(eps, 2)} ≈ **${nt(pe, 1)}**. Earnings yield = EPS / price ≈ **${p(1 / pe, 1)}**. At the peer multiple: ${peer} × ${e(eps, 2)} ≈ **${e(implied, 2)}** per share, ${implied > P ? 'above' : 'below'} today's price. A different multiple can be justified by different growth, risk or earnings quality, so a gap is a starting point for analysis, not proof of mispricing.`,
    keys: [`P/E ≈ ${nt(pe, 1)}`, `Earnings yield ≈ ${p(1 / pe, 1)}`, `Implied price ≈ ${e(implied, 0)}; caveat on comparability`]
  };
}});

TPL({ id: 'tp-divyield', tier: 2, topic: inv, personas: ['tom', 'brandt'], gen(r) {
  const P = r.step(15, 150, 1), eps = +(P * r.step(0.04, 0.1, 0.005)).toFixed(2), dps = +(eps * r.step(0.3, 0.9, 0.05)).toFixed(2);
  return {
    msg: `A company's share price is ${e(P, 2)}. It earned ${e(eps, 2)} per share and paid a dividend of ${e(dps, 2)} per share. What are the dividend yield and the payout ratio, and what do they tell me?`,
    hint: 'Dividend yield = DPS / price. Payout ratio = DPS / EPS.',
    answer: `Dividend yield = ${e(dps, 2)} / ${e(P, 2)} ≈ **${p(dps / P, 2)}**: the cash income per euro invested. Payout ratio = ${e(dps, 2)} / ${e(eps, 2)} ≈ **${p(dps / eps, 0)}**: the share of profit paid out; the remaining ${p(1 - dps / eps, 0)} is retained to reinvest or pay down debt. Very high payout ratios (or yields) can signal a dividend that may be cut.`,
    keys: [`Yield ≈ ${p(dps / P, 1)}`, `Payout ≈ ${p(dps / eps, 0)}`, 'Interprets: income vs retention / sustainability']
  };
}});

TPL({ id: 'tp-ddm', tier: 4, topic: inv, personas: ['yuki', 'brandt'], gen(r) {
  const D0 = r.step(0.5, 5, 0.1), g = r.step(0.01, 0.05, 0.005), k = g + r.step(0.03, 0.06, 0.005);
  const D1 = D0 * (1 + g), P = D1 / (k - g);
  return {
    msg: `A mature utility just paid a dividend of ${e(D0, 2)} per share. Dividends grow ${p(g)} a year and investors require ${p(k)}. What's the share worth using the dividend discount model?`,
    hint: 'Gordon growth: P₀ = D₁ / (k − g), and D₁ = D₀ × (1 + g).',
    answer: `Next dividend D₁ = ${e(D0, 2)} × ${nt(1 + g, 3)} ≈ ${e(D1, 3)}. Gordon growth model: P₀ = D₁ / (k − g) = ${e(D1, 3)} / (${nt(k, 3)} − ${nt(g, 3)}) ≈ **${e(P, 2)}**. Common error: using D₀ instead of D₁. The value is very sensitive to the gap k − g, and the model only suits firms with stable, perpetual growth below k.`,
    keys: [`D₁ ≈ ${e(D1, 2)}`, `Price ≈ ${e(P, 0)}`, 'Uses D₁/(k − g); notes sensitivity or D₁ vs D₀']
  };
}});

TPL({ id: 'tp-arith-geo', tier: 4, topic: inv, personas: ['tom', 'hana'], gen(r) {
  const up = r.step(0.2, 0.6, 0.05), down = r.step(0.2, 0.5, 0.05);
  const arith = (up - down) / 2, geo = Math.sqrt((1 + up) * (1 - down)) - 1, end = 100 * (1 + up) * (1 - down);
  return {
    msg: `A fund rose ${p(up, 0)} in year 1 and fell ${p(down, 0)} in year 2. The ad says "average return ${sgn(arith, 1)} a year". Is that honest? What happened to €100 invested?`,
    hint: 'Follow €100 through both years, then compute the geometric mean.',
    answer: `€100 → ${e(100 * (1 + up), 2)} → **${e(end, 2)}**. The arithmetic mean (${sgn(up, 0)} and −${p(down, 0)}) is ${sgn(arith, 1)}, but the geometric (compound) mean is √(${nt(1 + up, 2)} × ${nt(1 - down, 2)}) − 1 ≈ **${sgn(geo, 2)} a year**, which is what investors actually earned. Losses hurt more than equal gains help, so the arithmetic average overstates realised performance when returns are volatile.`,
    keys: [`End value ${e(end, 0)}`, `Geometric mean ≈ ${sgn(geo, 1)}`, 'Arithmetic average misleading with volatile returns']
  };
}});

TPL({ id: 'tp-margin', tier: 4, topic: inv, personas: ['felix', 'tom'], gen(r) {
  const m = r.step(0.4, 0.8, 0.1), chg = r.pick([-1, 1]) * r.step(0.05, 0.25, 0.01), V = r.step(10000, 100000, 5000);
  const eq = V * m, roe = chg / m;
  return {
    msg: `I want to buy ${e(V)} of shares, putting in ${p(m, 0)} myself and borrowing the rest from my broker. If the shares move ${sgn(chg, 0)}, what's the return on my own money (ignore interest)? Why do people say leverage cuts both ways?`,
    hint: 'Return on equity = (gain or loss on the whole position) / your own money.',
    answer: `Own money = ${e(eq)}, loan = ${e(V - eq)}. Gain/loss = ${e(V)} × ${sgn(chg, 0)} = ${e(V * chg)}. Return on equity = ${e(V * chg)} / ${e(eq)} = **${sgn(roe, 1)}**, i.e. ${nt(1 / m, 2)}× the share move. Leverage magnifies gains and losses equally; on top, interest costs reduce returns and a large fall can trigger a margin call or wipe out the equity entirely.`,
    keys: [`Return on own money ${sgn(roe, 1)}`, `Leverage multiplier 1/${nt(m, 1)} = ${nt(1 / m, 2)}×`, 'Losses magnified too / margin call risk']
  };
}});

TPL({ id: 'tp-fees', tier: 3, topic: inv, personas: ['ingrid', 'tom'], gen(r) {
  const P = r.step(10000, 100000, 5000), g = r.step(0.05, 0.08, 0.005), hi = r.step(0.012, 0.022, 0.001), lo = r.step(0.001, 0.004, 0.0005), y = r.int(15, 35);
  const A = P * (1 + g - hi) ** y, Bv = P * (1 + g - lo) ** y;
  return {
    msg: `Fund fees: an active fund charges ${p(hi, 1)} a year, an index fund ${p(lo, 2)}. Both earn ${p(g, 1)} before fees. On ${e(P)} over ${y} years, how much difference do the fees make?`,
    hint: 'Grow each at (gross return − fee) for the full period.',
    answer: `Index fund: ${e(P)} × (1 + ${nt(g - lo, 4)})^${y} ≈ **${e(Bv, 0)}**. Active fund: ${e(P)} × (1 + ${nt(g - hi, 4)})^${y} ≈ **${e(A, 0)}**. Difference ≈ **${e(Bv - A, 0)}**, about ${p(1 - A / Bv, 0)} of the final wealth, from a fee gap of ${p(hi - lo, 2)} a year. Fees compound just like returns, so the active fund must outperform by more than the fee gap to be worth it.`,
    keys: [`Index ≈ ${e(Bv, 0)}`, `Active ≈ ${e(A, 0)}`, 'Explains fees compound over time']
  };
}});

TPL({ id: 'tp-port-beta', tier: 3, topic: inv, personas: ['yuki', 'ingrid'], gen(r) {
  const b = [r.step(0.6, 1, 0.1), r.step(1, 1.6, 0.1), r.step(0.2, 0.6, 0.1)], w1 = r.step(0.2, 0.45, 0.05), w2 = r.step(0.2, 0.45, 0.05), w3 = +(1 - w1 - w2).toFixed(2);
  const bp = w1 * b[0] + w2 * b[1] + w3 * b[2], mkt = r.pick([-0.1, -0.05, 0.05, 0.1]);
  return {
    msg: `Our portfolio: ${p(w1, 0)} in a consumer-staples fund (β ${nt(b[0], 1)}), ${p(w2, 0)} in a tech fund (β ${nt(b[1], 1)}), ${p(w3, 0)} in a utilities fund (β ${nt(b[2], 1)}). What's the portfolio beta? If the market moves ${sgn(mkt, 0)}, what move do we expect?`,
    hint: 'Portfolio beta is the weighted average of the betas.',
    answer: `βp = ${nt(w1, 2)} × ${nt(b[0], 1)} + ${nt(w2, 2)} × ${nt(b[1], 1)} + ${nt(w3, 2)} × ${nt(b[2], 1)} ≈ **${nt(bp, 2)}**. Expected move ≈ βp × market move = ${nt(bp, 2)} × ${sgn(mkt, 0)} ≈ **${sgn(bp * mkt, 1)}** (ignoring alpha and company-specific noise). Beta tells you exposure to market moves; to lower it you shift weight to low-beta assets.`,
    keys: [`Portfolio beta ≈ ${nt(bp, 2)}`, `Expected move ≈ ${sgn(bp * mkt, 1)}`, 'Weighted average of betas']
  };
}});

TPL({ id: 'tp-alpha', tier: 5, topic: inv, personas: ['ingrid', 'yuki'], gen(r) {
  const rf = r.step(0.01, 0.04, 0.005), rm = rf + r.step(0.04, 0.09, 0.005), b = r.step(0.7, 1.5, 0.1), rp = rf + b * (rm - rf) + r.step(-0.03, 0.03, 0.0025);
  const capm = rf + b * (rm - rf), alpha = rp - capm;
  return {
    msg: `A manager we hired returned ${p(rp)} last year with a beta of ${nt(b, 1)}. The market returned ${p(rm)} and the risk-free rate was ${p(rf)}. She says she "beat the market". Did she add value?`,
    hint: "Jensen's alpha = actual return − CAPM-predicted return.",
    answer: `CAPM-expected return = ${p(rf)} + ${nt(b, 1)} × (${p(rm)} − ${p(rf)}) = ${p(capm)}. Jensen's alpha = ${p(rp)} − ${p(capm)} = **${sgn(alpha)}**. ${alpha > 0 ? 'Positive alpha: she earned more than her market risk alone explains.' : alpha < 0 ? 'Negative alpha: once her higher or lower market exposure is accounted for, she underperformed.' : 'Zero alpha: her return is exactly what her market exposure explains.'} Beating the market index isn't enough if it came only from taking more market risk (β > 1). One year is also too short to separate skill from luck.`,
    keys: [`CAPM return ${p(capm)}`, `Alpha ≈ ${sgn(alpha)}`, 'Adjusts for beta; one year is not proof of skill']
  };
}});

TPL({ id: 'tp-dca', tier: 3, topic: inv, personas: ['tom', 'priya'], gen(r) {
  const A = r.step(100, 500, 50), p1 = r.step(20, 60, 1), p2 = +(p1 * r.step(0.6, 0.9, 0.05)).toFixed(2), p3 = +(p1 * r.step(0.9, 1.3, 0.05)).toFixed(2);
  const sh = A / p1 + A / p2 + A / p3, cost = 3 * A / sh, avgP = (p1 + p2 + p3) / 3;
  return {
    msg: `I invest ${e(A)} every month in an ETF. The price was ${e(p1, 2)}, then ${e(p2, 2)}, then ${e(p3, 2)}. How many units do I have, what's my average cost per unit, and why is it lower than the average price?`,
    hint: 'Units = amount / price each month. Average cost = total spent / units.',
    answer: `Units: ${e(A)}/${e(p1, 2)} + ${e(A)}/${e(p2, 2)} + ${e(A)}/${e(p3, 2)} ≈ **${nt(sh, 3)}**. Average cost = ${e(3 * A)} / ${nt(sh, 3)} ≈ **${e(cost, 2)}**, versus an average price of ${e(avgP, 2)}. A fixed euro amount buys more units when the price is low and fewer when it's high, so the average cost (a harmonic mean) is below the simple average price. That's the "cost averaging" effect, though it doesn't guarantee a better return than investing all at once.`,
    keys: [`≈ ${nt(sh, 2)} units`, `Average cost ≈ ${e(cost, 2)} vs average price ${e(avgP, 2)}`, 'Explains more units bought when cheap']
  };
}});

TPL({ id: 'tp-split', tier: 1, topic: inv, personas: ['tom'], gen(r) {
  const k = r.pick([2, 3, 4, 5, 10]), P = r.step(100, 900, 10), s = r.int(5, 60);
  return {
    msg: `My company announced a ${k}-for-1 stock split. I own ${s} shares at ${e(P)} each. What will I own after the split? Am I richer?`,
    hint: 'Count shares and price per share before and after.',
    answer: `After a ${k}-for-1 split you hold ${s} × ${k} = **${s * k} shares**, and the price adjusts to about ${e(P)} / ${k} = **${e(P / k, 2)}**. Your holding stays ${e(s * P)}: **you're not richer**. A split just cuts the pie into more slices; it may make shares easier to trade, but it doesn't change the company's value or your ownership share.`,
    keys: [`${s * k} shares at ≈ ${e(P / k, 2)}`, `Total value unchanged at ${e(s * P)}`, 'Split does not create value']
  };
}});

// ───────── Fixed income ─────────
const bondPrice = (F, c, y, nY, f = 1) => { let pv = 0; for (let t = 1; t <= nY * f; t++) pv += (F * c / f) / (1 + y / f) ** t; return pv + F / (1 + y / f) ** (nY * f); };

TPL({ id: 'q308', tier: 3, topic: fi, personas: ['brandt', 'ingrid'], gen(r) {
  const c = r.step(0.02, 0.08, 0.005), nY = r.int(2, 5); let y = c + r.pick([-1, 1]) * r.step(0.005, 0.02, 0.005); if (y < 0.005) y = c + 0.01;
  const C = 1000 * c, P = bondPrice(1000, c, y, nY);
  const terms = []; for (let t = 1; t <= nY; t++) { const cf = t === nY ? C + 1000 : C; terms.push(`${e(cf, cf % 1 ? 2 : 0)}/${nt(1 + y, 3)}^${t} = ${e(cf / (1 + y) ** t, 2)}`); }
  const where = P < 1000 ? 'below par (at a discount)' : 'above par (at a premium)';
  return {
    msg: `A bond: €1,000 face value, ${p(c)} annual coupon, ${nY} years to maturity. Similar bonds now yield ${p(y)}. What should it cost? Above or below €1,000?`,
    hint: `Discount each coupon and the final repayment at ${p(y)}.`,
    answer: `Cash flows: ${e(C, C % 1 ? 2 : 0)} a year plus €1,000 at maturity. Price = ${terms.join(' + ')} ≈ **${e(P, 2)}**. It trades **${where}** because its ${p(c)} coupon is ${c < y ? 'below' : 'above'} the ${p(y)} market yield. Rule: coupon < yield → discount; coupon > yield → premium; equal → par.`,
    keys: ['Discounts every cash flow at the market yield', `Price ≈ ${e(P, 0)}`, `${P < 1000 ? 'Below' : 'Above'} par because coupon ${c < y ? '<' : '>'} yield`]
  };
}});

TPL({ id: 'q408', tier: 4, topic: fi, personas: ['brandt', 'ingrid'], gen(r) {
  const D = r.step(2, 15, 0.5), dy = r.pick([-1, 1]) * r.step(0.0025, 0.02, 0.0025);
  return {
    msg: `My bond fund factsheet says "modified duration ${nt(D, 1)}". If yields ${dy > 0 ? 'rise' : 'fall'} by ${nt(Math.abs(dy) * 100, 2)} percentage points, roughly what happens to its price? And why are long bonds riskier?`,
    hint: '%ΔP ≈ −Duration × Δy.',
    answer: `%ΔPrice ≈ −D_mod × Δy = −${nt(D, 1)} × ${sgn(dy)} ≈ **${sgn(-D * dy, 2)}**. (Convexity makes the true change slightly more favourable than this linear estimate, especially for big moves.) Duration measures interest-rate sensitivity, roughly the weighted average time until cash flows arrive. Long, low-coupon bonds have more value far in the future, so rate changes hit their present value harder.`,
    keys: [`≈ ${sgn(-D * dy, 1)} price change`, 'Uses −D × Δy', 'Duration = rate sensitivity; longer cash flows → more sensitive']
  };
}});

TPL({ id: 'tp-current-yield', tier: 2, topic: fi, personas: ['brandt'], gen(r) {
  const c = r.step(0.02, 0.07, 0.005), P = r.step(85, 115, 0.5), C = 1000 * c, price = P * 10;
  const cy = C / price;
  return {
    msg: `A bond with a ${p(c)} coupon on €1,000 face is quoted at ${nt(P, 1)} (% of face). What's its current yield? Is that the same as the yield to maturity?`,
    hint: 'Current yield = annual coupon / current price.',
    answer: `Price = ${nt(P, 1)}% × €1,000 = ${e(price, 2)}. Annual coupon = ${e(C, 2)}. Current yield = ${e(C, 2)} / ${e(price, 2)} ≈ **${p(cy, 2)}**. It's **not** the yield to maturity: current yield ignores the ${price < 1000 ? `gain of ${e(1000 - price, 2)}` : `loss of ${e(price - 1000, 2)}`} from the price moving to par by maturity, so YTM is ${price < 1000 ? 'higher' : 'lower'} than the current yield here.`,
    keys: [`Current yield ≈ ${p(cy, 1)}`, 'Coupon / price', `Not YTM; YTM ${price < 1000 ? 'higher' : 'lower'} due to pull to par`]
  };
}});

TPL({ id: 'tp-zero', tier: 3, topic: fi, personas: ['brandt', 'ingrid'], gen(r) {
  const F = r.pick([1000, 10000, 100000]), y = r.step(0.01, 0.06, 0.0025), n = r.int(2, 30), P = F / (1 + y) ** n;
  return {
    msg: `A zero-coupon bond pays ${e(F)} in ${n} years and nothing before. If the market yield is ${p(y)}, what's its price? Where does the investor's return come from?`,
    hint: 'Only one cash flow: price = F / (1 + y)^n.',
    answer: `Price = ${e(F)} / (1 + ${nt(y, 4)})^${n} ≈ **${e(P, 2)}**. With no coupons, the whole return is the **discount**: the investor pays ${e(P, 2)} and receives ${e(F)} at maturity, a gain of ${e(F - P, 2)}, which equals compounding at ${p(y)} a year. Zeros have duration equal to their maturity, so they're very sensitive to rate changes.`,
    keys: [`Price ≈ ${e(P, 0)}`, 'F / (1+y)^n', 'Return comes entirely from the price discount; high rate sensitivity']
  };
}});

TPL({ id: 'tp-ytm-approx', tier: 4, topic: fi, personas: ['ingrid', 'brandt'], gen(r) {
  const c = r.step(0.02, 0.07, 0.005), nY = r.int(3, 10), yTrue = Math.max(0.005, c + r.pick([-1, 1]) * r.step(0.005, 0.025, 0.0025));
  const P = Math.round(bondPrice(1000, c, yTrue, nY) * 100) / 100, C = 1000 * c, approx = (C + (1000 - P) / nY) / ((1000 + P) / 2);
  return {
    msg: `A ${nY}-year bond with a ${p(c)} annual coupon and €1,000 face trades at ${e(P, 2)}. Estimate its yield to maturity. What does YTM assume?`,
    hint: 'Approximation: YTM ≈ [C + (F − P)/n] / [(F + P)/2].',
    answer: `Approximate YTM = [${e(C, 2)} + (${e(1000)} − ${e(P, 2)}) / ${nY}] / [(${e(1000)} + ${e(P, 2)}) / 2] ≈ **${p(approx, 2)}**. The exact YTM (solving price = PV of cash flows) is about ${p(yTrue, 2)}. YTM is the single discount rate that makes the PV of all cash flows equal the price; it assumes you hold to maturity, the issuer pays in full, and coupons are reinvested at the same yield.`,
    keys: [`YTM ≈ ${p(yTrue, 1)} (approx. ${p(approx, 1)})`, 'Combines coupon income and pull to par', 'Assumptions: held to maturity, no default, reinvestment at YTM']
  };
}});

TPL({ id: 'q606', tier: 6, topic: fi, personas: ['brandt', 'ingrid'], gen(r) {
  const real = r.step(-0.005, 0.015, 0.001), be0 = r.step(0.015, 0.035, 0.001), nom = +((1 + real) * (1 + be0) - 1).toFixed(3);
  const be = (1 + nom) / (1 + real) - 1;
  return {
    msg: `My bank offers a 10-year inflation-linked German bond with a real yield of ${p(real, 1)}, while the normal 10-year Bund yields ${p(nom, 1)}. Which should I buy? What's the "breakeven inflation"?`,
    hint: 'Fisher: (1 + nominal) = (1 + real) × (1 + inflation).',
    answer: `Breakeven inflation ≈ nominal − real = ${p(nom, 1)} − ${p(real, 1)} = ${p(nom - real, 1)}; exactly (1 + ${nt(nom, 3)}) / (1 + ${nt(real, 3)}) − 1 ≈ **${p(be, 2)}**. If inflation averages more than that over 10 years, the linker wins; less, the nominal Bund wins. It depends on your inflation view and how much you value protection against inflation surprises. Breakeven also contains an inflation risk premium and liquidity differences.`,
    keys: [`Breakeven ≈ ${p(be, 1)}`, 'Fisher relation', 'Linker wins if realised inflation > breakeven; mentions hedge value or premia']
  };
}});

TPL({ id: 'tp-convexity', tier: 6, topic: fi, personas: ['ingrid'], gen(r) {
  const D = r.step(4, 14, 0.5), C = Math.round(D * D * r.step(0.9, 1.3, 0.05)), dy = r.pick([-1, 1]) * r.step(0.01, 0.025, 0.0025);
  const lin = -D * dy, conv = 0.5 * C * dy * dy, tot = lin + conv;
  return {
    msg: `Our bond portfolio has modified duration ${nt(D, 1)} and convexity ${C}. Estimate the price change if yields ${dy > 0 ? 'rise' : 'fall'} by ${nt(Math.abs(dy) * 100, 2)} percentage points, with and without the convexity adjustment. Why does convexity matter?`,
    hint: '%ΔP ≈ −D × Δy + ½ × C × (Δy)².',
    answer: `Duration only: −${nt(D, 1)} × ${sgn(dy)} = ${sgn(lin, 2)}. Convexity term: ½ × ${C} × (${nt(dy, 4)})² = +${p(conv, 2)}. Total ≈ **${sgn(tot, 2)}**. Convexity is always positive for plain bonds, so it reduces losses when yields rise and adds to gains when they fall. Duration alone is a straight-line approximation of a curved price-yield relationship, so it gets worse for big moves.`,
    keys: [`Duration estimate ${sgn(lin, 1)}`, `With convexity ≈ ${sgn(tot, 1)}`, 'Convexity cushions losses / boosts gains']
  };
}});

TPL({ id: 'tp-forward', tier: 5, topic: fi, personas: ['felix', 'ingrid'], gen(r) {
  const s1 = r.step(0.01, 0.05, 0.0025), s2 = Math.max(0.0025, s1 + r.step(-0.005, 0.015, 0.0025)), f = (1 + s2) ** 2 / (1 + s1) - 1;
  return {
    msg: `The 1-year spot rate is ${p(s1)} and the 2-year spot rate is ${p(s2)} (annual compounding). What 1-year rate, one year from now, is implied? What does it mean?`,
    hint: '(1 + s₂)² = (1 + s₁) × (1 + f₁,₁).',
    answer: `No-arbitrage: investing for 2 years at ${p(s2)} must equal 1 year at ${p(s1)} then rolling at the forward rate. f₁,₁ = (1 + ${nt(s2, 4)})² / (1 + ${nt(s1, 4)}) − 1 ≈ **${p(f)}**. It's the rate you can lock in today for a loan starting in one year. ${f > s1 ? 'An upward-sloping curve implies forward rates above spot rates' : 'A downward slope implies forward rates below spot'}; forwards reflect expected future rates plus any term premium.`,
    keys: [`Forward ≈ ${p(f, 2)}`, 'Uses (1+s₂)² / (1+s₁) − 1', 'Interprets as lock-in / expectations plus term premium']
  };
}});

TPL({ id: 'tp-expected-loss', tier: 5, topic: fi, personas: ['sam', 'ingrid'], gen(r) {
  const rf = r.step(0.015, 0.04, 0.0025), pd = r.step(0.005, 0.05, 0.0025), rec = r.step(0.3, 0.6, 0.05), sp = pd * (1 - rec) + r.step(0.003, 0.02, 0.001), y = rf + sp;
  const el = pd * (1 - rec), net = y - el;
  return {
    msg: `A corporate bond yields ${p(y)} while the Bund yields ${p(rf)}. Analysts estimate an annual default probability of ${p(pd, 2)} and ${p(rec, 0)} recovery if it defaults. What's the expected loss per year, and what's the expected return after losses?`,
    hint: 'Expected loss = PD × (1 − recovery).',
    answer: `Credit spread = ${p(y)} − ${p(rf)} = ${p(sp)}. Loss given default = 1 − ${p(rec, 0)} = ${p(1 - rec, 0)}. Expected loss ≈ ${p(pd, 2)} × ${p(1 - rec, 0)} = **${p(el, 2)}** a year. Expected return ≈ ${p(y)} − ${p(el, 2)} ≈ **${p(net, 2)}**, so the spread more than compensates for expected losses by ${p(sp - el, 2)}. That extra is a risk premium for uncertainty, illiquidity and default clustering in recessions.`,
    keys: [`Expected loss ≈ ${p(el, 2)}`, `Expected return ≈ ${p(net, 2)}`, 'Spread = expected loss + risk/liquidity premium']
  };
}});

TPL({ id: 'tp-accrued', tier: 4, topic: fi, personas: ['brandt'], gen(r) {
  const c = r.step(0.02, 0.07, 0.005), days = r.int(20, 170), clean = r.step(94, 106, 0.25);
  const semi = 1000 * c / 2, acc = semi * days / 180, dirty = clean * 10 + acc;
  return {
    msg: `I'm buying a bond with a ${p(c)} coupon paid twice a year, €1,000 face. It's quoted at ${nt(clean, 2)} and the last coupon was ${days} days ago (30/360 convention). What will I actually pay, and why?`,
    hint: 'Accrued interest = semi-annual coupon × days since last coupon / 180.',
    answer: `Semi-annual coupon = ${e(semi, 2)}. Accrued interest = ${e(semi, 2)} × ${days}/180 ≈ ${e(acc, 2)}. Clean price = ${nt(clean, 2)}% × €1,000 = ${e(clean * 10, 2)}. You pay the **dirty price** ≈ ${e(clean * 10, 2)} + ${e(acc, 2)} = **${e(dirty, 2)}**. The seller earned the interest for the days they held the bond, but you'll receive the whole next coupon, so you compensate them now. Quotes are clean so prices don't jump on coupon dates.`,
    keys: [`Accrued ≈ ${e(acc, 2)}`, `Dirty price ≈ ${e(dirty, 2)}`, 'Explains clean vs dirty price']
  };
}});
})();
