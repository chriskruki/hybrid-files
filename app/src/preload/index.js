import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  openDialog: (properties) => ipcRenderer.invoke('dialog', properties),
  readDir: (dir, fileTypes, recursive) => ipcRenderer.invoke('readDir', dir, fileTypes, recursive),
  sqlBridge: (command, payload) => ipcRenderer.invoke('sqlBridge', command, payload)
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
