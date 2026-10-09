// Randomised templates: corporate finance, valuation, derivatives, banking, real estate, startups.
(() => {
const { n, nt, e, p, sgn } = FMT;
const cf = 'Corporate finance', val = 'Valuation', der = 'Derivatives', bank = 'Banking & credit', re = 'Real estate', vc = 'Venture & startups', fa = 'Financial analysis';
const k = (x) => (Math.abs(x) >= 1e6 ? '€' + nt(x / 1e6, 2) + 'm' : e(x, 0));

// ───────── Capital budgeting ─────────
TPL({ id: 'q304', tier: 3, topic: cf, personas: ['kat', 'adeyemi'], gen(r) {
  const I = r.step(50000, 500000, 10000), rt = r.step(0.06, 0.14, 0.01), cf1 = Math.round(I * r.step(0.5, 0.65, 0.01) / 1000) * 1000;
  const pv1 = cf1 / (1 + rt), pv2 = cf1 / (1 + rt) ** 2, npv = pv1 + pv2 - I;
  return {
    msg: `Investors keep asking about NPV. A project costs ${e(I)} today and pays ${e(cf1)} at the end of each of the next 2 years. Our discount rate is ${p(rt, 0)}. What's the NPV? Should we do it?`,
    hint: 'Discount each cash flow: CF / (1 + r)^t, then subtract the cost.',
    answer: `NPV = −${e(I)} + ${e(cf1)}/${nt(1 + rt, 2)} + ${e(cf1)}/${nt(1 + rt, 2)}² = −${e(I)} + ${e(pv1, 0)} + ${e(pv2, 0)} ≈ **${e(npv, 0)}**. ${npv >= 0 ? 'NPV ≥ 0: the project earns more than the required return, so **accept** it.' : 'NPV < 0: it earns less than the required return, so **reject** it.'} Simply adding ${e(2 * cf1)} − ${e(I)} = ${e(2 * cf1 - I)} ignores the time value of money.`,
    keys: ['Discounts each cash flow', `NPV ≈ ${e(npv, 0)}`, npv >= 0 ? 'Accept (NPV ≥ 0)' : 'Reject (NPV < 0)']
  };
}});

TPL({ id: 'tp-npv3', tier: 4, topic: cf, personas: ['adeyemi', 'kat'], gen(r) {
  const I = r.step(100000, 900000, 50000), rt = r.step(0.07, 0.13, 0.01);
  const c = [r.step(0.2, 0.4, 0.01), r.step(0.3, 0.5, 0.01), r.step(0.3, 0.6, 0.01)].map((x) => Math.round(I * x / 1000) * 1000);
  const pv = c.map((x, i) => x / (1 + rt) ** (i + 1)), npv = pv.reduce((a, b) => a + b, 0) - I;
  return {
    msg: `A new machine costs ${e(I)}. Expected net cash flows: ${e(c[0])} in year 1, ${e(c[1])} in year 2, ${e(c[2])} in year 3, then nothing. Our cost of capital is ${p(rt, 0)}. Do we buy it?`,
    hint: 'Discount each year separately and add them up.',
    answer: `PVs: ${c.map((x, i) => `${e(x)}/${nt(1 + rt, 2)}^${i + 1} = ${e(pv[i], 0)}`).join('; ')}. Sum = ${e(npv + I, 0)}. NPV = ${e(npv + I, 0)} − ${e(I)} ≈ **${e(npv, 0)}** → **${npv >= 0 ? 'buy it' : "don't buy it"}**. NPV directly measures the value created today after covering the opportunity cost of capital.`,
    keys: ['Discounts each year separately', `NPV ≈ ${e(npv, 0)}`, `Decision: ${npv >= 0 ? 'accept' : 'reject'}`]
  };
}});

TPL({ id: 'tp-irr1', tier: 2, topic: cf, personas: ['kat', 'raj', 'olena'], gen(r) {
  const I = r.step(5000, 50000, 1000), X = Math.round(I * r.step(1.03, 1.2, 0.01)), h = r.step(0.05, 0.12, 0.01);
  const irr = X / I - 1;
  return {
    msg: `If I invest ${e(I)} in new equipment now, it brings in ${e(X)} in a year and then it's done. What's the rate of return (IRR)? I'd normally want at least ${p(h, 0)}.`,
    hint: 'One period: IRR = payoff / investment − 1.',
    answer: `IRR solves 0 = −${e(I)} + ${e(X)} / (1 + IRR), so IRR = ${e(X)} / ${e(I)} − 1 ≈ **${p(irr, 1)}**. ${irr >= h ? `That beats the ${p(h, 0)} hurdle, so it's worth doing` : `That's below the ${p(h, 0)} hurdle, so it's not worth it`}. Equivalently, NPV at ${p(h, 0)} = ${e(X / (1 + h) - I, 0)}. IRR is the discount rate at which NPV is zero.`,
    keys: [`IRR ≈ ${p(irr, 1)}`, `${irr >= h ? 'Above' : 'Below'} the ${p(h, 0)} hurdle`, 'IRR = rate where NPV = 0']
  };
}});

TPL({ id: 'tp-irr2', tier: 5, topic: cf, personas: ['adeyemi', 'kat'], gen(r) {
  const I = r.step(100000, 500000, 10000), C = Math.round(I * r.step(0.53, 0.68, 0.01) / 1000) * 1000;
  const x = (-C + Math.sqrt(C * C + 4 * C * I)) / (2 * C), irr = 1 / x - 1, h = r.step(0.06, 0.14, 0.01);
  return {
    msg: `Project: invest ${e(I)} today, receive ${e(C)} at the end of years 1 and 2. What's the IRR? Our hurdle rate is ${p(h, 0)}.`,
    hint: `Solve ${e(I)} = C/(1+r) + C/(1+r)². Substitute x = 1/(1+r) to get a quadratic, or try rates until NPV ≈ 0.`,
    answer: `IRR solves ${e(I)} = ${e(C)}/(1+r) + ${e(C)}/(1+r)². With x = 1/(1+r): ${e(C)}x² + ${e(C)}x − ${e(I)} = 0 → x ≈ ${nt(x, 5)}, so **IRR ≈ ${p(irr, 2)}** (trial and error gets the same). ${irr >= h ? 'Above' : 'Below'} the ${p(h, 0)} hurdle → **${irr >= h ? 'accept' : 'reject'}**. Check: at ${p(h, 0)}, NPV = ${e(C / (1 + h) + C / (1 + h) ** 2 - I, 0)}.`,
    keys: [`IRR ≈ ${p(irr, 1)}`, 'Sets NPV = 0 (quadratic or iteration)', `${irr >= h ? 'Accept' : 'Reject'} vs ${p(h, 0)} hurdle`]
  };
}});

TPL({ id: 'tp-payback', tier: 2, topic: cf, personas: ['olena', 'diego', 'raj'], gen(r, pid) {
  const I = r.step(6000, 60000, 1000), C = Math.round(I * r.step(0.15, 0.45, 0.01) / 100) * 100, pb = I / C;
  const thing = { olena: 'a second oven', diego: 'a new kitchen extractor that saves energy', raj: 'a packing machine' }[pid];
  return {
    msg: `I'm thinking about ${thing} for ${e(I)}. It should save or earn ${e(C)} a year. How long until it pays for itself? Is payback a good way to decide?`,
    hint: 'Payback = investment / annual cash flow (when cash flows are even).',
    answer: `Payback period = ${e(I)} / ${e(C)} ≈ **${nt(pb, 1)} years**. It's simple and highlights liquidity risk, but it has two big flaws: it **ignores the time value of money** and **ignores cash flows after the payback date**. A project paying back in 3 years and then stopping can look better than one that pays back in 4 and earns for 15 more. NPV is the better decision rule.`,
    keys: [`Payback ≈ ${nt(pb, 1)} years`, 'Ignores time value of money', 'Ignores cash flows after payback; NPV better']
  };
}});

TPL({ id: 'tp-disc-payback', tier: 4, topic: cf, personas: ['adeyemi', 'kat'], gen(r) {
  const I = r.step(40000, 200000, 5000), C = Math.round(I * r.step(0.22, 0.35, 0.01) / 100) * 100, rt = r.step(0.06, 0.12, 0.01);
  let cum = -I, t = 0, rows = [];
  while (cum < 0 && t < 30) { t++; const pv = C / (1 + rt) ** t; const prev = cum; cum += pv; rows.push(e(pv, 0)); if (cum >= 0) { var frac = t - 1 + (-prev) / pv; } }
  const simple = I / C;
  return {
    msg: `Investment ${e(I)}, then ${e(C)} a year. Discount rate ${p(rt, 0)}. What's the simple payback and the discounted payback?`,
    hint: 'For discounted payback, add up discounted cash flows until they cover the investment.',
    answer: `Simple payback = ${e(I)} / ${e(C)} ≈ **${nt(simple, 2)} years**. Discounted cash flows: ${rows.join(', ')}… Their cumulative sum covers ${e(I)} during year ${t}: discounted payback ≈ **${nt(frac, 2)} years**. It's longer because later cash flows are worth less today. It still ignores everything after the cut-off, so NPV remains the better rule.`,
    keys: [`Simple ≈ ${nt(simple, 1)} years`, `Discounted ≈ ${nt(frac, 1)} years`, 'Discounted is longer due to time value']
  };
}});

TPL({ id: 'q402', tier: 4, topic: cf, personas: ['kat', 'adeyemi'], gen(r) {
  const E = r.step(2, 20, 0.5), D = r.step(1, 15, 0.5), ke = r.step(0.08, 0.15, 0.005), kd = r.step(0.03, 0.08, 0.005), t = r.pick([0.15, 0.2, 0.25, 0.3]);
  const V = E + D, we = E / V, wd = D / V, kdt = kd * (1 - t), w = we * ke + wd * kdt;
  return {
    msg: `Due diligence: we're financed by €${nt(E, 1)}m equity (cost ${p(ke)}) and €${nt(D, 1)}m debt (pre-tax cost ${p(kd)}). Tax rate is ${p(t, 0)}. What's our WACC? Why the tax adjustment?`,
    hint: 'Weights E/V and D/V; cost of debt × (1 − tax).',
    answer: `V = €${nt(V, 1)}m → E/V ≈ ${p(we, 1)}, D/V ≈ ${p(wd, 1)}. After-tax cost of debt = ${p(kd)} × (1 − ${nt(t, 2)}) = ${p(kdt)}. WACC = ${p(we, 1)} × ${p(ke)} + ${p(wd, 1)} × ${p(kdt)} ≈ **${p(w)}**. Interest is tax-deductible, so each euro of interest saves ${p(t, 0)} in tax (the interest tax shield). WACC is the return average-risk projects must earn.`,
    keys: [`Weights ${p(we, 0)} / ${p(wd, 0)}`, `After-tax debt ${p(kdt)}`, `WACC ≈ ${p(w)}`]
  };
}});

TPL({ id: 'tp-kd-after-tax', tier: 3, topic: cf, personas: ['adeyemi', 'raj'], gen(r) {
  const L = r.step(100000, 2000000, 50000), kd = r.step(0.03, 0.09, 0.005), t = r.pick([0.15, 0.2, 0.25, 0.3]), I = L * kd;
  return {
    msg: `We pay ${p(kd)} interest on a ${e(L)} loan. Our accountant says the "real" cost is lower because of tax. Our profit tax rate is ${p(t, 0)}. What's the after-tax cost in % and in euros per year?`,
    hint: 'Interest reduces taxable profit. After-tax cost = rate × (1 − tax rate).',
    answer: `Interest = ${e(L)} × ${p(kd)} = ${e(I)} a year. It reduces taxable profit, saving ${p(t, 0)} × ${e(I)} = ${e(I * t)} in tax. Net cost = **${e(I * (1 - t))}**, i.e. after-tax rate = ${p(kd)} × (1 − ${nt(t, 2)}) = **${p(kd * (1 - t))}**. This only applies if the company is profitable enough to use the deduction (and within interest-deduction limits).`,
    keys: [`After-tax rate ${p(kd * (1 - t))}`, `Net cost ≈ ${e(I * (1 - t))}/year`, 'Requires taxable profits to use the shield']
  };
}});

TPL({ id: 'tp-pi', tier: 4, topic: cf, personas: ['adeyemi'], gen(r) {
  const I = r.step(100000, 500000, 10000), C = Math.round(I * r.step(0.18, 0.32, 0.01) / 1000) * 1000, y = r.int(4, 8), rt = r.step(0.06, 0.12, 0.01);
  const pv = C * (1 - (1 + rt) ** -y) / rt, pi = pv / I;
  return {
    msg: `Capital is limited this year. Project X costs ${e(I)} and returns ${e(C)} a year for ${y} years. Cost of capital ${p(rt, 0)}. What's its NPV and profitability index, and why is PI useful when capital is rationed?`,
    hint: 'PI = PV of future cash flows / initial investment.',
    answer: `PV of inflows = ${e(C)} × [1 − ${nt(1 + rt, 2)}^−${y}] / ${nt(rt, 2)} ≈ ${e(pv, 0)}. NPV ≈ **${e(pv - I, 0)}**. PI = ${e(pv, 0)} / ${e(I)} ≈ **${nt(pi, 2)}**: each euro invested returns ${e(pi, 2)} of present value. ${pi > 1 ? 'PI > 1 means NPV > 0.' : 'PI < 1 means NPV < 0.'} With a limited budget, ranking projects by PI picks those creating the most value per euro of scarce capital.`,
    keys: [`NPV ≈ ${e(pv - I, 0)}`, `PI ≈ ${nt(pi, 2)}`, 'PI ranks value per euro under capital rationing']
  };
}});

// ───────── Leverage & capital structure ─────────
TPL({ id: 'tp-dol', tier: 5, topic: cf, personas: ['adeyemi', 'diego'], gen(r) {
  const Q = r.step(5000, 50000, 1000), P = r.step(20, 120, 5), v = +(P * r.step(0.3, 0.6, 0.05)).toFixed(2), CM = (P - v) * Q, FC = Math.round(CM * r.step(0.5, 0.85, 0.05) / 1000) * 1000;
  const ebit = CM - FC, dol = CM / ebit, s = r.step(0.05, 0.2, 0.05);
  return {
    msg: `We sell ${n(Q)} units at ${e(P)} with variable costs of ${e(v, 2)} per unit and fixed costs of ${e(FC)}. What's our degree of operating leverage, and what happens to operating profit if sales volume rises ${p(s, 0)}?`,
    hint: 'DOL = contribution margin / EBIT.',
    answer: `Contribution margin = (${e(P)} − ${e(v, 2)}) × ${n(Q)} = ${e(CM, 0)}. EBIT = ${e(CM, 0)} − ${e(FC)} = ${e(ebit, 0)}. DOL = ${e(CM, 0)} / ${e(ebit, 0)} ≈ **${nt(dol, 2)}**. A ${p(s, 0)} sales increase raises EBIT by about ${nt(dol, 2)} × ${p(s, 0)} ≈ **${p(dol * s, 1)}** (to ≈ ${e(ebit * (1 + dol * s), 0)}). High fixed costs mean high operating leverage: profits swing more than sales, in both directions.`,
    keys: [`EBIT = ${e(ebit, 0)}`, `DOL ≈ ${nt(dol, 2)}`, `EBIT change ≈ ${sgn(dol * s, 1)}`]
  };
}});

TPL({ id: 'tp-dfl', tier: 5, topic: cf, personas: ['adeyemi', 'yuki'], gen(r) {
  const EBIT = r.step(1, 20, 0.5) * 1e6, Int = Math.round(EBIT * r.step(0.1, 0.5, 0.05) / 1e4) * 1e4, t = r.pick([0.2, 0.25, 0.3]), sh = r.step(1, 10, 0.5) * 1e6;
  const NI = (EBIT - Int) * (1 - t), eps = NI / sh, dfl = EBIT / (EBIT - Int), ch = r.step(0.1, 0.25, 0.05);
  return {
    msg: `EBIT ${k(EBIT)}, interest expense ${k(Int)}, tax ${p(t, 0)}, ${nt(sh / 1e6, 1)}m shares. What's EPS and the degree of financial leverage? If EBIT falls ${p(ch, 0)}, what happens to EPS?`,
    hint: 'EPS = (EBIT − interest)(1 − t) / shares. DFL = EBIT / (EBIT − interest).',
    answer: `Net income = (${k(EBIT)} − ${k(Int)}) × (1 − ${nt(t, 2)}) = ${k(NI)}. EPS = ${k(NI)} / ${nt(sh / 1e6, 1)}m ≈ **${e(eps, 2)}**. DFL = ${k(EBIT)} / ${k(EBIT - Int)} ≈ **${nt(dfl, 2)}**. A ${p(ch, 0)} EBIT drop cuts EPS by ≈ ${nt(dfl, 2)} × ${p(ch, 0)} = **${p(dfl * ch, 1)}** (to ≈ ${e(eps * (1 - dfl * ch), 2)}). Fixed interest magnifies EBIT changes for shareholders.`,
    keys: [`EPS ≈ ${e(eps, 2)}`, `DFL ≈ ${nt(dfl, 2)}`, `EPS falls ≈ ${p(dfl * ch, 1)}`]
  };
}});

TPL({ id: 'tp-hamada', tier: 6, topic: cf, personas: ['kat', 'yuki'], gen(r) {
  const bL = r.step(0.9, 1.8, 0.05), de = r.step(0.2, 1.2, 0.1), t = r.pick([0.2, 0.25, 0.3]), de2 = r.step(0.1, 1.5, 0.1);
  const bU = bL / (1 + (1 - t) * de), bN = bU * (1 + (1 - t) * de2);
  return {
    msg: `A comparable listed company has an equity beta of ${nt(bL, 2)} with a debt/equity ratio of ${nt(de, 1)} and tax rate ${p(t, 0)}. Our target D/E is ${nt(de2, 1)}. What beta should we use for our equity?`,
    hint: 'Unlever with Hamada: βU = βL / [1 + (1 − t)D/E], then relever at your D/E.',
    answer: `Unlever: βU = ${nt(bL, 2)} / [1 + (1 − ${nt(t, 2)}) × ${nt(de, 1)}] ≈ **${nt(bU, 3)}** (pure business risk). Relever: βL = ${nt(bU, 3)} × [1 + (1 − ${nt(t, 2)}) × ${nt(de2, 1)}] ≈ **${nt(bN, 2)}**. Equity beta rises with leverage because shareholders bear the business risk on a thinner equity cushion. You can't copy another firm's beta directly when capital structures differ.`,
    keys: [`Unlevered β ≈ ${nt(bU, 2)}`, `Relevered β ≈ ${nt(bN, 2)}`, 'Explains leverage raises equity risk']
  };
}});

TPL({ id: 'tp-taxshield', tier: 5, topic: cf, personas: ['kat', 'adeyemi'], gen(r) {
  const D = r.step(1, 50, 1) * 1e6, kd = r.step(0.03, 0.07, 0.005), t = r.pick([0.2, 0.25, 0.3]);
  const ann = D * kd * t, pv = D * t;
  return {
    msg: `We're considering adding ${k(D)} of permanent debt at ${p(kd)}. Tax rate ${p(t, 0)}. How much is the interest tax shield worth per year, and in total? Should we then borrow as much as possible?`,
    hint: 'Annual shield = interest × tax rate. For permanent debt discounted at kd, PV = T × D.',
    answer: `Annual interest = ${k(D * kd)}; tax saved = ${p(t, 0)} × ${k(D * kd)} = **${k(ann)} per year**. For perpetual debt discounted at the cost of debt: PV = ${k(ann)} / ${p(kd)} = T × D = **${k(pv)}**. But no, not maximal borrowing: higher leverage raises **financial distress and bankruptcy costs**, agency costs and loss of flexibility. Trade-off theory: borrow until the marginal tax benefit equals the marginal distress cost.`,
    keys: [`Annual shield ${k(ann)}`, `PV = T × D = ${k(pv)}`, 'Distress costs limit leverage (trade-off)']
  };
}});

// ───────── Working capital ─────────
TPL({ id: 'tp-ccc', tier: 4, topic: fa, personas: ['raj', 'adeyemi'], gen(r) {
  const S = r.step(2, 50, 1) * 1e6, cogs = S * r.step(0.5, 0.75, 0.05), inv = cogs * r.step(40, 120, 5) / 365, ar = S * r.step(20, 70, 5) / 365, ap = cogs * r.step(20, 60, 5) / 365;
  const dio = inv / cogs * 365, dso = ar / S * 365, dpo = ap / cogs * 365, ccc = dio + dso - dpo;
  return {
    msg: `Annual sales ${k(S)}, cost of goods sold ${k(cogs)}. On the balance sheet: inventory ${k(inv)}, receivables ${k(ar)}, payables ${k(ap)}. What's our cash conversion cycle and what does it mean?`,
    hint: 'CCC = days inventory + days receivables − days payables.',
    answer: `DIO = ${k(inv)} / ${k(cogs)} × 365 ≈ ${nt(dio, 0)} days. DSO = ${k(ar)} / ${k(S)} × 365 ≈ ${nt(dso, 0)} days. DPO = ${k(ap)} / ${k(cogs)} × 365 ≈ ${nt(dpo, 0)} days. CCC = ${nt(dio, 0)} + ${nt(dso, 0)} − ${nt(dpo, 0)} ≈ **${nt(ccc, 0)} days**: the time between paying suppliers and collecting from customers that must be financed. Shorten it by holding less stock, collecting faster, or negotiating longer supplier terms.`,
    keys: [`DIO ≈ ${nt(dio, 0)}, DSO ≈ ${nt(dso, 0)}, DPO ≈ ${nt(dpo, 0)}`, `CCC ≈ ${nt(ccc, 0)} days`, 'Interpretation: financing gap and levers']
  };
}});

TPL({ id: 'tp-tradecredit', tier: 5, topic: cf, personas: ['raj', 'olena', 'diego'], gen(r) {
  const d = r.pick([0.01, 0.015, 0.02, 0.03]), D = r.pick([10, 15]), N = r.pick([30, 45, 60]), loan = r.step(0.04, 0.1, 0.005);
  const per = d / (1 - d), ear = (1 + per) ** (365 / (N - D)) - 1;
  return {
    msg: `A supplier offers "${p(d, 1)}/${D} net ${N}": ${p(d, 1)} discount if I pay within ${D} days, otherwise the full amount within ${N}. My bank overdraft costs ${p(loan)}. Should I take the discount?`,
    hint: `Skipping the discount = borrowing from the supplier for ${N - D} extra days at a cost of d/(1 − d).`,
    answer: `Not taking the discount means paying ${p(d, 1)} more to keep the money ${N - D} extra days. Cost per period = ${nt(d, 3)} / ${nt(1 - d, 3)} ≈ ${p(per, 2)}; there are 365/${N - D} ≈ ${nt(365 / (N - D), 1)} such periods a year. Effective annual cost = (1 + ${nt(per, 4)})^${nt(365 / (N - D), 2)} − 1 ≈ **${p(ear, 1)}**. ${ear > loan ? `That's far more than the ${p(loan)} overdraft, so **borrow from the bank and take the discount**.` : `That's less than the ${p(loan)} overdraft, so paying on day ${N} is fine.`}`,
    keys: [`Effective cost ≈ ${p(ear, 0)} per year`, 'Compares with bank rate', ear > loan ? 'Take the discount' : 'Skip the discount']
  };
}});

// ───────── Payouts & valuation ─────────
TPL({ id: 'tp-exdiv', tier: 2, topic: cf, personas: ['tom', 'brandt'], gen(r) {
  const P = r.step(20, 120, 0.5), D = +(P * r.step(0.02, 0.06, 0.005)).toFixed(2);
  return {
    msg: `A stock trades at ${e(P, 2)} and goes ex-dividend tomorrow with a ${e(D, 2)} dividend. Can I buy today, collect the dividend and sell tomorrow at the same price for a free ${e(D, 2)}?`,
    hint: 'What happens to the share price on the ex-dividend date?',
    answer: `No. On the ex-dividend date the share price typically drops by about the dividend, to around ${e(P - D, 2)}, because the cash leaves the company. You'd receive ${e(D, 2)} but your shares would be worth ~${e(D, 2)} less: roughly zero gain, minus trading costs and possibly tax on the dividend. A dividend moves value from the company to shareholders; it doesn't create it.`,
    keys: [`Price falls ≈ ${e(D, 2)} to ≈ ${e(P - D, 2)}`, 'No free money: value transferred, not created', 'Costs/taxes make it negative']
  };
}});

TPL({ id: 'tp-buyback', tier: 4, topic: cf, personas: ['yuki', 'adeyemi'], gen(r) {
  const NI = r.step(10, 200, 5) * 1e6, sh = r.step(10, 100, 5) * 1e6, P = r.step(20, 100, 1), B = Math.round(NI * r.step(0.3, 1, 0.1) / 1e6) * 1e6;
  const bought = B / P, eps0 = NI / sh, eps1 = NI / (sh - bought);
  return {
    msg: `Our company earns ${k(NI)} with ${nt(sh / 1e6, 0)}m shares. We'll spend ${k(B)} of spare cash buying back shares at ${e(P)}. Assuming earnings stay the same, what happens to EPS? Does that mean we created value?`,
    hint: 'Shares repurchased = amount / price.',
    answer: `Shares bought = ${k(B)} / ${e(P)} ≈ ${nt(bought / 1e6, 2)}m, leaving ${nt((sh - bought) / 1e6, 2)}m. EPS rises from ${e(eps0, 2)} to **${e(eps1, 2)}** (${sgn(eps1 / eps0 - 1, 1)}). But EPS growth isn't automatically value creation: the cash (and the interest it earned) is gone, so assets fall too. Value is created only if shares were bought below intrinsic value or the cash would otherwise be wasted. (In reality earnings would also dip by the lost interest income.)`,
    keys: [`≈ ${nt(bought / 1e6, 2)}m shares repurchased`, `EPS ${e(eps0, 2)} → ${e(eps1, 2)}`, 'Higher EPS ≠ value created']
  };
}});

TPL({ id: 'q501', tier: 5, topic: val, personas: ['kat', 'yuki'], gen(r) {
  const F = r.step(0.5, 10, 0.5) * 1e6, g = r.step(0.01, 0.04, 0.005), w = g + r.step(0.04, 0.08, 0.005);
  const V = F / (w - g), Vg = F / (w - g - 0.01), Vw = F / (w + 0.01 - g);
  return {
    msg: `An acquirer is interested! Free cash flow next year is expected at ${k(F)}, growing ${p(g)} a year forever. WACC ${p(w)}. What is the company worth? And why does my CFO say the result is "dangerously sensitive"?`,
    hint: 'Growing perpetuity: V = FCF₁ / (WACC − g).',
    answer: `V = ${k(F)} / (${p(w)} − ${p(g)}) = ${k(F)} / ${p(w - g)} ≈ **${k(V)}**. Sensitivity: the value depends on the small gap WACC − g. With g one point higher, V ≈ ${k(Vg)}; with WACC one point higher, V ≈ ${k(Vw)}. Small assumption changes move value by double-digit percentages. g must also stay below long-run economic growth and below WACC.`,
    keys: ['Uses FCF₁ / (WACC − g)', `≈ ${k(V)}`, 'Explains sensitivity to the WACC − g spread']
  };
}});

TPL({ id: 'q508', tier: 5, topic: vc, personas: ['kat'], gen(r) {
  const inv1 = r.step(0.5, 3, 0.25) * 1e6, st = r.pick([0.1, 0.15, 0.2, 0.25]), pre2 = r.step(10, 40, 1) * 1e6, inv2 = r.step(3, 10, 1) * 1e6;
  const post1 = inv1 / st, pre1 = post1 - inv1, post2 = pre2 + inv2, stake2 = st * pre2 / post2, worth = stake2 * post2;
  return {
    msg: `An angel offers ${k(inv1)} for ${p(st, 0)} of the company. What are the pre-money and post-money valuations? Later a Series A invests ${k(inv2)} at a ${k(pre2)} pre-money valuation. What's the angel's stake after that and what's it worth on paper?`,
    hint: 'Post-money = investment / stake. Pre = post − investment.',
    answer: `Angel round: post-money = ${k(inv1)} / ${p(st, 0)} = **${k(post1)}**; pre-money = **${k(pre1)}**. Series A: post-money = ${k(pre2)} + ${k(inv2)} = ${k(post2)}; existing holders are diluted by ${k(pre2)} / ${k(post2)} ≈ ${nt(pre2 / post2, 3)}. Angel's stake = ${p(st, 0)} × ${nt(pre2 / post2, 3)} ≈ **${p(stake2, 2)}**, worth ≈ **${k(worth)}**. (Ignores option pools and liquidation preferences.)`,
    keys: [`Post ${k(post1)}, pre ${k(pre1)}`, `Diluted stake ≈ ${p(stake2, 1)}`, `Paper value ≈ ${k(worth)}`]
  };
}});

TPL({ id: 'tp-terp', tier: 6, topic: cf, personas: ['yuki', 'adeyemi'], gen(r) {
  const Pm = r.step(10, 60, 0.5), kk = r.pick([2, 3, 4, 5]), S = +(Pm * r.step(0.6, 0.85, 0.05)).toFixed(2);
  const terp = (kk * Pm + S) / (kk + 1), right = terp - S;
  return {
    msg: `A company announces a rights issue: 1 new share for every ${kk} held, at ${e(S, 2)} each. The shares trade at ${e(Pm, 2)} before the issue. What's the theoretical ex-rights price and the value of one right? Is a shareholder worse off?`,
    hint: `TERP = (${kk} × old price + 1 × subscription price) / ${kk + 1}.`,
    answer: `TERP = (${kk} × ${e(Pm, 2)} + ${e(S, 2)}) / ${kk + 1} ≈ **${e(terp, 2)}**. Each new share is worth TERP − subscription = ${e(right, 2)}; since one new share needs ${kk} rights, one right is worth ≈ **${e(right / kk, 2)}**. A shareholder who takes up the rights or sells them is not worse off: the price drop is offset by the discount or the cash from selling rights. Doing nothing loses value.`,
    keys: [`TERP ≈ ${e(terp, 2)}`, `Value per right ≈ ${e(right / kk, 2)}`, 'Not worse off if rights taken up or sold']
  };
}});

TPL({ id: 'tp-ev', tier: 4, topic: val, personas: ['yuki'], gen(r) {
  const sh = r.step(10, 200, 5) * 1e6, P = r.step(5, 80, 0.5), D = r.step(0, 2, 0.1) * sh * P, C = r.step(0.05, 0.4, 0.05) * sh * P, ebitda = (sh * P + D - C) / r.step(5, 14, 0.5);
  const mc = sh * P, ev = mc + D - C;
  return {
    msg: `Company: ${nt(sh / 1e6, 0)}m shares at ${e(P, 2)}, debt ${k(D)}, cash ${k(C)}, EBITDA ${k(ebitda)}. What's the enterprise value and EV/EBITDA? Why use EV rather than market cap for this multiple?`,
    hint: 'EV = market cap + debt − cash.',
    answer: `Market cap = ${nt(sh / 1e6, 0)}m × ${e(P, 2)} = ${k(mc)}. EV = ${k(mc)} + ${k(D)} − ${k(C)} = **${k(ev)}**. EV/EBITDA = ${k(ev)} / ${k(ebitda)} ≈ **${nt(ev / ebitda, 1)}×**. EBITDA is earned for all capital providers (before interest), so it must be compared with the value of the whole firm, debt and equity, net of cash. That makes companies with different leverage comparable.`,
    keys: [`EV ≈ ${k(ev)}`, `EV/EBITDA ≈ ${nt(ev / ebitda, 1)}×`, 'EBITDA belongs to debt and equity holders → use EV']
  };
}});

TPL({ id: 'q502', tier: 5, topic: fa, personas: ['adeyemi'], gen(r) {
  const m = r.step(0.03, 0.12, 0.005), at = r.step(0.6, 2, 0.1), em = r.step(1.4, 3.5, 0.1), roe = m * at * em, roa = m * at;
  return {
    msg: `Board prep. Our ROE is ${p(roe, 1)}. Net profit margin ${p(m, 1)}, asset turnover ${nt(at, 1)}×. What's our equity multiplier, and what does the DuPont breakdown tell the board?`,
    hint: 'ROE = margin × asset turnover × equity multiplier.',
    answer: `ROA = margin × turnover = ${p(m, 1)} × ${nt(at, 1)} = ${p(roa, 2)}. Equity multiplier = ROE / ROA = ${p(roe, 1)} / ${p(roa, 2)} ≈ **${nt(em, 2)}** (assets are ${nt(em, 2)}× equity, so about ${p(1 - 1 / em, 0)} financed by liabilities). Insight: operations earn ${p(roa, 1)} on assets and leverage multiplies that ${nt(em, 1)}×. Leverage boosts ROE but also risk; sustainable improvement comes from margin or asset efficiency.`,
    keys: ['DuPont formula', `ROA ≈ ${p(roa, 1)}`, `Equity multiplier ≈ ${nt(em, 1)}; leverage interpretation`]
  };
}});

TPL({ id: 'tp-ke-ddm', tier: 4, topic: val, personas: ['yuki'], gen(r) {
  const P = r.step(20, 120, 1), D1 = +(P * r.step(0.02, 0.06, 0.005)).toFixed(2), g = r.step(0.01, 0.06, 0.005), ke = D1 / P + g;
  return {
    msg: `A stable company's shares trade at ${e(P, 2)}. Next year's dividend is expected to be ${e(D1, 2)} and dividends grow ${p(g)} a year. What return are investors implicitly expecting?`,
    hint: 'Rearrange Gordon growth: k = D₁ / P₀ + g.',
    answer: `From P₀ = D₁/(k − g): k = D₁/P₀ + g = ${e(D1, 2)} / ${e(P, 2)} + ${p(g)} = ${p(D1 / P, 2)} + ${p(g)} ≈ **${p(ke, 2)}**. Expected return = dividend yield + growth. This implied cost of equity can cross-check CAPM; it's only as good as the growth assumption.`,
    keys: [`k ≈ ${p(ke, 1)}`, 'Dividend yield + growth', 'Depends on growth assumption']
  };
}});

// ───────── Derivatives ─────────
TPL({ id: 'q503', tier: 5, topic: der, personas: ['tom', 'felix'], gen(r) {
  const K = r.step(40, 200, 5), prem = +(K * r.step(0.02, 0.08, 0.005)).toFixed(2), ST = +(K * r.step(0.85, 1.25, 0.01)).toFixed(2);
  const pay = Math.max(ST - K, 0), prof = pay - prem;
  return {
    msg: `I bought a call option: strike ${e(K)}, premium ${e(prem, 2)}. At expiry the stock is at ${e(ST, 2)}. What's my profit or loss? What's the break-even price and my maximum possible loss?`,
    hint: 'Payoff = max(S − K, 0). Profit = payoff − premium.',
    answer: `Payoff = max(${e(ST, 2)} − ${e(K)}, 0) = ${e(pay, 2)}. Profit = ${e(pay, 2)} − ${e(prem, 2)} = **${e(prof, 2)}** per share. Break-even at expiry = strike + premium = **${e(K + prem, 2)}**. Maximum loss = the premium, **${e(prem, 2)}**, if the stock ends at or below ${e(K)}. Upside is theoretically unlimited.`,
    keys: [`Profit ${e(prof, 2)}`, `Break-even ${e(K + prem, 2)}`, `Max loss ${e(prem, 2)}`]
  };
}});

TPL({ id: 'tp-put', tier: 5, topic: der, personas: ['tom', 'pavlo', 'felix'], gen(r) {
  const S0 = r.step(40, 200, 5), K = +(S0 * r.step(0.9, 1, 0.02)).toFixed(0), prem = +(S0 * r.step(0.02, 0.06, 0.005)).toFixed(2), ST = +(S0 * r.step(0.7, 1.15, 0.01)).toFixed(2);
  const pay = Math.max(K - ST, 0), prof = pay - prem;
  return {
    msg: `I own a stock at ${e(S0)} and bought a put with strike ${e(K)} for ${e(prem, 2)} as insurance. At expiry the stock is ${e(ST, 2)}. What did the put pay, what's the put's profit, and what's the worst value my stock + put position can have?`,
    hint: 'Put payoff = max(K − S, 0).',
    answer: `Put payoff = max(${e(K)} − ${e(ST, 2)}, 0) = ${e(pay, 2)}; profit on the put = ${e(pay, 2)} − ${e(prem, 2)} = **${e(prof, 2)}**. Stock + put is worth at least the strike: floor = ${e(K)} at expiry, so the worst total outcome is ${e(K)} − ${e(prem, 2)} paid = **${e(K - prem, 2)}** net (versus ${e(S0)} at the start). This "protective put" works like insurance: you pay a premium to cap losses while keeping the upside.`,
    keys: [`Put payoff ${e(pay, 2)}, profit ${e(prof, 2)}`, `Floor ${e(K)} (net ${e(K - prem, 2)})`, 'Protective put = insurance']
  };
}});

TPL({ id: 'q603', tier: 6, topic: der, personas: ['tom', 'felix'], gen(r) {
  const S = r.step(30, 120, 1), K = S, rt = r.step(0.01, 0.06, 0.005), C = +(S * r.step(0.07, 0.15, 0.005)).toFixed(2);
  const Pf = C + K / (1 + rt) - S, Pm = +(Pf + r.pick([-1, 1]) * r.step(0.5, 1.5, 0.1)).toFixed(2);
  const over = Pm > Pf, gain = Math.abs(Pm - Pf) * (1 + rt);
  const strat = over ? `sell the put (+${e(Pm, 2)}), short the stock (+${e(S)}), buy the call (−${e(C, 2)}) and lend the ${e(Pm + S - C, 2)} at ${p(rt)}` : `buy the put (−${e(Pm, 2)}), buy the stock (−${e(S)}), sell the call (+${e(C, 2)}) and borrow the ${e(Pm + S - C, 2)} at ${p(rt)}`;
  return {
    msg: `Stock at ${e(S)}, 1-year European call and put both with strike ${e(K)}. Risk-free rate ${p(rt)} (annual, simple). The call trades at ${e(C, 2)}. What should the put cost? If the put trades at ${e(Pm, 2)}, how would I profit?`,
    hint: 'Put-call parity: C + K/(1+r) = P + S.',
    answer: `Put-call parity: P = C + K/(1+r) − S = ${e(C, 2)} + ${e(K / (1 + rt), 2)} − ${e(S)} ≈ **${e(Pf, 2)}**. At ${e(Pm, 2)} the put is ${over ? 'overpriced' : 'underpriced'} by ${e(Math.abs(Pm - Pf), 2)}. Arbitrage: ${strat}. At expiry the options net to buying (or selling) the stock at ${e(K)} in every scenario, which closes the stock position, locking in ≈ **${e(gain, 2)}** riskless profit.`,
    keys: ['Put-call parity', `Fair put ≈ ${e(Pf, 2)}`, `${over ? 'Sell put / short stock / buy call / lend' : 'Buy put / buy stock / sell call / borrow'}; profit ≈ ${e(gain, 2)}`]
  };
}});

TPL({ id: 'tp-fwdprice', tier: 5, topic: der, personas: ['felix', 'pavlo'], gen(r) {
  const S = r.step(50, 2000, 10), rt = r.step(0.01, 0.06, 0.005), T = r.pick([0.25, 0.5, 1, 2]), F = S * (1 + rt) ** T, q = +(F * r.step(0.98, 1.03, 0.005)).toFixed(2);
  const rich = q > F;
  return {
    msg: `Gold trades at ${e(S)} an ounce. The risk-free rate is ${p(rt)} a year (ignore storage costs). What should a ${T >= 1 ? T + '-year' : T * 12 + '-month'} forward price be? A dealer quotes ${e(q, 2)}. What would an arbitrageur do?`,
    hint: 'Cost of carry: F = S × (1 + r)^T.',
    answer: `F = S × (1 + r)^T = ${e(S)} × ${nt(1 + rt, 3)}^${T} ≈ **${e(F, 2)}**: buying gold now and financing it costs the same as agreeing to buy it later. The quote of ${e(q, 2)} is ${rich ? 'too high' : 'too low'} by ${e(Math.abs(q - F), 2)}. ${rich ? 'Cash-and-carry: borrow, buy gold at spot, sell the forward at the quote, deliver at expiry and repay the loan.' : 'Reverse cash-and-carry: sell (borrow) gold at spot, invest the cash, buy the forward, and return the gold at expiry.'} Profit ≈ ${e(Math.abs(q - F), 2)} per ounce, risk-free (before costs).`,
    keys: [`Fair forward ≈ ${e(F, 2)}`, 'Cost-of-carry / no-arbitrage reasoning', rich ? 'Cash-and-carry arbitrage' : 'Reverse cash-and-carry arbitrage']
  };
}});

TPL({ id: 'tp-hedge', tier: 5, topic: der, personas: ['pavlo'], gen(r) {
  const t = r.step(200, 2000, 50), F0 = r.step(180, 260, 5), ST = +(F0 * r.step(0.7, 1.25, 0.01)).toFixed(0);
  const fut = (F0 - ST) * t, cash = ST * t, eff = (cash + fut) / t;
  return {
    msg: `Добрий день! In spring I sold wheat futures for ${n(t)} tonnes at ${e(F0)}/t to hedge my harvest. At harvest the cash price and the futures price are both ${e(ST)}/t. I sell my wheat locally and close the futures. What do I get per tonne overall? Was hedging a mistake if prices went up?`,
    hint: 'Short futures gain when prices fall: (F₀ − F_T) × tonnes.',
    answer: `Cash sale: ${n(t)} t × ${e(ST)} = ${e(cash)}. Futures: (${e(F0)} − ${e(ST)}) × ${n(t)} = ${e(fut)}. Total = ${e(cash + fut)} → effective price **${e(eff)}/t**, exactly the locked-in futures price (with zero basis). ${ST > F0 ? 'Prices rose, so the futures lost money and Pavlo missed extra upside, but that is the cost of certainty, not a mistake: the hedge removed price risk.' : 'Prices fell, so the futures gain offset the lower cash price.'} In practice basis risk means the result is close to, not exactly, the hedge price.`,
    keys: [`Futures P&L ${e(fut)}`, `Effective price ≈ ${e(eff)}/t`, 'Hedge locks price; removes risk rather than maximising profit']
  };
}});

TPL({ id: 'tp-cip', tier: 6, topic: der, personas: ['felix'], gen(r) {
  const S = r.step(1.02, 1.2, 0.005), ie = r.step(0.01, 0.04, 0.0025), iu = r.step(0.02, 0.055, 0.0025), F = S * (1 + iu) / (1 + ie);
  return {
    msg: `EUR/USD spot is ${nt(S, 4)} (dollars per euro). One-year rates: euro ${p(ie)}, dollar ${p(iu)}. What should the 1-year forward rate be? Does the euro trade at a forward premium or discount, and why?`,
    hint: 'Covered interest parity: F = S × (1 + i_USD) / (1 + i_EUR).',
    answer: `F = ${nt(S, 4)} × (1 + ${nt(iu, 4)}) / (1 + ${nt(ie, 4)}) ≈ **${nt(F, 4)}**. The euro trades at a forward ${F > S ? 'premium' : 'discount'} (${sgn(F / S - 1)}). Covered interest parity: investing in euros and hedging back to dollars must earn the same as investing in dollars, otherwise there's riskless arbitrage. So the higher-interest currency trades at a forward discount, offsetting its rate advantage. It's not a forecast of the future spot rate.`,
    keys: [`Forward ≈ ${nt(F, 4)}`, `${F > S ? 'Premium' : 'Discount'} for the euro`, 'No-arbitrage explanation; not a forecast']
  };
}});

TPL({ id: 'tp-binomial', tier: 6, topic: der, personas: ['felix'], gen(r) {
  const S = r.step(50, 150, 10), u = r.step(1.1, 1.3, 0.05), d = +(1 / u).toFixed(3), rt = r.step(0.01, 0.05, 0.005), K = S;
  const q = (1 + rt - d) / (u - d), Cu = Math.max(S * u - K, 0), Cd = Math.max(S * d - K, 0), C = (q * Cu + (1 - q) * Cd) / (1 + rt), delta = (Cu - Cd) / (S * u - S * d);
  return {
    msg: `One-period binomial model: stock at ${e(S)} can go up to ${e(S * u, 2)} or down to ${e(S * d, 2)}. Risk-free rate ${p(rt)} for the period. Price an at-the-money call (strike ${e(K)}). What's the hedge ratio?`,
    hint: 'Risk-neutral probability q = (1 + r − d) / (u − d). Discount the expected payoff at r.',
    answer: `u = ${nt(u, 3)}, d = ${nt(d, 3)}. q = (${nt(1 + rt, 3)} − ${nt(d, 3)}) / (${nt(u, 3)} − ${nt(d, 3)}) ≈ ${nt(q, 4)}. Payoffs: up ${e(Cu, 2)}, down ${e(Cd, 2)}. C = [${nt(q, 4)} × ${e(Cu, 2)} + ${nt(1 - q, 4)} × ${e(Cd, 2)}] / ${nt(1 + rt, 3)} ≈ **${e(C, 2)}**. Hedge ratio Δ = (Cu − Cd)/(Su − Sd) ≈ **${nt(delta, 3)}** shares per call. A portfolio of Δ shares minus one call is riskless, which is why real-world probabilities don't matter.`,
    keys: [`q ≈ ${nt(q, 3)}`, `Call ≈ ${e(C, 2)}`, `Δ ≈ ${nt(delta, 2)}; replication argument`]
  };
}});

TPL({ id: 'tp-straddle', tier: 6, topic: der, personas: ['felix', 'tom'], gen(r) {
  const K = r.step(50, 200, 5), c = +(K * r.step(0.03, 0.08, 0.005)).toFixed(2), pp = +(K * r.step(0.03, 0.07, 0.005)).toFixed(2), ST = +(K * r.step(0.75, 1.25, 0.01)).toFixed(2);
  const cost = c + pp, pay = Math.abs(ST - K), prof = pay - cost;
  return {
    msg: `Before earnings I bought a straddle: call and put, both strike ${e(K)}, premiums ${e(c, 2)} and ${e(pp, 2)}. At expiry the stock is ${e(ST, 2)}. Profit? What are the break-evens, and what view does a straddle express?`,
    hint: 'Payoff = |S − K|; cost = both premiums.',
    answer: `Total premium = ${e(cost, 2)}. Payoff = |${e(ST, 2)} − ${e(K)}| = ${e(pay, 2)}. Profit = **${e(prof, 2)}** per share. Break-evens: ${e(K - cost, 2)} and ${e(K + cost, 2)}. A long straddle bets on a **big move in either direction** (high volatility), not on direction. Max loss is the premium if the stock ends exactly at the strike; it's hurt by time decay and falling implied volatility.`,
    keys: [`Profit ${e(prof, 2)}`, `Break-evens ${e(K - cost, 2)} / ${e(K + cost, 2)}`, 'Volatility view, not direction']
  };
}});

// ───────── Banking ─────────
TPL({ id: 'tp-loan-fee', tier: 4, topic: bank, personas: ['sam', 'raj'], gen(r) {
  const L = r.step(10000, 200000, 5000), rt = r.step(0.04, 0.1, 0.0025), f = r.step(0.01, 0.03, 0.0025);
  const fee = L * f, eff = (L * rt + fee) / (L - fee);
  return {
    msg: `A one-year business loan of ${e(L)} at ${p(rt)} interest, paid with the principal at year end. The bank also charges a ${p(f, 2)} arrangement fee upfront. What's the true cost?`,
    hint: 'You receive less than the face amount but pay full interest on it.',
    answer: `Fee = ${e(fee)}, so you only receive ${e(L - fee)}. Interest = ${e(L * rt)}. Total cost = ${e(L * rt + fee)} for using ${e(L - fee)} for a year → effective rate = ${e(L * rt + fee)} / ${e(L - fee)} ≈ **${p(eff, 2)}**, versus the ${p(rt)} headline. Upfront fees matter most on short loans, because they're spread over fewer years. That's why lenders must disclose an effective rate (APR/"Effektivzins").`,
    keys: [`Net proceeds ${e(L - fee)}`, `Effective cost ≈ ${p(eff, 1)}`, 'Fees raise effective rate, more on short loans']
  };
}});

TPL({ id: 'tp-nim', tier: 3, topic: bank, personas: ['sam'], gen(r) {
  const A = r.step(0.5, 20, 0.5) * 1e9, yA = r.step(0.03, 0.06, 0.0025), cL = r.step(0.005, 0.03, 0.0025), L = A * r.step(0.85, 0.95, 0.01);
  const II = A * yA, IE = L * cL, nim = (II - IE) / A;
  return {
    msg: `Our bank has ${k(A)} of interest-earning assets yielding ${p(yA)} on average, funded partly by ${k(L)} of deposits and borrowings costing ${p(cL)}. What's our net interest income and net interest margin?`,
    hint: 'NIM = (interest income − interest expense) / interest-earning assets.',
    answer: `Interest income = ${k(A)} × ${p(yA)} = ${k(II)}. Interest expense = ${k(L)} × ${p(cL)} = ${k(IE)}. Net interest income = **${k(II - IE)}**. NIM = ${k(II - IE)} / ${k(A)} ≈ **${p(nim, 2)}**. NIM is a bank's core spread business; it's squeezed when deposit costs rise faster than loan yields, and it must cover operating costs and credit losses.`,
    keys: [`Net interest income ≈ ${k(II - IE)}`, `NIM ≈ ${p(nim, 2)}`, 'Interpretation: spread business']
  };
}});

TPL({ id: 'tp-capital-ratio', tier: 4, topic: bank, personas: ['sam', 'jonas'], gen(r) {
  const mort = r.step(200, 800, 50), corp = r.step(100, 500, 50), gov = r.step(50, 300, 50), cap = r.step(30, 90, 5);
  const rwa = mort * 0.35 + corp * 1 + gov * 0, ratio = cap / rwa, lev = cap / (mort + corp + gov);
  return {
    msg: `Simplified bank: €${mort}m residential mortgages (risk weight 35%), €${corp}m corporate loans (100%), €${gov}m government bonds (0%). Capital €${cap}m. What are risk-weighted assets and the capital ratio? Does it meet an 8% minimum?`,
    hint: 'RWA = Σ exposure × risk weight. Ratio = capital / RWA.',
    answer: `RWA = ${mort} × 0.35 + ${corp} × 1 + ${gov} × 0 = **€${nt(rwa, 1)}m**. Capital ratio = ${cap} / ${nt(rwa, 1)} ≈ **${p(ratio, 1)}**, ${ratio >= 0.08 ? 'above' : 'below'} the 8% minimum (real requirements add buffers, so banks hold well above 8%). Unweighted leverage ratio = ${cap} / ${mort + corp + gov} ≈ ${p(lev, 1)}. Risk weights mean riskier assets need more capital; the leverage ratio is a backstop in case weights are wrong.`,
    keys: [`RWA ≈ €${nt(rwa, 0)}m`, `Capital ratio ≈ ${p(ratio, 1)}`, `${ratio >= 0.08 ? 'Meets' : 'Fails'} 8%; buffers/leverage ratio context`]
  };
}});

TPL({ id: 'tp-el-bank', tier: 4, topic: bank, personas: ['sam'], gen(r) {
  const EAD = r.step(50000, 2000000, 10000), pd = r.step(0.005, 0.08, 0.0025), lgd = r.step(0.2, 0.7, 0.05), mar = r.step(0.01, 0.04, 0.0025);
  const el = pd * lgd * EAD;
  return {
    msg: `Loan file: exposure at default ${e(EAD)}, probability of default ${p(pd, 2)} a year, loss given default ${p(lgd, 0)}. What's the expected annual loss, and how should it affect pricing? Our proposed margin over funding is ${p(mar, 2)}.`,
    hint: 'EL = PD × LGD × EAD.',
    answer: `Expected loss = ${p(pd, 2)} × ${p(lgd, 0)} × ${e(EAD)} ≈ **${e(el, 0)} a year**, i.e. ${p(pd * lgd, 2)} of the exposure. The margin must cover EL, operating costs and a return on the capital held against **unexpected** losses. ${mar > pd * lgd ? `A ${p(mar, 2)} margin covers EL (${p(pd * lgd, 2)}), leaving ${p(mar - pd * lgd, 2)} for costs and capital.` : `A ${p(mar, 2)} margin doesn't even cover expected losses (${p(pd * lgd, 2)}). Reprice or decline.`}`,
    keys: [`EL ≈ ${e(el, 0)}`, `EL rate ${p(pd * lgd, 2)}`, 'Pricing must cover EL + costs + capital']
  };
}});

TPL({ id: 'tp-ltv-dscr', tier: 4, topic: bank, personas: ['sam', 'mikko'], gen(r) {
  const V = r.step(300000, 2000000, 25000), L = Math.round(V * r.step(0.55, 0.9, 0.05) / 1000) * 1000, rt = r.step(0.03, 0.06, 0.0025), y = 25, NOI = Math.round(V * r.step(0.04, 0.07, 0.0025) / 100) * 100;
  const pmt = L * rt / (1 - (1 + rt) ** -y), dscr = NOI / pmt;
  return {
    msg: `Rental-property loan application: property value ${e(V)}, requested loan ${e(L)} at ${p(rt)} over ${y} years (annual annuity). Net operating income ${e(NOI)} a year. What are the LTV and the debt service coverage ratio? Would you approve it at limits of 80% LTV and 1.25× DSCR?`,
    hint: 'LTV = loan / value. DSCR = NOI / annual debt service.',
    answer: `LTV = ${e(L)} / ${e(V)} = **${p(L / V, 1)}**. Annual debt service = ${e(L)} × ${nt(rt, 4)} / (1 − ${nt(1 + rt, 4)}^−${y}) ≈ ${e(pmt, 0)}. DSCR = ${e(NOI)} / ${e(pmt, 0)} ≈ **${nt(dscr, 2)}×**. LTV ${L / V <= 0.8 ? 'passes' : 'fails'}, DSCR ${dscr >= 1.25 ? 'passes' : 'fails'} → ${L / V <= 0.8 && dscr >= 1.25 ? '**approve** (subject to other checks)' : '**not approvable as requested**: reduce the loan or require more equity'}. LTV protects the bank if it must sell; DSCR shows whether income can service the debt.`,
    keys: [`LTV ${p(L / V, 0)}`, `DSCR ≈ ${nt(dscr, 2)}×`, `Decision: ${L / V <= 0.8 && dscr >= 1.25 ? 'approve' : 'decline/restructure'}`]
  };
}});

// ───────── Real estate ─────────
TPL({ id: 'tp-caprate', tier: 3, topic: re, personas: ['mikko'], gen(r) {
  const NOI = r.step(20000, 300000, 5000), cap = r.step(0.035, 0.08, 0.0025), V = NOI / cap, cap2 = cap + 0.005;
  return {
    msg: `An apartment building produces ${e(NOI)} of net operating income per year. Similar buildings sell at a ${p(cap)} cap rate. What's it worth? What if cap rates rise by half a point?`,
    hint: 'Value = NOI / cap rate.',
    answer: `Value = ${e(NOI)} / ${p(cap)} ≈ **${e(V, 0)}**. At ${p(cap2)}: ${e(NOI)} / ${p(cap2)} ≈ ${e(NOI / cap2, 0)}, a fall of ${p(1 - cap / cap2, 1)}. The cap rate is the initial yield buyers demand; it moves with interest rates and risk, so rising rates can cut property values even if rents are unchanged.`,
    keys: [`Value ≈ ${e(V, 0)}`, `At +0.5pt ≈ ${e(NOI / cap2, 0)}`, 'Cap rates move with rates/risk']
  };
}});

TPL({ id: 'tp-rental-yield', tier: 2, topic: re, personas: ['mikko', 'priya'], gen(r) {
  const P = r.step(150000, 600000, 5000), rent = Math.round(P * r.step(0.035, 0.06, 0.0025) / 12 / 10) * 10, costs = Math.round(rent * 12 * r.step(0.15, 0.35, 0.05)), buy = Math.round(P * r.step(0.07, 0.12, 0.01));
  const gross = rent * 12 / P, net = (rent * 12 - costs) / (P + buy);
  return {
    msg: `I'm looking at a flat for ${e(P)}. It would rent for ${e(rent)} a month. Running costs (maintenance, management, non-recoverable charges) are about ${e(costs)} a year, and purchase costs (tax, notary, agent) add ${e(buy)}. Gross and net rental yield?`,
    hint: 'Gross = annual rent / price. Net = (rent − costs) / total purchase cost.',
    answer: `Annual rent = ${e(rent * 12)}. Gross yield = ${e(rent * 12)} / ${e(P)} ≈ **${p(gross, 2)}**. Net yield = (${e(rent * 12)} − ${e(costs)}) / (${e(P)} + ${e(buy)}) ≈ **${p(net, 2)}**. The net figure is what matters, and it's before vacancies, financing and tax. Agents usually quote gross yields.`,
    keys: [`Gross ≈ ${p(gross, 1)}`, `Net ≈ ${p(net, 1)}`, 'Net includes costs and purchase expenses']
  };
}});

TPL({ id: 'tp-levered-re', tier: 5, topic: re, personas: ['mikko'], gen(r) {
  const P = r.step(200000, 800000, 10000), ltv = r.step(0.5, 0.8, 0.05), y = r.step(0.04, 0.07, 0.0025), rd = r.step(0.025, 0.065, 0.0025), g = r.pick([-0.1, -0.05, 0, 0.03, 0.05]);
  const Eq = P * (1 - ltv), D = P * ltv, inc = P * y - D * rd, gain = P * g, roe = (inc + gain) / Eq, unlev = y + g;
  return {
    msg: `I buy a ${e(P)} property with ${p(ltv, 0)} financing at ${p(rd)} interest-only. Net rental income is ${p(y)} of the price. Over a year the value changes ${sgn(g, 0)}. What's my return on equity versus an all-cash purchase?`,
    hint: 'Return on equity = (rent − interest + value change) / own money.',
    answer: `Equity = ${e(Eq)}, loan = ${e(D)}. Rent ${e(P * y)} − interest ${e(D * rd)} = ${e(inc)}; value change ${e(gain)}. Return on equity = ${e(inc + gain)} / ${e(Eq)} ≈ **${sgn(roe, 1)}**. All-cash return = ${p(y)} ${sgn(g, 0)} = **${sgn(unlev, 1)}**. ${y > rd ? 'Leverage is positive when the property yield exceeds the interest rate' : 'Here the interest rate exceeds the property yield, so debt drags returns ("negative leverage")'}; and any value change is magnified by ${nt(1 / (1 - ltv), 1)}×, in both directions.`,
    keys: [`Levered ROE ≈ ${sgn(roe, 1)}`, `Unlevered ≈ ${sgn(unlev, 1)}`, 'Leverage magnifies gains and losses; yield vs debt cost']
  };
}});

// ───────── Startups ─────────
TPL({ id: 'tp-runway', tier: 2, topic: vc, personas: ['kat', 'raj'], gen(r) {
  const cash = r.step(0.2, 5, 0.1) * 1e6, cost = r.step(40, 400, 10) * 1e3, rev = Math.round(cost * r.step(0.1, 0.6, 0.05) / 1000) * 1000, burn = cost - rev;
  return {
    msg: `We have ${k(cash)} in the bank. Monthly costs ${e(cost)}, monthly revenue ${e(rev)}. What's our burn rate and runway? When should we start fundraising?`,
    hint: 'Net burn = costs − revenue. Runway = cash / net burn.',
    answer: `Gross burn = ${e(cost)}/month; net burn = ${e(cost)} − ${e(rev)} = **${e(burn)}/month**. Runway = ${k(cash)} / ${e(burn)} ≈ **${nt(cash / burn, 1)} months** (assuming flat numbers). Fundraising typically takes 3–6+ months, so start at least 6–9 months before cash runs out. Growing revenue or cutting costs extends runway.`,
    keys: [`Net burn ${e(burn)}/month`, `Runway ≈ ${nt(cash / burn, 1)} months`, 'Start fundraising well before (6–9 months)']
  };
}});

TPL({ id: 'tp-ltv-cac', tier: 3, topic: vc, personas: ['raj', 'kat'], gen(r) {
  const arpu = r.step(10, 120, 5), gm = r.step(0.5, 0.85, 0.05), churn = r.step(0.02, 0.1, 0.005), cac = Math.round(arpu * gm / churn * r.step(0.2, 1.2, 0.05));
  const ltv = arpu * gm / churn, ratio = ltv / cac, pb = cac / (arpu * gm);
  return {
    msg: `Subscription business: ${e(arpu)} revenue per customer per month, ${p(gm, 0)} gross margin, ${p(churn, 1)} of customers cancel each month. We spend ${e(cac)} to acquire a customer. What's the customer lifetime value, LTV/CAC and CAC payback?`,
    hint: 'LTV ≈ monthly gross profit per customer / monthly churn.',
    answer: `Monthly gross profit per customer = ${e(arpu)} × ${p(gm, 0)} = ${e(arpu * gm, 2)}. Average lifetime ≈ 1 / ${p(churn, 1)} ≈ ${nt(1 / churn, 1)} months. LTV ≈ ${e(arpu * gm, 2)} / ${nt(churn, 3)} ≈ **${e(ltv, 0)}**. LTV/CAC ≈ **${nt(ratio, 1)}×** (a common rule of thumb wants ≥ 3×). CAC payback ≈ ${e(cac)} / ${e(arpu * gm, 2)} ≈ **${nt(pb, 1)} months**. ${ratio >= 3 ? 'Healthy unit economics.' : 'Weak unit economics: reduce churn or acquisition cost, or raise prices.'}`,
    keys: [`LTV ≈ ${e(ltv, 0)}`, `LTV/CAC ≈ ${nt(ratio, 1)}×`, `Payback ≈ ${nt(pb, 1)} months`]
  };
}});

TPL({ id: 'tp-unit-econ', tier: 2, topic: vc, personas: ['raj', 'diego'], gen(r) {
  const price = r.step(20, 120, 1), cogs = +(price * r.step(0.3, 0.55, 0.05)).toFixed(2), ship = r.step(3, 9, 0.5), pay = +(price * 0.029 + 0.25).toFixed(2), mkt = r.step(3, 20, 1);
  const cm = price - cogs - ship - pay - mkt;
  return {
    msg: `Average online order: ${e(price, 2)}. Product cost ${e(cogs, 2)}, shipping ${e(ship, 2)}, payment fees ${e(pay, 2)}, ads per order ${e(mkt, 2)}. What's the contribution per order and margin? Are we making money on each order?`,
    hint: 'Subtract every cost that scales with orders.',
    answer: `Contribution = ${e(price, 2)} − ${e(cogs, 2)} − ${e(ship, 2)} − ${e(pay, 2)} − ${e(mkt, 2)} = **${e(cm, 2)}** per order, a contribution margin of **${p(cm / price, 1)}**. ${cm > 0 ? `Each order contributes ${e(cm, 2)} toward fixed costs (rent, salaries, software); profit only starts once those are covered.` : 'Every order loses money: growth makes things worse until prices rise or costs fall.'}`,
    keys: [`Contribution ${e(cm, 2)}`, `Margin ${p(cm / price, 0)}`, cm > 0 ? 'Covers variable costs; fixed costs still to cover' : 'Loses money per order']
  };
}});
})();
