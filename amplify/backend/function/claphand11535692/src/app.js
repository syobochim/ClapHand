var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const AWS_EXPORTS = require('./aws-exports')
require('isomorphic-fetch');
require('es6-promise').polyfill();
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

const gql = require('graphql-tag');
var initQuery = gql(/* GraphQL */ `
query GetClap($id : ID!) {
  getClap(id: $id) {
    id
    count
    emoji
    event
    owner
  }}
`)

var clapMutation = gql(/* GraphQL */ `
mutation UpdateClap($id: ID!, $count: Int!) {
  updateClap(input: {id: $id, count: $count}) {
    id
    count
    emoji
  }}
`)

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

app.get('/claps', function (req, res) {
  const CLAP_ID = req.query.id
  let clapCount = 0
  client.hydrated().then(function (client) {
    client.query({
      query: initQuery,
      variables: {
        id: CLAP_ID
      }
    }).then(function logData(data) {
      res.json({
        emoji: data.data.getClap.emoji,
        count: data.data.getClap.count,
        owner: data.data.getClap.owner,
        event: data.data.getClap.event
      })
    }).catch(console.error);
  });
});

app.put('/claps', function (req, res) {
  const CLAP_ID = req.query.id
  let clapCount = 0
  client.hydrated().then(function (client) {
    client.query({
      query: initQuery,
      variables: {
        id: CLAP_ID
      }
    }).then(function logData(data) {
      clapCount = data.data.getClap.count + 1
      client.mutate({
        mutation: clapMutation,
        variables: {
            id: CLAP_ID,
            count: clapCount
        }
      })
      .then(function logData(data) {
        res.json({ count: clapCount })
      })
    }).catch(console.error);
  });
});

app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
