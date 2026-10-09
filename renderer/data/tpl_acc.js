// Randomised templates: financial accounting, managerial accounting, analysis.
(() => {
const { n, nt, e, p, sgn } = FMT;
const acc = 'Accounting', adv = 'Advanced accounting', mgr = 'Managerial accounting', fa = 'Financial analysis';
const k = (x) => (Math.abs(x) >= 1e6 ? '€' + nt(x / 1e6, 2) + 'm' : e(x, 0));

TPL({ id: 'q201', tier: 2, topic: acc, personas: ['olena', 'lena'], gen(r, pid) {
  const amt = r.step(500, 20000, 100);
  const cases = [
    { t: `buy ${e(amt)} of flour on credit from my supplier`, a: `Inventory (asset) **+${e(amt)}** and Accounts payable (liability) **+${e(amt)}**. Both sides rise; equity unchanged; no expense until the flour is used in bread that's sold. Entry: Dr Inventory / Cr Accounts payable ${e(amt)}.`, k: ['Inventory +', 'Accounts payable +', 'Equity unchanged / no expense yet'] },
    { t: `pay a supplier the ${e(amt)} I owed them`, a: `Cash (asset) **−${e(amt)}** and Accounts payable (liability) **−${e(amt)}**. Both sides fall equally; equity unchanged; it's not an expense because the cost was recorded when the goods were bought. Entry: Dr Accounts payable / Cr Cash ${e(amt)}.`, k: ['Cash −', 'Accounts payable −', 'Not an expense; equity unchanged'] },
    { t: `put ${e(amt)} of my own savings into the business`, a: `Cash (asset) **+${e(amt)}** and Owner's equity / capital **+${e(amt)}**. It's not revenue: owners' contributions increase equity directly, they aren't earned income. Entry: Dr Cash / Cr Owner's capital ${e(amt)}.`, k: ['Cash +', 'Equity (capital) +', 'Not revenue'] },
    { t: `take out a ${e(amt)} bank loan`, a: `Cash (asset) **+${e(amt)}** and Loan payable (liability) **+${e(amt)}**. Equity unchanged; borrowing is not income. Only the interest later becomes an expense. Entry: Dr Cash / Cr Bank loan ${e(amt)}.`, k: ['Cash +', 'Loan (liability) +', 'Not income; only interest is an expense'] },
    { t: `buy a ${e(amt)} mixer and pay cash`, a: `Equipment (asset) **+${e(amt)}** and Cash (asset) **−${e(amt)}**. One asset swaps for another; totals and equity unchanged. The mixer is expensed gradually through depreciation. Entry: Dr Equipment / Cr Cash ${e(amt)}.`, k: ['Equipment +', 'Cash −', 'Asset swap; expensed via depreciation later'] }
  ];
  const c = r.pick(cases);
  return {
    msg: `${pid === 'lena' ? 'Exam practice:' : 'My bookkeeping course mentions "the accounting equation".'} What is it, and what happens to it when I ${c.t}?`,
    hint: 'Assets = Liabilities + Equity. Which two items change, and in which direction?',
    answer: `The accounting equation: **Assets = Liabilities + Equity**, and every transaction keeps it in balance. Here: ${c.a}`,
    keys: ['States A = L + E', ...c.k]
  };
}});

TPL({ id: 'tp-equity', tier: 1, topic: acc, personas: ['olena', 'lena', 'diego'], gen(r) {
  const cash = r.step(2000, 30000, 500), inv = r.step(1000, 20000, 500), eq = r.step(5000, 80000, 1000), loan = r.step(5000, 60000, 1000), ap = r.step(500, 15000, 500);
  const A = cash + inv + eq, L = loan + ap, E = A - L;
  return {
    msg: `My business has ${e(cash)} cash, ${e(inv)} of stock and equipment worth ${e(eq)} on the books. I owe the bank ${e(loan)} and suppliers ${e(ap)}. How much of the business do I actually "own"?`,
    hint: 'Equity = assets − liabilities.',
    answer: `Assets = ${e(cash)} + ${e(inv)} + ${e(eq)} = ${e(A)}. Liabilities = ${e(loan)} + ${e(ap)} = ${e(L)}. Equity = A − L = **${e(E)}**. ${E < 0 ? 'Negative equity: the business owes more than its recorded assets, which is a warning sign.' : 'That is the owner\'s claim on the assets after all debts.'} It's a book value: market value can differ a lot.`,
    keys: [`Assets ${e(A)}, liabilities ${e(L)}`, `Equity ${e(E)}`, 'Equity = residual claim / book value']
  };
}});

TPL({ id: 'q301', tier: 3, topic: acc, personas: ['olena', 'diego', 'lena'], gen(r) {
  const C = r.step(5000, 80000, 1000), life = r.int(3, 10), res = Math.round(C * r.pick([0, 0, 0.05, 0.1]) / 100) * 100, yrs = r.int(1, life - 1);
  const dep = (C - res) / life, bv = C - dep * yrs;
  return {
    msg: `New equipment cost ${e(C)}, should last ${life} years and be worth ${e(res)} at the end. My accountant wants to depreciate it straight-line. How much per year, and what's its book value after ${yrs} year${yrs > 1 ? 's' : ''}? Why can't I just expense all of it now?`,
    hint: '(Cost − residual value) / useful life.',
    answer: `Annual depreciation = (${e(C)} − ${e(res)}) / ${life} = **${e(dep, 2)}**. Book value after ${yrs} year${yrs > 1 ? 's' : ''} = ${e(C)} − ${yrs} × ${e(dep, 2)} = **${e(bv, 2)}**. It's capitalised because it generates revenue over ${life} years; the **matching principle** spreads its cost over the periods that benefit. Expensing it all now would understate this year's profit and overstate later years'.`,
    keys: [`Depreciation ${e(dep, 0)} per year`, `Book value ${e(bv, 0)}`, 'Matching principle / capitalisation']
  };
}});

TPL({ id: 'tp-ddb', tier: 4, topic: acc, personas: ['lena', 'adeyemi'], gen(r) {
  const C = r.step(10000, 200000, 5000), life = r.int(4, 8), rate = 2 / life, d1 = C * rate, d2 = (C - d1) * rate, sl = C / life;
  return {
    msg: `Asset cost ${e(C)}, ${life}-year life, no residual value. Compare depreciation in years 1 and 2 under straight-line and double-declining balance. Why would a company choose declining balance?`,
    hint: `DDB rate = 2 / life = ${p(rate, 1)} of the opening book value each year.`,
    answer: `Straight-line: ${e(C)} / ${life} = **${e(sl, 0)}** each year. DDB rate = 2/${life} = ${p(rate, 1)}. Year 1: ${p(rate, 1)} × ${e(C)} = **${e(d1, 0)}**. Year 2: ${p(rate, 1)} × (${e(C)} − ${e(d1, 0)}) = **${e(d2, 0)}**. Total depreciation is the same over the life; DDB front-loads it. It suits assets that lose value or usefulness fastest early (tech, vehicles), and may defer tax where tax rules allow it. (DDB usually switches to straight-line late in life.)`,
    keys: [`SL ${e(sl, 0)}/year`, `DDB year 1 ${e(d1, 0)}, year 2 ${e(d2, 0)}`, 'Same total; front-loaded; matches usage pattern']
  };
}});

TPL({ id: 'q404', tier: 4, topic: acc, personas: ['olena', 'diego'], gen(r) {
  const q1 = r.step(100, 500, 50), c1 = r.step(0.8, 2, 0.05), q2 = r.step(100, 500, 50), c2 = +(c1 * r.step(1.15, 1.5, 0.05)).toFixed(2), used = Math.round((q1 + r.step(0.2, 0.8, 0.1) * q2) / 10) * 10;
  const fifo = Math.min(used, q1) * c1 + Math.max(0, used - q1) * c2, avg = (q1 * c1 + q2 * c2) / (q1 + q2), wac = used * avg;
  return {
    msg: `Flour prices are rising. This month I bought ${q1} kg at ${e(c1, 2)}/kg, then ${q2} kg at ${e(c2, 2)}/kg, and used ${used} kg. What's my cost of goods sold under FIFO and under weighted average? Which method shows higher profit when prices rise?`,
    hint: 'FIFO uses the oldest flour first. Weighted average uses the average cost per kg.',
    answer: `FIFO: ${Math.min(used, q1)} kg × ${e(c1, 2)}${used > q1 ? ` + ${used - q1} kg × ${e(c2, 2)}` : ''} = **${e(fifo, 2)}**. Weighted average: (${q1} × ${e(c1, 2)} + ${q2} × ${e(c2, 2)}) / ${q1 + q2} kg ≈ ${e(avg, 4)}/kg → ${used} × ${e(avg, 4)} ≈ **${e(wac, 2)}**. With rising prices FIFO gives lower COGS → **higher profit** (and a higher closing inventory value). LIFO would give the lowest profit but isn't allowed under IFRS.`,
    keys: [`FIFO COGS ≈ ${e(fifo, 2)}`, `Weighted average COGS ≈ ${e(wac, 2)}`, 'FIFO → higher profit in rising prices']
  };
}});

TPL({ id: 'tp-disposal', tier: 4, topic: acc, personas: ['lena', 'olena', 'diego'], gen(r) {
  const C = r.step(10000, 100000, 1000), life = r.int(4, 10), used = r.int(1, life - 1), dep = C / life, bv = C - dep * used, sale = Math.round(bv * r.step(0.6, 1.4, 0.05) / 100) * 100, gl = sale - bv;
  return {
    msg: `We sold a delivery van for ${e(sale)}. It cost ${e(C)}, was being depreciated straight-line over ${life} years with no residual value, and we'd owned it for exactly ${used} years. Gain or loss on disposal?`,
    hint: 'Compare sale proceeds with book value (cost − accumulated depreciation).',
    answer: `Accumulated depreciation = ${used} × ${e(C)} / ${life} = ${e(dep * used, 0)}. Book value = ${e(C)} − ${e(dep * used, 0)} = ${e(bv, 0)}. ${gl >= 0 ? 'Gain' : 'Loss'} on disposal = ${e(sale)} − ${e(bv, 0)} = **${e(gl, 0)}**, reported in profit or loss. Entry: Dr Cash ${e(sale)}, Dr Accumulated depreciation ${e(dep * used, 0)}, ${gl >= 0 ? `Cr Gain ${e(gl, 0)}` : `Dr Loss ${e(-gl, 0)}`}, Cr Vehicle ${e(C)}. A ${gl >= 0 ? 'gain' : 'loss'} means past depreciation was ${gl >= 0 ? 'too high' : 'too low'} relative to actual wear.`,
    keys: [`Book value ${e(bv, 0)}`, `${gl >= 0 ? 'Gain' : 'Loss'} ${e(Math.abs(gl), 0)}`, 'Removes cost and accumulated depreciation']
  };
}});

TPL({ id: 'tp-markup', tier: 2, topic: acc, personas: ['diego', 'olena', 'raj'], gen(r) {
  const c = r.step(2, 40, 0.5), pr = +(c * r.step(1.3, 3.5, 0.05)).toFixed(2);
  const mu = (pr - c) / c, mg = (pr - c) / pr;
  return {
    msg: `A dish costs me ${e(c, 2)} in ingredients and sells for ${e(pr, 2)}. My chef says the "markup" is great, my accountant talks about "gross margin". Are those the same number?`,
    hint: 'Markup divides profit by cost; margin divides profit by price.',
    answer: `Gross profit per dish = ${e(pr, 2)} − ${e(c, 2)} = ${e(pr - c, 2)}. Markup = ${e(pr - c, 2)} / ${e(c, 2)} = **${p(mu, 1)}** (on cost). Gross margin = ${e(pr - c, 2)} / ${e(pr, 2)} = **${p(mg, 1)}** (on price). Not the same: margin is always lower than markup. Mixing them up when setting prices leads to under-pricing.`,
    keys: [`Markup ≈ ${p(mu, 0)}`, `Margin ≈ ${p(mg, 0)}`, 'Different bases: cost vs price']
  };
}});

TPL({ id: 'tp-cogs-periodic', tier: 2, topic: acc, personas: ['olena', 'diego', 'lena'], gen(r) {
  const o = r.step(1000, 20000, 500), pu = r.step(5000, 80000, 500), cl = Math.min(r.step(500, 20000, 500), Math.round((o + pu) * 0.5 / 500) * 500), s = Math.round((o + pu - cl) * r.step(1.4, 3, 0.1) / 100) * 100;
  const cogs = o + pu - cl;
  return {
    msg: `Year-end: opening stock ${e(o)}, purchases during the year ${e(pu)}, closing stock counted at ${e(cl)}. Sales ${e(s)}. What's my cost of goods sold and gross profit?`,
    hint: 'COGS = opening inventory + purchases − closing inventory.',
    answer: `COGS = ${e(o)} + ${e(pu)} − ${e(cl)} = **${e(cogs)}**. Gross profit = ${e(s)} − ${e(cogs)} = **${e(s - cogs)}** (gross margin ${p((s - cogs) / s, 1)}). Note: an error in the stock count flows straight into profit. Overstating closing stock by €1,000 overstates profit by €1,000.`,
    keys: [`COGS ${e(cogs)}`, `Gross profit ${e(s - cogs)}`, 'Closing stock errors affect profit']
  };
}});

TPL({ id: 'q504', tier: 5, topic: acc, personas: ['olena', 'diego'], gen(r) {
  const w = r.step(1000, 15000, 100), d = r.int(3, 10);
  return {
    msg: `Year-end close! My staff worked the last week of December but get paid ${e(w)} on January ${d}. What journal entry do I need on 31 December? What happens if I forget it?`,
    hint: 'The expense belongs to the period when the work was done.',
    answer: `Accrue on 31 December: **Dr Wages expense ${e(w)} / Cr Wages payable (accrued liabilities) ${e(w)}**. The cost belongs to December (accrual/matching principle). On January ${d}: Dr Wages payable / Cr Cash ${e(w)}, with no January expense. Forgetting it: this year's expenses understated, so **profit overstated** by ${e(w)} and **liabilities understated**; next year's expenses overstated.`,
    keys: [`Dr Wages expense / Cr Wages payable ${e(w)}`, 'Accrual / matching principle', 'If forgotten: profit overstated, liabilities understated']
  };
}});

TPL({ id: 'tp-prepaid', tier: 3, topic: acc, personas: ['lena', 'diego', 'olena'], gen(r) {
  const prem = r.step(1200, 24000, 120), m = r.int(2, 11), names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const months = 13 - m, exp = prem * months / 12, pre = prem - exp;
  return {
    msg: `On 1 ${names[m - 1]} we paid ${e(prem)} for 12 months of insurance. Our year ends 31 December. How much is this year's insurance expense, and what goes on the balance sheet at year-end?`,
    hint: 'Only the months that have passed are an expense; the rest is an asset.',
    answer: `Monthly cost = ${e(prem)} / 12 = ${e(prem / 12, 2)}. Months used this year: ${names[m - 1]}–December = ${months}. Expense = ${months} × ${e(prem / 12, 2)} = **${e(exp, 2)}**. Prepaid insurance (current asset) = **${e(pre, 2)}** for the ${12 - months} months still covered next year. Adjusting entry (if the full payment was first recorded as prepaid): Dr Insurance expense / Cr Prepaid insurance ${e(exp, 2)}.`,
    keys: [`Expense ${e(exp, 0)}`, `Prepaid asset ${e(pre, 0)}`, 'Accrual: expense only for months consumed']
  };
}});

TPL({ id: 'tp-allowance', tier: 4, topic: acc, personas: ['lena', 'clara', 'raj'], gen(r) {
  const AR = r.step(20000, 500000, 5000), pct = r.step(0.02, 0.08, 0.005), old = Math.round(AR * r.step(0.005, 0.05, 0.005) / 100) * 100, need = AR * pct, exp = need - old;
  return {
    msg: `Receivables at year-end are ${e(AR)}. Based on experience, about ${p(pct, 1)} won't be collected. The allowance for doubtful debts currently has a balance of ${e(old)}. What adjustment do we make, and why not just wait until a customer actually doesn't pay?`,
    hint: 'Target allowance = receivables × expected % uncollectible. The expense is the change needed.',
    answer: `Required allowance = ${e(AR)} × ${p(pct, 1)} = ${e(need, 0)}. Existing ${e(old)}, so ${exp >= 0 ? 'increase' : 'decrease'} it by ${e(Math.abs(exp), 0)}: **Dr Bad debt expense / Cr Allowance ${e(exp, 0)}**${exp < 0 ? ' (a negative amount, i.e. a reversal)' : ''}. Net receivables shown = ${e(AR - need, 0)}. Waiting would overstate assets and profit now and push the loss into a later period; matching (and IFRS 9 expected-loss rules) require estimating it when the sale is recognised.`,
    keys: [`Target allowance ${e(need, 0)}`, `Expense ${e(exp, 0)}`, 'Matching / expected credit loss rationale']
  };
}});

TPL({ id: 'tp-bankrec', tier: 3, topic: acc, personas: ['clara', 'lena', 'olena'], gen(r) {
  const bank = r.step(5000, 50000, 10), oc = r.step(200, 6000, 10), dit = r.step(200, 5000, 10), fee = r.step(5, 60, 1), intr = r.step(1, 40, 1);
  const adj = bank - oc + dit, book = adj + fee - intr;
  return {
    msg: `Bank statement balance: ${e(bank)}. Cheques we wrote that haven't cleared: ${e(oc)}. A deposit we made on the last day isn't on the statement yet: ${e(dit)}. The bank charged a ${e(fee)} fee and paid ${e(intr)} interest that we haven't recorded. Our cash book shows ${e(book)}. Do they reconcile?`,
    hint: 'Adjust the bank side for timing items, the book side for items only the bank knows about.',
    answer: `Bank side: ${e(bank)} − outstanding cheques ${e(oc)} + deposit in transit ${e(dit)} = **${e(adj)}**. Book side: ${e(book)} − fee ${e(fee)} + interest ${e(intr)} = **${e(adj)}**. ✔ They reconcile. Only the book-side items need journal entries (record the fee as an expense and the interest as income); timing items clear by themselves.`,
    keys: [`Adjusted bank balance ${e(adj)}`, `Adjusted book balance ${e(adj)}`, 'Only book-side items need entries']
  };
}});

TPL({ id: 'tp-current-quick', tier: 3, topic: fa, personas: ['sam', 'adeyemi', 'yuki'], gen(r) {
  const cash = r.step(10, 300, 5) * 1e3, ar = r.step(20, 400, 10) * 1e3, inv = r.step(30, 600, 10) * 1e3, cl = r.step(50, 700, 10) * 1e3;
  const cr = (cash + ar + inv) / cl, qr = (cash + ar) / cl;
  return {
    msg: `Credit check on a supplier: cash ${k(cash)}, receivables ${k(ar)}, inventory ${k(inv)}; current liabilities ${k(cl)}. Compute the current and quick ratios. What do they tell us?`,
    hint: 'Current = current assets / current liabilities. Quick excludes inventory.',
    answer: `Current ratio = (${k(cash)} + ${k(ar)} + ${k(inv)}) / ${k(cl)} ≈ **${nt(cr, 2)}**. Quick ratio = (${k(cash)} + ${k(ar)}) / ${k(cl)} ≈ **${nt(qr, 2)}**. ${qr < 1 ? 'Quick ratio below 1: without selling inventory, liquid assets don\'t cover short-term obligations, so liquidity depends on moving stock.' : 'Quick ratio ≥ 1: short-term obligations are covered even without selling inventory.'} ${cr - qr > 1 ? 'The big gap shows a heavy reliance on inventory.' : ''} Compare with industry norms and trends, and check receivables quality.`,
    keys: [`Current ≈ ${nt(cr, 2)}`, `Quick ≈ ${nt(qr, 2)}`, 'Interpretation: liquidity / inventory reliance']
  };
}});

TPL({ id: 'tp-inv-turnover', tier: 3, topic: fa, personas: ['diego', 'raj', 'adeyemi'], gen(r) {
  const cogs = r.step(0.2, 20, 0.1) * 1e6, oi = cogs * r.step(0.05, 0.3, 0.01), ci = oi * r.step(0.8, 1.3, 0.05), avg = (oi + ci) / 2, t = cogs / avg;
  return {
    msg: `COGS for the year was ${k(cogs)}. Inventory was ${k(oi)} at the start and ${k(ci)} at the end. What's the inventory turnover and days of inventory? Is higher always better?`,
    hint: 'Turnover = COGS / average inventory. Days = 365 / turnover.',
    answer: `Average inventory = (${k(oi)} + ${k(ci)}) / 2 = ${k(avg)}. Turnover = ${k(cogs)} / ${k(avg)} ≈ **${nt(t, 1)}×**. Days inventory ≈ 365 / ${nt(t, 1)} ≈ **${nt(365 / t, 0)} days**. Higher turnover means less cash tied up and less risk of spoilage or obsolescence, but too high can mean stock-outs and lost sales. Compare with the industry: a restaurant turns stock far faster than a furniture shop.`,
    keys: [`Turnover ≈ ${nt(t, 1)}×`, `≈ ${nt(365 / t, 0)} days`, 'Trade-off: cash tied up vs stock-outs']
  };
}});

TPL({ id: 'tp-dso', tier: 3, topic: fa, personas: ['raj', 'priya', 'clara'], gen(r) {
  const S = r.step(0.1, 10, 0.1) * 1e6, ar = S * r.step(25, 90, 5) / 365, terms = r.pick([14, 30, 45]);
  const dso = ar / S * 365;
  return {
    msg: `Annual credit sales ${k(S)}; receivables at year-end ${k(ar)}. Our payment terms are ${terms} days. How long do customers take to pay on average? Is that a problem?`,
    hint: 'DSO = receivables / credit sales × 365.',
    answer: `DSO = ${k(ar)} / ${k(S)} × 365 ≈ **${nt(dso, 0)} days**. ${dso > terms * 1.2 ? `That's well beyond the ${terms}-day terms: customers pay late, which ties up cash and raises bad-debt risk. Chase overdue invoices, check credit limits, consider early-payment discounts.` : `That's close to the ${terms}-day terms, so collection looks under control.`} One year-end figure can be distorted by seasonality, so track it monthly.`,
    keys: [`DSO ≈ ${nt(dso, 0)} days`, `Compared with ${terms}-day terms`, 'Implications: cash/credit risk']
  };
}});

TPL({ id: 'tp-intcov', tier: 3, topic: fa, personas: ['sam', 'yuki'], gen(r) {
  const ebit = r.step(0.1, 20, 0.1) * 1e6, i = ebit / r.step(0.8, 12, 0.2);
  const ic = ebit / i;
  return {
    msg: `A borrower reports EBIT of ${k(ebit)} and interest expense of ${k(i)}. What's the interest coverage ratio and how comfortable should we be?`,
    hint: 'Interest coverage = EBIT / interest expense.',
    answer: `Interest coverage = ${k(ebit)} / ${k(i)} ≈ **${nt(ic, 1)}×**. ${ic < 1.5 ? 'Very thin: a small drop in profit means it can\'t cover interest from operations. High risk.' : ic < 3 ? 'Moderate: covered, but with limited cushion if profits fall.' : 'Comfortable: profits cover interest several times over.'} Lenders also look at cash-based measures (EBITDA or cash flow vs total debt service), since EBIT isn't cash and principal repayments also need covering.`,
    keys: [`Coverage ≈ ${nt(ic, 1)}×`, 'Interpretation of cushion', 'Mentions cash-flow / debt service view']
  };
}});

TPL({ id: 'tp-roe-roa', tier: 2, topic: fa, personas: ['yuki', 'tom', 'lena'], gen(r) {
  const A = r.step(1, 50, 1) * 1e6, eqs = r.step(0.25, 0.7, 0.05), NI = A * r.step(0.02, 0.12, 0.005);
  const E = A * eqs, roa = NI / A, roe = NI / E;
  return {
    msg: `A company has total assets of ${k(A)}, equity of ${k(E)} and net income of ${k(NI)}. What are ROA and ROE, and why is ROE higher?`,
    hint: 'ROA = net income / assets; ROE = net income / equity.',
    answer: `ROA = ${k(NI)} / ${k(A)} ≈ **${p(roa, 1)}**. ROE = ${k(NI)} / ${k(E)} ≈ **${p(roe, 1)}**. ROE is higher because only ${p(eqs, 0)} of the assets are financed by equity; the rest by debt and other liabilities. Leverage magnifies returns to shareholders (and risk). Comparing both shows how much of ROE comes from leverage.`,
    keys: [`ROA ≈ ${p(roa, 1)}`, `ROE ≈ ${p(roe, 1)}`, 'Difference due to leverage']
  };
}});

TPL({ id: 'tp-cfo', tier: 5, topic: acc, personas: ['lena', 'yuki', 'adeyemi'], gen(r) {
  const NI = r.step(50, 2000, 10) * 1e3, dep = NI * r.step(0.2, 0.8, 0.05), dAR = NI * r.step(-0.3, 0.5, 0.05), dInv = NI * r.step(-0.2, 0.5, 0.05), dAP = NI * r.step(-0.2, 0.3, 0.05);
  const cfo = NI + dep - dAR - dInv + dAP;
  const s = (x, up, down) => (x >= 0 ? `${up} ${k(x)}` : `${down} ${k(-x)}`);
  return {
    msg: `Indirect method practice: net income ${k(NI)}, depreciation ${k(dep)}. Receivables ${s(dAR, 'increased by', 'decreased by')}, inventory ${s(dInv, 'increased by', 'decreased by')}, payables ${s(dAP, 'increased by', 'decreased by')}. What's cash flow from operations?`,
    hint: 'Start with net income, add back non-cash expenses, subtract increases in working-capital assets, add increases in payables.',
    answer: `CFO = NI + depreciation − ΔReceivables − ΔInventory + ΔPayables = ${k(NI)} + ${k(dep)} ${dAR >= 0 ? '−' : '+'} ${k(Math.abs(dAR))} ${dInv >= 0 ? '−' : '+'} ${k(Math.abs(dInv))} ${dAP >= 0 ? '+' : '−'} ${k(Math.abs(dAP))} = **${k(cfo)}**. Depreciation is added back because it reduced profit without using cash. Growing receivables and stock absorb cash; growing payables means suppliers are financing you.`,
    keys: [`CFO ≈ ${k(cfo)}`, 'Adds back depreciation', 'Correct signs for working-capital changes']
  };
}});

TPL({ id: 'tp-fcf', tier: 4, topic: fa, personas: ['yuki', 'kat'], gen(r) {
  const cfo = r.step(0.5, 30, 0.5) * 1e6, capex = cfo * r.step(0.3, 1.3, 0.05), div = cfo * r.step(0, 0.3, 0.05), fcf = cfo - capex;
  return {
    msg: `Operating cash flow ${k(cfo)}, capital expenditure ${k(capex)}, dividends paid ${k(div)}. What's free cash flow, and can the company afford its dividend from it?`,
    hint: 'FCF (to the firm, simplified) = operating cash flow − capex.',
    answer: `FCF = ${k(cfo)} − ${k(capex)} = **${k(fcf)}**. ${fcf >= div ? `That covers the ${k(div)} dividend with ${k(fcf - div)} to spare.` : `That ${fcf < 0 ? 'is negative and ' : ''}doesn't cover the ${k(div)} dividend; the gap of ${k(div - fcf)} must come from cash reserves or borrowing, which isn't sustainable long-term.`} FCF is the cash left after keeping and growing the asset base, available for debt repayment, dividends, buybacks or acquisitions.`,
    keys: [`FCF ≈ ${k(fcf)}`, fcf >= div ? 'Dividend covered' : 'Dividend not covered by FCF', 'Explains what FCF represents']
  };
}});

// ───────── Managerial ─────────
TPL({ id: 'q302', tier: 3, topic: mgr, personas: ['adeyemi', 'diego', 'olena'], gen(r) {
  const P = r.step(10, 120, 1), v = +(P * r.step(0.3, 0.7, 0.05)).toFixed(2), cm = P - v, BE = r.step(500, 8000, 100), FC = Math.round(BE * cm), Q = Math.round(BE * r.step(0.7, 1.5, 0.05) / 50) * 50;
  const prof = Q * cm - FC;
  return {
    msg: `Product line check: fixed costs are ${e(FC)} per month, we sell at ${e(P)} per unit, variable cost is ${e(v, 2)} per unit. What's our break-even volume? And what's the profit if we sell ${n(Q)} units?`,
    hint: 'Contribution margin per unit = price − variable cost.',
    answer: `Contribution margin = ${e(P)} − ${e(v, 2)} = ${e(cm, 2)} per unit. Break-even = ${e(FC)} / ${e(cm, 2)} ≈ **${n(FC / cm, 0)} units** a month (≈ ${e(FC / cm * P, 0)} revenue). At ${n(Q)} units: ${n(Q)} × ${e(cm, 2)} − ${e(FC)} = **${e(prof, 0)}**. Each unit beyond break-even adds ${e(cm, 2)} of profit.`,
    keys: [`CM ${e(cm, 2)}/unit`, `Break-even ≈ ${n(FC / cm, 0)} units`, `Profit at ${n(Q)} = ${e(prof, 0)}`]
  };
}});

TPL({ id: 'tp-target-profit', tier: 3, topic: mgr, personas: ['diego', 'olena', 'raj'], gen(r) {
  const P = r.step(8, 60, 0.5), v = +(P * r.step(0.3, 0.6, 0.05)).toFixed(2), FC = r.step(5000, 60000, 1000), T = r.step(2000, 30000, 1000), cm = P - v;
  const Q = (FC + T) / cm;
  return {
    msg: `Fixed costs are ${e(FC)} a month. Each meal sells for ${e(P, 2)} and costs ${e(v, 2)} in variable costs. How many meals do I need to sell to make ${e(T)} profit a month?`,
    hint: 'Units = (fixed costs + target profit) / contribution margin per unit.',
    answer: `Contribution per meal = ${e(P, 2)} − ${e(v, 2)} = ${e(cm, 2)}. Required volume = (${e(FC)} + ${e(T)}) / ${e(cm, 2)} ≈ **${n(Math.ceil(Q))} meals** a month (about ${n(Math.ceil(Q / 30))} a day). Break-even alone would be ${n(Math.ceil(FC / cm))}. Raising contribution per meal (price or cost) cuts the volume needed.`,
    keys: [`CM ${e(cm, 2)}`, `≈ ${n(Math.ceil(Q))} meals`, 'Formula (FC + target) / CM']
  };
}});

TPL({ id: 'tp-cm-ratio', tier: 4, topic: mgr, personas: ['adeyemi', 'raj'], gen(r) {
  const cmr = r.step(0.2, 0.6, 0.05), FC = r.step(50, 2000, 10) * 1e3, S = FC / cmr * r.step(0.8, 1.5, 0.05);
  const be = FC / cmr, prof = S * cmr - FC, mos = (S - be) / S;
  return {
    msg: `Our contribution margin ratio is ${p(cmr, 0)} and fixed costs are ${k(FC)}. Sales this year are ${k(S)}. What's break-even revenue, our profit, and our margin of safety?`,
    hint: 'Break-even revenue = fixed costs / CM ratio.',
    answer: `Break-even sales = ${k(FC)} / ${p(cmr, 0)} = **${k(be)}**. Profit = ${k(S)} × ${p(cmr, 0)} − ${k(FC)} = **${k(prof)}**. Margin of safety = (${k(S)} − ${k(be)}) / ${k(S)} ≈ **${p(mos, 1)}**: ${mos > 0 ? 'how far sales can fall before losses start' : 'negative, so we are below break-even'}.`,
    keys: [`Break-even ≈ ${k(be)}`, `Profit ≈ ${k(prof)}`, `Margin of safety ≈ ${p(mos, 0)}`]
  };
}});

TPL({ id: 'tp-make-buy', tier: 4, topic: mgr, personas: ['adeyemi'], gen(r) {
  const Q = r.step(2000, 50000, 1000), dm = r.step(3, 20, 0.5), dl = r.step(2, 15, 0.5), voh = r.step(1, 6, 0.5), afc = r.step(0, 60000, 5000), ufc = r.step(10000, 120000, 5000), buy = +((dm + dl + voh + afc / Q) * r.step(0.85, 1.2, 0.05)).toFixed(2);
  const make = (dm + dl + voh) * Q + afc, b = buy * Q, full = (dm + dl + voh) * Q + afc + ufc;
  return {
    msg: `We make ${n(Q)} components a year: materials ${e(dm, 2)}, labour ${e(dl, 2)}, variable overhead ${e(voh, 2)} per unit, plus ${e(afc + ufc)} of allocated fixed overhead (of which ${e(afc)} would disappear if we stopped making it). A supplier offers ${e(buy, 2)} per unit. Make or buy?`,
    hint: 'Only relevant (avoidable) costs matter. Unavoidable fixed overhead stays either way.',
    answer: `Relevant cost to make = variable ${e(dm + dl + voh, 2)} × ${n(Q)} + avoidable fixed ${e(afc)} = **${e(make, 0)}**. Cost to buy = ${e(buy, 2)} × ${n(Q)} = **${e(b, 0)}**. → **${make <= b ? 'Make' : 'Buy'}** (saves ${e(Math.abs(make - b), 0)} a year). The ${e(ufc)} unavoidable overhead is irrelevant: it stays whichever we choose. Including it (full cost ${e(full / Q, 2)}/unit) could wrongly push us to buy. Also weigh quality, supply risk and whether freed capacity has another use.`,
    keys: [`Relevant make cost ${e(make, 0)}`, `Buy cost ${e(b, 0)}`, `${make <= b ? 'Make' : 'Buy'}; ignores unavoidable fixed costs`]
  };
}});

TPL({ id: 'tp-special-order', tier: 4, topic: mgr, personas: ['adeyemi', 'olena', 'diego'], gen(r) {
  const v = r.step(4, 40, 0.5), fu = +(v * r.step(0.3, 0.8, 0.05)).toFixed(2), price = +((v + fu) * r.step(1.2, 1.6, 0.05)).toFixed(2), off = +(v * r.step(0.9, 1.4, 0.05)).toFixed(2), Q = r.step(200, 5000, 100);
  const gain = (off - v) * Q;
  return {
    msg: `A hotel chain wants a one-off order of ${n(Q)} units at ${e(off, 2)} each. Our normal price is ${e(price, 2)}; full cost is ${e(v + fu, 2)} (variable ${e(v, 2)} + fixed overhead ${e(fu, 2)} per unit). We have spare capacity. Accept?`,
    hint: 'With spare capacity, fixed costs don\'t change. Compare the offer with variable cost.',
    answer: `With spare capacity, only variable costs change. Contribution = (${e(off, 2)} − ${e(v, 2)}) × ${n(Q)} = **${e(gain, 0)}**. ${gain > 0 ? '**Accept**: it adds profit even though it\'s below full cost.' : '**Reject**: the price doesn\'t even cover variable cost.'} Fixed overhead per unit is an allocation, not an extra cost. Check qualitative risks: regular customers demanding the same discount, and whether capacity is truly spare.`,
    keys: [`Incremental profit ${e(gain, 0)}`, gain > 0 ? 'Accept' : 'Reject', 'Uses variable cost; fixed overhead irrelevant with spare capacity']
  };
}});

TPL({ id: 'tp-oar', tier: 4, topic: mgr, personas: ['adeyemi', 'lena'], gen(r) {
  const boh = r.step(100, 2000, 10) * 1e3, bh = r.step(5, 100, 1) * 1e3, ah = Math.round(bh * r.step(0.85, 1.15, 0.01)), aoh = Math.round(boh * r.step(0.9, 1.1, 0.01));
  const oar = boh / bh, abs = oar * ah, diff = abs - aoh;
  return {
    msg: `Budgeted production overhead: ${e(boh)}; budgeted machine hours: ${n(bh)}. Actual hours worked: ${n(ah)}; actual overhead: ${e(aoh)}. What's the overhead absorption rate, how much overhead was absorbed, and is it over- or under-absorbed?`,
    hint: 'OAR = budgeted overhead / budgeted hours. Absorbed = OAR × actual hours.',
    answer: `OAR = ${e(boh)} / ${n(bh)} h ≈ **${e(oar, 2)} per machine hour**. Absorbed = ${e(oar, 2)} × ${n(ah)} ≈ **${e(abs, 0)}**. Actual overhead ${e(aoh)} → ${diff >= 0 ? '**over-absorbed**' : '**under-absorbed**'} by ${e(Math.abs(diff), 0)}. ${diff >= 0 ? 'Too much was charged to products; the excess is credited to profit.' : 'Products were charged too little; the shortfall is an extra expense in profit.'}`,
    keys: [`OAR ≈ ${e(oar, 2)}/hour`, `Absorbed ≈ ${e(abs, 0)}`, `${diff >= 0 ? 'Over' : 'Under'}-absorbed by ${e(Math.abs(diff), 0)}`]
  };
}});

TPL({ id: 'tp-mat-var', tier: 5, topic: mgr, personas: ['adeyemi'], gen(r) {
  const sp = r.step(1, 20, 0.1), sq = r.step(1, 6, 0.5), out = r.step(500, 10000, 100), ap = +(sp * r.step(0.85, 1.2, 0.01)).toFixed(2), aq = Math.round(sq * out * r.step(0.9, 1.12, 0.01));
  const pv = (sp - ap) * aq, uv = (sq * out - aq) * sp, tot = sq * out * sp - ap * aq;
  const fav = (x) => (x >= 0 ? 'favourable' : 'adverse');
  return {
    msg: `Standard: ${nt(sq, 1)} kg of material per unit at ${e(sp, 2)}/kg. We produced ${n(out)} units, buying and using ${n(aq)} kg at ${e(ap, 2)}/kg. Calculate the material price and usage variances. What might explain them?`,
    hint: 'Price variance = (SP − AP) × AQ. Usage variance = (SQ − AQ) × SP, with SQ = standard kg for actual output.',
    answer: `Standard quantity for actual output = ${nt(sq, 1)} × ${n(out)} = ${n(sq * out)} kg. Price variance = (${e(sp, 2)} − ${e(ap, 2)}) × ${n(aq)} = **${e(Math.abs(pv), 0)} ${fav(pv)}**. Usage variance = (${n(sq * out)} − ${n(aq)}) × ${e(sp, 2)} = **${e(Math.abs(uv), 0)} ${fav(uv)}**. Total = ${e(Math.abs(tot), 0)} ${fav(tot)}. Possible links: cheaper, lower-quality material can mean a favourable price but adverse usage (more waste), and vice versa; so investigate them together.`,
    keys: [`Price variance ${e(Math.abs(pv), 0)} ${fav(pv)}`, `Usage variance ${e(Math.abs(uv), 0)} ${fav(uv)}`, 'Plausible causes / interdependence']
  };
}});

TPL({ id: 'tp-absorb-var', tier: 5, topic: mgr, personas: ['adeyemi', 'lena'], gen(r) {
  const prod = r.step(5000, 50000, 1000), sold = Math.round(prod * r.step(0.7, 0.95, 0.01) / 100) * 100, FOH = r.step(50, 800, 10) * 1e3;
  const fpu = FOH / prod, diff = (prod - sold) * fpu;
  return {
    msg: `We produced ${n(prod)} units but sold only ${n(sold)} (no opening stock). Fixed production overhead was ${e(FOH)}. Which shows higher profit, absorption or variable (marginal) costing, and by how much?`,
    hint: 'Under absorption costing part of the fixed overhead sits in closing inventory.',
    answer: `Fixed overhead per unit = ${e(FOH)} / ${n(prod)} = ${e(fpu, 2)}. Closing inventory = ${n(prod - sold)} units, which under absorption costing carry ${n(prod - sold)} × ${e(fpu, 2)} = **${e(diff, 0)}** of fixed overhead into next period. So **absorption costing profit is ${e(diff, 0)} higher**; variable costing expenses all fixed overhead now. That's why building inventory can flatter absorption-costing profit, a known incentive problem.`,
    keys: [`Difference ${e(diff, 0)}`, 'Absorption higher when production > sales', 'Fixed overhead deferred in inventory']
  };
}});

TPL({ id: 'tp-sales-mix', tier: 5, topic: mgr, personas: ['diego', 'adeyemi'], gen(r) {
  const cA = r.step(3, 12, 0.5), cB = r.step(6, 20, 0.5), mA = r.step(0.4, 0.8, 0.1), FC = r.step(10, 200, 5) * 1e3;
  const wcm = mA * cA + (1 - mA) * cB, be = FC / wcm;
  return {
    msg: `We sell two items: lunch menus (contribution ${e(cA, 2)} each) and dinner menus (contribution ${e(cB, 2)} each). ${p(mA, 0)} of covers are lunch, ${p(1 - mA, 0)} dinner. Fixed costs ${e(FC)} a month. How many covers to break even, and what if the mix shifts towards lunch?`,
    hint: 'Use the weighted average contribution per cover.',
    answer: `Weighted CM = ${nt(mA, 1)} × ${e(cA, 2)} + ${nt(1 - mA, 1)} × ${e(cB, 2)} = ${e(wcm, 2)}. Break-even = ${e(FC)} / ${e(wcm, 2)} ≈ **${n(Math.ceil(be))} covers** (≈ ${n(Math.ceil(be * mA))} lunch + ${n(Math.ceil(be * (1 - mA)))} dinner). ${cA < cB ? 'Lunch earns less per cover, so a shift towards lunch lowers the weighted CM and **raises** the break-even volume.' : 'Lunch earns more per cover, so a shift towards lunch **lowers** the break-even volume.'} Break-even only holds for the assumed mix.`,
    keys: [`Weighted CM ${e(wcm, 2)}`, `Break-even ≈ ${n(Math.ceil(be))} covers`, 'Mix shift effect']
  };
}});

TPL({ id: 'tp-uop', tier: 3, topic: acc, personas: ['pavlo', 'diego'], gen(r) {
  const C = r.step(50000, 400000, 5000), res = Math.round(C * r.step(0, 0.15, 0.05) / 1000) * 1000, H = r.step(5000, 20000, 500), h = r.step(500, 3000, 50);
  const rate = (C - res) / H;
  return {
    msg: `I bought a combine harvester for ${e(C)}. It should run ${n(H)} engine hours and then be worth ${e(res)}. This season it ran ${n(h)} hours. Using units-of-production depreciation, what's this year's charge? Why might that suit a farm better than straight-line?`,
    hint: 'Rate per hour = (cost − residual) / total hours.',
    answer: `Rate = (${e(C)} − ${e(res)}) / ${n(H)} h ≈ ${e(rate, 2)} per hour. This year: ${n(h)} × ${e(rate, 2)} ≈ **${e(rate * h, 0)}**. Units-of-production ties depreciation to actual use, so a poor harvest year with fewer hours carries less depreciation, matching cost with the revenue the machine actually helped earn. Straight-line would charge the same regardless of use.`,
    keys: [`Rate ≈ ${e(rate, 2)}/hour`, `Charge ≈ ${e(rate * h, 0)}`, 'Matches depreciation to usage']
  };
}});

TPL({ id: 'tp-nrv', tier: 4, topic: acc, personas: ['raj', 'clara', 'lena'], gen(r) {
  const q = r.step(100, 2000, 50), c = r.step(10, 80, 1), sp = +(c * r.step(0.6, 1.3, 0.05)).toFixed(2), sc = +(sp * r.step(0.05, 0.2, 0.05)).toFixed(2);
  const nrv = sp - sc, val = Math.min(c, nrv) * q, wd = Math.max(0, c - nrv) * q;
  return {
    msg: `We have ${n(q)} units of last season's model in stock, cost ${e(c)} each. We can now only sell them at ${e(sp, 2)} each, with ${e(sc, 2)} per unit of selling costs. At what value do they go on the balance sheet?`,
    hint: 'Inventory is measured at the lower of cost and net realisable value.',
    answer: `NRV = selling price − costs to sell = ${e(sp, 2)} − ${e(sc, 2)} = ${e(nrv, 2)} per unit. Lower of cost (${e(c)}) and NRV (${e(nrv, 2)}) = ${e(Math.min(c, nrv), 2)}. Carrying amount = **${e(val, 0)}**. ${wd > 0 ? `Write-down of **${e(wd, 0)}** to profit or loss now (prudence: don't carry assets above what they'll recover).` : 'No write-down needed: NRV is above cost.'}`,
    keys: [`NRV ${e(nrv, 2)}/unit`, `Inventory value ${e(val, 0)}`, wd > 0 ? `Write-down ${e(wd, 0)}` : 'No write-down']
  };
}});

TPL({ id: 'tp-is-build', tier: 2, topic: acc, personas: ['lena', 'olena', 'diego'], gen(r) {
  const R = r.step(100, 5000, 10) * 1e3, cogs = R * r.step(0.4, 0.7, 0.05), opex = R * r.step(0.15, 0.35, 0.05), int = R * r.step(0.005, 0.03, 0.005), t = r.pick([0.2, 0.25, 0.3]);
  const gp = R - cogs, ebit = gp - opex, ebt = ebit - int, tax = Math.max(0, ebt * t), ni = ebt - tax;
  return {
    msg: `Help me build an income statement: revenue ${k(R)}, cost of goods sold ${k(cogs)}, operating expenses ${k(opex)}, interest ${k(int)}, tax rate ${p(t, 0)}. What are gross profit, operating profit (EBIT) and net income?`,
    hint: 'Revenue → gross profit → EBIT → profit before tax → net income.',
    answer: `Gross profit = ${k(R)} − ${k(cogs)} = **${k(gp)}** (${p(gp / R, 1)} margin). EBIT = ${k(gp)} − ${k(opex)} = **${k(ebit)}**. Profit before tax = ${k(ebit)} − ${k(int)} = ${k(ebt)}. Tax = ${k(tax)}. Net income = **${k(ni)}** (${p(ni / R, 1)} net margin). Each level answers a different question: pricing/production (gross), operations (EBIT), financing (interest), and what's left for owners.`,
    keys: [`Gross profit ${k(gp)}`, `EBIT ${k(ebit)}`, `Net income ${k(ni)}`]
  };
}});

TPL({ id: 'tp-retained', tier: 2, topic: acc, personas: ['lena', 'yuki'], gen(r) {
  const o = r.step(50, 5000, 10) * 1e3, ni = r.step(-200, 1500, 10) * 1e3, div = Math.max(0, Math.round(Math.max(ni, 0) * r.step(0, 0.7, 0.1) / 1000) * 1000), c = o + ni - div;
  return {
    msg: `Retained earnings were ${k(o)} at the start of the year. Net ${ni >= 0 ? 'income' : 'loss'} was ${k(Math.abs(ni))} and dividends of ${k(div)} were declared. What are closing retained earnings? Is retained earnings a pile of cash?`,
    hint: 'Closing RE = opening RE + net income − dividends.',
    answer: `Closing retained earnings = ${k(o)} ${ni >= 0 ? '+' : '−'} ${k(Math.abs(ni))} − ${k(div)} = **${k(c)}**. Retained earnings is **not cash**: it's the cumulative profit kept in the business, part of equity, and has long since been invested in inventory, equipment, receivables, etc. A company can have large retained earnings and little cash.`,
    keys: [`Closing RE ${k(c)}`, 'Opening + NI − dividends', 'Not cash; part of equity']
  };
}});

TPL({ id: 'tp-accrual-cash', tier: 2, topic: acc, personas: ['priya', 'raj', 'olena'], gen(r) {
  const cr = r.step(5000, 50000, 500), cs = r.step(2000, 30000, 500), col = Math.round(cr * r.step(0.3, 0.9, 0.05) / 100) * 100, old = r.step(1000, 15000, 500);
  return {
    msg: `This month: cash sales ${e(cs)}, sales on credit ${e(cr)} (customers paid ${e(col)} of those so far), and customers also paid ${e(old)} for invoices from last month. What's this month's revenue under accrual accounting, and how much cash came in?`,
    hint: 'Revenue = what was earned this month. Cash = what was collected this month.',
    answer: `Accrual revenue = cash sales + credit sales = ${e(cs)} + ${e(cr)} = **${e(cs + cr)}**. Cash received = ${e(cs)} + ${e(col)} + ${e(old)} (last month's invoices) = **${e(cs + col + old)}**. Receivables grew by ${e(cr - col - old)} net. Revenue follows performance; cash follows payment. That's why profit and cash flow differ.`,
    keys: [`Revenue ${e(cs + cr)}`, `Cash collected ${e(cs + col + old)}`, 'Explains timing difference']
  };
}});

// ───────── Advanced (IFRS) ─────────
TPL({ id: 'tp-poc', tier: 5, topic: adv, personas: ['clara', 'adeyemi'], gen(r) {
  const price = r.step(1, 20, 0.5) * 1e6, est = price * r.step(0.7, 0.9, 0.01), c1 = est * r.step(0.2, 0.6, 0.05);
  const pct = c1 / est, rev = price * pct, prof = rev - c1;
  return {
    msg: `We signed a fixed-price construction contract for ${k(price)}. Total estimated costs are ${k(est)}. By year-end we've incurred ${k(c1)}. Under the cost-to-cost input method, how much revenue and profit do we recognise this year?`,
    hint: 'Progress = costs incurred / total estimated costs.',
    answer: `Progress = ${k(c1)} / ${k(est)} ≈ **${p(pct, 1)}**. Revenue = ${p(pct, 1)} × ${k(price)} ≈ **${k(rev)}**. Profit = ${k(rev)} − ${k(c1)} ≈ **${k(prof)}**. Under IFRS 15, revenue is recognised over time when the customer controls the asset as it's built; the cost-to-cost method measures progress. If total costs were expected to exceed the price, the whole expected loss would be recognised immediately.`,
    keys: [`Progress ≈ ${p(pct, 0)}`, `Revenue ≈ ${k(rev)}`, `Profit ≈ ${k(prof)}`]
  };
}});

TPL({ id: 'tp-deftax', tier: 6, topic: adv, personas: ['adeyemi', 'clara'], gen(r) {
  const C = r.step(100, 2000, 10) * 1e3, lb = r.int(4, 10), lt = r.int(2, lb - 1), t = r.pick([0.25, 0.3]);
  const bk = C / lb, tx = C / lt, td = tx - bk, dtl = td * t;
  return {
    msg: `We bought equipment for ${e(C)}. In the books we depreciate it over ${lb} years; tax rules allow ${lt} years (both straight-line, no residual). Tax rate ${p(t, 0)}. What deferred tax arises at the end of year 1, and why?`,
    hint: 'Compare carrying amount with tax base; multiply the temporary difference by the tax rate.',
    answer: `Book depreciation = ${e(bk, 0)}; tax depreciation = ${e(tx, 0)}. Carrying amount = ${e(C - bk, 0)}; tax base = ${e(C - tx, 0)}. Taxable temporary difference = ${e(td, 0)}. **Deferred tax liability = ${p(t, 0)} × ${e(td, 0)} = ${e(dtl, 0)}** (Dr Deferred tax expense / Cr DTL). Faster tax depreciation lowers tax now but raises it later when book depreciation exceeds tax depreciation; the DTL recognises that future tax, matching tax expense to accounting profit.`,
    keys: [`Temporary difference ${e(td, 0)}`, `DTL ${e(dtl, 0)}`, 'Explains reversal / matching']
  };
}});

TPL({ id: 'q607', tier: 6, topic: adv, personas: ['olena', 'diego'], gen(r) {
  const pay = r.step(12000, 60000, 1000), y = r.int(3, 10), rt = r.step(0.03, 0.08, 0.005);
  const L = pay * (1 - (1 + rt) ** -y) / rt, int1 = L * rt, dep1 = L / y, exp1 = int1 + dep1;
  return {
    msg: `Expanding! 🎉 I signed a ${y}-year lease for a second shop at ${e(pay)} per year (paid at year-end). My incremental borrowing rate is ${p(rt)}. Under IFRS 16, what goes on the balance sheet and what's the year-1 expense? How does that compare with rent of ${e(pay)}?`,
    hint: 'Lease liability = PV of payments. ROU asset depreciated straight-line; interest on the liability.',
    answer: `Lease liability = ${e(pay)} × [1 − ${nt(1 + rt, 3)}^−${y}] / ${nt(rt, 3)} ≈ **${e(L, 0)}**, and a right-of-use asset of the same amount. Year 1: interest = ${p(rt)} × ${e(L, 0)} ≈ ${e(int1, 0)}; depreciation = ${e(L, 0)} / ${y} ≈ ${e(dep1, 0)}. Total year-1 expense ≈ **${e(exp1, 0)}** vs ${e(pay)} of rent: front-loaded, falling later as interest shrinks. EBITDA rises (no rent expense), and debt-like liabilities increase. Short-term and low-value leases can be exempt.`,
    keys: [`Liability/ROU ≈ ${e(L, 0)}`, `Year-1 expense ≈ ${e(exp1, 0)}`, 'Front-loaded; EBITDA up; leverage up']
  };
}});

TPL({ id: 'q601', tier: 6, topic: adv, personas: ['adeyemi'], gen(r) {
  const cons = r.step(10, 200, 5) * 1e6, na = cons * r.step(0.5, 0.85, 0.05), gw = cons - na, other = na * r.step(0.8, 1, 0.05), rec = (gw + other) * r.step(0.7, 1.05, 0.05);
  const carrying = gw + other, imp = Math.max(0, carrying - rec);
  return {
    msg: `We acquired a competitor for ${k(cons)}. Fair value of its identifiable net assets: ${k(na)}. How much goodwill do we record and how is it treated under IFRS? A year later the unit's other net assets are carried at ${k(other)} and its recoverable amount is ${k(rec)}. Any impairment?`,
    hint: 'Goodwill = consideration − fair value of net assets. Then compare the CGU carrying amount (incl. goodwill) with recoverable amount.',
    answer: `Goodwill = ${k(cons)} − ${k(na)} = **${k(gw)}**. Under IFRS it's **not amortised**; it's tested for impairment at least annually at cash-generating-unit level. CGU carrying amount = ${k(gw)} + ${k(other)} = ${k(carrying)} vs recoverable ${k(rec)} → ${imp > 0 ? `impairment of **${k(imp)}**, charged first against goodwill (${k(Math.min(imp, gw))})${imp > gw ? ' then other assets' : ''}` : '**no impairment**'}. Goodwill impairments can never be reversed.`,
    keys: [`Goodwill ${k(gw)}`, 'No amortisation; annual impairment test', imp > 0 ? `Impairment ${k(imp)} against goodwill first` : 'No impairment']
  };
}});

TPL({ id: 'tp-impair', tier: 5, topic: adv, personas: ['clara', 'adeyemi'], gen(r) {
  const ca = r.step(100, 5000, 10) * 1e3, fv = ca * r.step(0.5, 1.1, 0.05), viu = ca * r.step(0.5, 1.1, 0.05);
  const rec = Math.max(fv, viu), imp = Math.max(0, ca - rec);
  return {
    msg: `A specialised machine has a carrying amount of ${k(ca)}. It could be sold for ${k(fv)} after disposal costs; the present value of cash flows from using it is ${k(viu)}. Is it impaired under IAS 36?`,
    hint: 'Recoverable amount = higher of fair value less costs of disposal and value in use.',
    answer: `Recoverable amount = max(${k(fv)}, ${k(viu)}) = **${k(rec)}** (${fv >= viu ? 'selling' : 'using it'} is worth more). Carrying amount ${k(ca)} ${imp > 0 ? `exceeds it, so recognise an **impairment loss of ${k(imp)}** in profit or loss and reduce the asset to ${k(rec)}` : 'is not above it, so **no impairment**'}. Logic: an asset shouldn't be carried above the best value the company can get from it, whether by using or selling it.`,
    keys: [`Recoverable amount ${k(rec)}`, imp > 0 ? `Impairment ${k(imp)}` : 'No impairment', 'Higher of FVLCD and VIU']
  };
}});

TPL({ id: 'tp-fx-txn', tier: 5, topic: adv, personas: ['raj', 'clara'], gen(r) {
  const usd = r.step(5000, 200000, 1000), r0 = r.step(1.04, 1.2, 0.005), r1 = +(r0 * r.step(0.94, 1.06, 0.005)).toFixed(3);
  const e0 = usd / r0, e1 = usd / r1, diff = e0 - e1;
  return {
    msg: `We bought goods from a US supplier for $${n(usd)}, invoice received when EUR/USD was ${nt(r0, 3)} (dollars per euro). We paid when the rate was ${nt(r1, 3)}. What did we record initially, what did we pay in euros, and is there an exchange gain or loss?`,
    hint: 'Euros = dollars / (dollars per euro).',
    answer: `Initial payable = $${n(usd)} / ${nt(r0, 3)} ≈ **${e(e0, 0)}**. Paid = $${n(usd)} / ${nt(r1, 3)} ≈ **${e(e1, 0)}**. ${diff >= 0 ? `Exchange **gain** ≈ ${e(diff, 0)}: the euro strengthened, so fewer euros were needed.` : `Exchange **loss** ≈ ${e(-diff, 0)}: the euro weakened, so more euros were needed.`} Under IAS 21 the difference goes to profit or loss; the inventory cost stays at the original rate. Forward contracts can hedge this risk.`,
    keys: [`Initial ≈ ${e(e0, 0)}`, `Paid ≈ ${e(e1, 0)}`, `${diff >= 0 ? 'Gain' : 'Loss'} ≈ ${e(Math.abs(diff), 0)} in P&L`]
  };
}});
})();
