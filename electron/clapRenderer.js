// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
global.WebSocket = require('ws');
require('es6-promise').polyfill();
require('isomorphic-fetch');


// Set up AppSync client
const AWS_EXPORTS = require('./aws-exports');
const AWSAppSyncClient = require('aws-appsync').default;
const client = new AWSAppSyncClient({
  url: AWS_EXPORTS.aws_appsync_graphqlEndpoint,
  region: AWS_EXPORTS.aws_appsync_region,
  auth: {
    type: AWS_EXPORTS.aws_appsync_authenticationType,
    apiKey: AWS_EXPORTS.aws_appsync_apiKey
  },
  fetchPolicy: 'network-only',
  disableOffline: true
});

let clapId = "ab697096-eff7-4b9c-8ab8-0e62140b3d95"

// 初期表示用データを取得する
const gql = require('graphql-tag');
const initQuery = gql(/* GraphQL */ `
query GetClap($id : ID!) {
  getClap(id: $id) {
    id
    count
    emoji
  }}
`)

// Set up a subscription query
const subquery = gql(/* GraphQL */ `
subscription OnUpdateClap($id: ID) {
  onUpdateClap(id: $id) {
    id
    count
    emoji
  }}
  `);

client.hydrated().then(function (client) {
  client.query({
    query: initQuery,
    variables: {
      id: clapId
    }
  }).then(function logData(data) {
    document.getElementById('emoji').textContent = data.data.getClap.emoji
    document.getElementById('count').textContent = data.data.getClap.count
  }).catch(console.error);

  const observable = client.subscribe({
    query: subquery,
    variables: {
      id: clapId
    }
  });

  const realtimeResults = function realtimeResults(data) {
    document.getElementById('count').textContent = data.data.getClap.count
  };
  observable.subscribe({
    next: realtimeResults,
    complete: console.log,
    error: console.error,
  });
});