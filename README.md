# Balance Desk

A chat game that teaches finance, economics and accounting. You're a support agent; customers message you questions, the Mentor grades your reply and explains it.

## Play
Unzip the Windows build and run `Balance Desk.exe`. Windows may show a SmartScreen warning because the app isn't signed: click **More info → Run anyway**.

Add your OpenRouter key in **☰ → Settings & API key**. Without a key you can still play by checking your replies against the model answers yourself.

Your save file lives in `%APPDATA%\balance-desk\save.json`.

## The question bank (1,004 questions)
All questions live in `renderer/data/`. The AI never writes questions; it only grades your reply against the stored answer and key points.

- **Templates** (`tpl_*.js`, 159 of them): numeric questions. Each time a template is delivered, the game picks fresh random numbers and **calculates the correct answer in code**, so you can't memorise results. A template counts as done after you solve it twice with different numbers. Retries of the same ticket keep the same numbers.
- **Fixed questions** (`core.js`, `q_*.js`, 845 of them): conceptual "explain why" questions across 19 topics, tiers 1–6, from 22 recurring customers.

### Add your own
- Fixed: open any `q_*.js` file and **append** a row to a block: `[persona, tier, "question", "hint", "model answer", ["key point", …]]`. Only append; inserting rows in the middle shifts the ids of later rows and confuses old save files.
- Template: copy one from a `tpl_*.js` file, give it a new `id`, and write a `gen(r, pid)` that returns `{ msg, hint, answer, keys }`. Use `r.int`, `r.step`, `r.pick` for random values.
- New file: add it to `renderer/data/manifest.json` and a `<script>` tag in `renderer/index.html`.
- Check your changes: `node tools/validate.js` (checks ids, personas, and fuzzes every template 500 times).

## Run from source / rebuild the .exe
Needs Node.js 18+.
```
npm install
npm start            # run it
npm run build:win    # builds dist/Balance Desk-win32-x64/
```
