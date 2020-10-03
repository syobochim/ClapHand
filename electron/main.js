// Modules to control application life and create native browser window
const electron = require('electron');
const app = electron.app;
const path = require('path')
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
  // Create the browser window.
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

function updateClapCount(count) {
  mainWindow.webContents.send(
    "clap", {
    count: count
  });
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

// Set up AppSync client
const AWS_EXPORTS = require('./aws-exports');
const client = new AWSAppSyncClient({
  url: AWS_EXPORTS.aws_appsync_graphqlEndpoint,
  region: AWS_EXPORTS.region,
  auth: {
    type: AWS_EXPORTS.aws_appsync_authenticationType,
    apiKey: AWS_EXPORTS.aws_appsync_apiKey
  },
  fetchPolicy: 'network-only',
  disableOffline: true
});

// Import gql helper and craft a GraphQL query
const gql = require('graphql-tag');

const CLAP_ID = "ab697096-eff7-4b9c-8ab8-0e62140b3d95"

// TODO : IDをツールバーで入力させる
// 初期表示用データを取得する
const initQuery = gql(/* GraphQL */ `
query GetClap($id : ID!) {
  getClap(id: $id) {
    id
    count
  }
}
`)

// Set up a subscription query
// TODO : 絵文字もイベント作成時に設定したい＋取得したい
const subquery = gql(/* GraphQL */ `
subscription OnUpdateClap($id: ID) {
  onUpdateClap(id: $id) {
    id
    count
  }}
  `);

client.hydrated().then(function (client) {
  client.query({
    query: initQuery,
    variables: {
      id: CLAP_ID
    }
  }).then(function logData(data) {
    updateClapCount(data.data.getClap.count)
  }).catch(console.error);

  const observable = client.subscribe({
    query: subquery,
    variables: {
      id: CLAP_ID
    }
  });

  const realtimeResults = function realtimeResults(data) {
    updateClapCount(data.data.onUpdateClap.count)
  };

  observable.subscribe({
    next: realtimeResults,
    complete: console.log,
    error: console.error,
  });
});