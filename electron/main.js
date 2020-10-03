// Modules to control application life and create native browser window
const {app, screen, Tray, Menu, BrowserWindow, ipcMain} = require("electron");
const path = require('path')

let settingWindow;
function createSettingWindow() {
  var electronScreen = screen;
  settingWindow = new BrowserWindow({
    width: 300,
    height: 200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  settingWindow.loadFile('setting.html')
}

let mainWindow;
function createClapWindow() {
  // Create the browser window.
  var electronScreen = screen;
  mainWindow = new BrowserWindow({
    width: 200,
    height: 200,
    transparent: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      // preload: path.join(__dirname, 'preload.js')
    }
  })
  var size = electronScreen.getPrimaryDisplay().workAreaSize;
  mainWindow.setPosition(size.width - 200, size.height - 200)

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function createTaskBar() {
  tray = new Tray(path.join(__dirname, './image/logo.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: "Setting", click: function () { createSettingWindow() }},
    { label: "Quit", click: function () { app.quit(); } }
  ])
  tray.setContextMenu(contextMenu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createSettingWindow()
  createClapWindow()
  createTaskBar()
  console.log('setting end.')
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createClapWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
