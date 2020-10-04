// 要素を取得
const button = document.getElementById("enter");
// 最初は設定画面非表示
document.getElementById("setting").style.display = "none"

// Set up AppSync client
const AWSAppSyncClient = window.AWSAppSyncClient
const client = new AWSAppSyncClient({
    url: window.AWS_EXPORTS.aws_appsync_graphqlEndpoint,
    region: window.AWS_EXPORTS.aws_appsync_region,
    auth: {
        type: window.AWS_EXPORTS.aws_appsync_authenticationType,
        apiKey: window.AWS_EXPORTS.aws_appsync_apiKey
    },
    fetchPolicy: 'network-only',
    disableOffline: true
});

const createMutation = window.gql(/* GraphQL */ `
    mutation CreateClap($input: CreateClapInput!) {
        createClap(input: $input) {
            id
            emoji
            count
        }}
`)

let emoji = "👏";
let eventCode = null;

function createEvent() {
    const timestamp = new Date().getTime()
    const inputClap = { emoji: emoji, timestamp: timestamp, count: 0, type: "Clap" };

    client.hydrated().then(function (client) {
        client.mutate({
            mutation: createMutation,
            variables: {
                input: inputClap
            }
        }).then(function logData(data) {
            eventCode = data.data.createClap.id
            document.getElementById('eventId').textContent = eventCode
            document.getElementById('url').textContent = data.data.createClap.url
            window.ipcRenderer.invoke('eventCode', eventCode)
        }).catch(console.error);
    });
}

async function clickEvent() {
    if (document.getElementById("emoji").value != "") {
        emoji = document.getElementById("emoji").value
    }
    createEvent()
    document.getElementById("input").style.display = "none"
    document.getElementById("setting").style.display = "flex"
};

//addEventListenerで登録
button.addEventListener("click", clickEvent);