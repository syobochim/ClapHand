/* Amplify Params - DO NOT EDIT
    API_CLAPGQL_GRAPHQLAPIENDPOINTOUTPUT
    API_CLAPGQL_GRAPHQLAPIIDOUTPUT
    API_CLAPGQL_GRAPHQLAPIKEYOUTPUT
    ENV
    REGION
Amplify Params - DO NOT EDIT */

require('isomorphic-fetch');
const AWSAppSyncClient = require('aws-appsync').default;
const gql = require('graphql-tag');

const client = new AWSAppSyncClient({
    url: process.env['API_CLAPGQL_GRAPHQLAPIENDPOINTOUTPUT'],
    region: process.env['REGION'],
    auth: {
        type: "API_KEY",
        apiKey: process.env['API_CLAPGQL_GRAPHQLAPIKEYOUTPUT']
    },
    fetchPolicy: 'network-only',
    disableOffline: true
});

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

const clapMutation = gql(/* GraphQL */ `
mutation UpdateClapCount($id: ID!) {
    updateClapCount(id: $id) {
      id
      count
    }
  }
`)

exports.handler = async (event) => {
    let result
    const CLAP_ID = event.queryStringParameters.id
    if (event.httpMethod === 'GET') {
        const data = await client.query({
            query: initQuery,
            variables: {
                id: CLAP_ID
            }
        })
        console.log(JSON.stringify(data))
        result = {
            emoji: data.data.getClap.emoji,
            count: data.data.getClap.count,
            owner: data.data.getClap.owner,
            event: data.data.getClap.event
        }
    } else if (event.httpMethod === 'PUT') {
        const data = await client.mutate({
            mutation: clapMutation,
            variables: {
                id: CLAP_ID
            }
        })
        console.log(JSON.stringify(data))
        result = {
            count: data.data.updateClapCount.count
        }

    } else {
        throw new Error(`getMethod only accept GET or PUT method, you tried: ${event.httpMethod}`);
    }

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT,POST,GET"
        },
        body: JSON.stringify(result)
    }
    return response;
};