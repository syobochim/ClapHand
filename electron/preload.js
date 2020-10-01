// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

const { contextBridge, ipcRenderer} = require("electron");
contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, data) => {//rendererからの送信用//
        ipcRenderer.send(channel, data);            
      },
    on: (channel, func) => { //rendererでの受信用, funcはコールバック関数//
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
);