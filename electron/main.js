// Modules to control application life and create native browser window
const electron = require('electron');
const app = electron.app;
const path = require('path')
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow () {
  // Create the browser window.
  // mainWindow.setPosition()
  var electronScreen = electron.screen;
  var size = electronScreen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: 300,
    height: 250,
    transparent: true,
    frame: false,
    resizable: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.setPosition(size.width - 250, size.height - 250)

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
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

// AppSync Access ----
console.log('app sync access')
const AWSAppSyncClient = require('aws-appsync').default;
require('es6-promise').polyfill();
require('isomorphic-fetch');
global.WebSocket = require('ws');

// Require exports file with endpoint and auth info
// const aws_exports = require('./aws-exports').default;

// INIT
// Set up AppSync client
// TODO : ベタがきなんとかしたい
const client = new AWSAppSyncClient({
  url: "http://192.168.1.7:20002/graphql",
  region: "ap-northeast-1",
  auth: {
      type: "API_KEY",
      apiKey: "da2-fakeApiId123456"
  }
});

// Import gql helper and craft a GraphQL query
const gql = require('graphql-tag');

// Set up a subscription query
// TODO : Clapが絞り込めていない
// TODO : 初期表示用データを取得する
// TODO : 絵文字もイベント作成時に設定したい＋取得したい
const subquery = gql(`
subscription onClapUpdate {
  clap(id: "34e2a9c5-388b-4919-a60c-05cdf772220d") {
    count
  }
}`);
client.hydrated().then(function (client) {
  const observable = client.subscribe({ query: subquery });
  const realtimeResults = function realtimeResults(data) {
    console.log(data)
    mainWindow.webContents.send(
      "clap", {
        count: data.data.clap.count
      }
    ); 
  };
  observable.subscribe({
    next: realtimeResults,
    complete: console.log,
    error: console.log,
  });
});