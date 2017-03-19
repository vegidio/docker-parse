let express = require('express');
let ParseServer = require('parse-server').ParseServer;
let ParseDashboard = require('parse-dashboard');
let func = require("./functions");

// Loading config file
let fs = require('fs');
let config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

let app = express();
let parseArray = process.env.APP_ID || config.APP_IDS;
let dashboardArray = [];

// Parse Server
parseArray = [].concat(parseArray);
parseArray.forEach(appId =>
{
    dashboardArray.push({
        'serverURL': 'http://localhost:1337/api/' + appId,
        'masterKey': process.env.MASTER_KEY || config.MASTER_KEY,
        'appId': appId,
        'appName': appId
    });

    let api = new ParseServer({
        serverURL: 'http://localhost:1337',
        masterKey: process.env.MASTER_KEY || config.MASTER_KEY,
        appId: process.env.APP_ID || appId,
        databaseURI: func.buildConnectionUrl(process.env, config, appId)
    });

    // Serve the Parse API on the /api URL prefix
    app.use('/api/' + appId, api);
});

// Parse Dashboard
let dashboard = new ParseDashboard({
    'apps': dashboardArray,
    'users': [{
        'user': process.env.DASHBOARD_USERNAME || config.DASHBOARD_USERNAME,
        'pass': process.env.DASHBOARD_PASSWORD || config.DASHBOARD_PASSWORD
    }]
}, true);

app.use('/dashboard/', dashboard);

// Parse Server plays nicely with the rest of your web routes
app.get('/', (req, res) => res.status(200).send('Welcome to Parse Server'));

let port = process.env.PORT || 1337;
app.listen(port, () => console.log('Parse Server is running on port ' + port + '.'));
