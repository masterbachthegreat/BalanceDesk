const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  load: () => ipcRenderer.invoke('load'),
  save: (data) => ipcRenderer.invoke('save', data),
  reset: () => ipcRenderer.invoke('reset'),
  llm: (payload) => ipcRenderer.invoke('llm', payload),
  open: (url) => ipcRenderer.invoke('open', url)
});
