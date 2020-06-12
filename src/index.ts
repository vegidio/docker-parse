import * as express from 'express';
import ParseServer, { ParseGraphQLServer } from 'parse-server';
import * as ParseDashboard from 'parse-dashboard';
import db from './database';

const app = express();
const parseArray = process.env.APP_IDS ? process.env.APP_IDS.split(',') : [];
const liveQueryArray = process.env.LIVE_QUERIES ? process.env.LIVE_QUERIES.split('|') : [];
const dashboardArray: unknown[] = [];

// Parse Server
parseArray.forEach(appId => {
    dashboardArray.push({
        'serverURL': `${process.env.SERVER_URL}/app/${appId}`,
        'publicServerURL': process.env.SERVER_URL,
        'graphQLServerURL': `${process.env.SERVER_URL}/app/${appId}/graphql`,
        'masterKey': process.env.MASTER_KEY,
        'appId': appId,
        'appName': appId
    });

    // Live Query configuration
    const liveQueryClasses = liveQueryArray.reduce((res, value) => {
        const prefix = `${appId}:`;
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
const dashboard = new ParseDashboard({
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
app.get('/', (req, res) => res.status(200).send('Welcome to the Parse Server'));

const port = process.env.PORT || 1337;
app.listen(port, () => console.log(`Parse Server is running on port ${port}.`));