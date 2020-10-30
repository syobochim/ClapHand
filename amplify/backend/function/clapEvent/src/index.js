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

const eventQuery = gql(/* GraphQL */ `
query ListClapsSortedByEvent($event: String) {
    listClapsSortedByEvent(event: $event) {
      items {
        owner
        event
        count
        emoji
    }}}
`)

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
    }
    eventName = event.queryStringParameters.eventName
    const result = await client.query({
        query: eventQuery,
        variables: {
            event: eventName
        }
    });

    console.log(JSON.stringify(result));
    const response = {
        statusCode: 200,
        body: JSON.stringify(result)
    }
    return response;
};