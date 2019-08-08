const express = require('express');
const { default: ParseServer, ParseGraphQLServer } = require('parse-server');
const ParseDashboard = require('parse-dashboard');
const db = require("./database");

let app = express();
let parseArray = process.env.APP_IDS.split(',');
let liveQueryArray = process.env.LIVE_QUERIES.split('|');
let dashboardArray = [];

// Parse Server
parseArray.forEach(appId => {
    dashboardArray.push({
        'serverURL': `${process.env.SERVER_URL}/app/${appId}`,
        'graphQLServerURL': `${process.env.SERVER_URL}/app/${appId}/graphql`,
        'masterKey': process.env.MASTER_KEY,
        'appId': appId,
        'appName': appId
    });

    // Live Query configuration
    let liveQueryClasses = liveQueryArray.reduce((res, value) => {
        let prefix = `${appId}:`;
        if(value.startsWith(prefix)) res = res.concat(value.replace(prefix, '').split(','));
        return res;
    }, []);

    // Server configuration
    const parseServer = new ParseServer({
        serverURL: 'http://0.0.0.0:1337',
        masterKey: process.env.MASTER_KEY,
        appId: appId,
        databaseURI: db.buildConnectionUrl(process.env, appId),
        liveQuery: { classNames: liveQueryClasses }
    });

    // GraphQL configuration
    const parseGraphQLServer = new ParseGraphQLServer(parseServer, {
        graphQLPath: `/app/${appId}/graphql`
    });

    // Serve the Parse apps on the /app URL prefix
    app.use(`/app/${appId}`, parseServer.app);
    parseGraphQLServer.applyGraphQL(app);
});

// Parse Dashboard
let dashboard = new ParseDashboard({
    'apps': dashboardArray,
    'users': [{
        'user': process.env.DASHBOARD_USERNAME,
        'pass': process.env.DASHBOARD_PASSWORD
    }]
}, {
    allowInsecureHTTP: true
});

app.use('/dashboard/', dashboard);

// Parse Server plays nicely with the rest of your web routes
app.get('/', (req, res) => res.status(200).send('Welcome to Parse Server'));

let port = process.env.PORT || 1337;
app.listen(port, () => console.log(`Parse Server is running on port ${port}.`));
