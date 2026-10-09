const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const savePath = () => path.join(app.getPath('userData'), 'save.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 1220,
    height: 800,
    minWidth: 880,
    minHeight: 580,
    backgroundColor: '#0e1621',
    title: 'Balance Desk',
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e) => e.preventDefault());
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
});
app.on('window-all-closed', () => app.quit());

ipcMain.handle('load', () => {
  try { return JSON.parse(fs.readFileSync(savePath(), 'utf8')); } catch { return null; }
});

ipcMain.handle('save', (_e, data) => {
  const p = savePath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const tmp = p + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data));
  fs.renameSync(tmp, p);
  return true;
});

ipcMain.handle('reset', () => {
  try { fs.unlinkSync(savePath()); } catch {}
  return true;
});

ipcMain.handle('open', (_e, url) => {
  if (/^https:\/\//.test(url)) shell.openExternal(url);
});

// OpenRouter call. Only used to grade replies and power the Mentor chat.
ipcMain.handle('llm', async (_e, { apiKey, model, messages, maxTokens }) => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 90000);
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://balance-desk.local',
        'X-Title': 'Balance Desk'
      },
      body: JSON.stringify({ model, messages, temperature: 0.3, max_tokens: maxTokens || 900 })
    });
    const text = await res.text();
    let body = null;
    try { body = JSON.parse(text); } catch {}
    if (!res.ok) {
      const msg = body?.error?.message || text.slice(0, 200) || `HTTP ${res.status}`;
      return { ok: false, error: `OpenRouter error ${res.status}: ${msg}` };
    }
    const content = body?.choices?.[0]?.message?.content;
    if (!content) return { ok: false, error: 'OpenRouter returned an empty reply. Try another model in Settings.' };
    return { ok: true, content };
  } catch (err) {
    if (err.name === 'AbortError') return { ok: false, error: 'The grader took longer than 90 seconds. Check your connection and try again.' };
    return { ok: false, error: `Could not reach OpenRouter: ${err.message}` };
  } finally {
    clearTimeout(timer);
  }
});
