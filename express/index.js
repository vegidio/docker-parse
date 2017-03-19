var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');

// Loading config file
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var app = express();
var parseArray = process.env.APP_ID || config.APP_IDS;
var dashboardArray = [];

// Parse Server
parseArray.forEach(appId => {
    dashboardArray.push({
        'serverURL': 'http://localhost:1337/api/' + appId,
        'masterKey': MASTER_KEY,
        'appId': appId,
        'appName': appId
    });

    var api = new ParseServer({
        serverURL: 'http://localhost:1337',
        masterKey: process.env.MASTER_KEY || config.MASTER_KEY,
        appId: process.env.APP_ID || appId,
        databaseURI: process.env.DB_HOST || 'mongodb://' + config.DB_USERNAME + ':' + config.DB_PASSWORD + '@' +
            config.DB_HOST + '/' + appId + '?authSource=admin',
    });

    // Serve the Parse API on the /parse URL prefix
    app.use('/api/' + appId, api);
});

// Parse Dashboard
var dashboard = new ParseDashboard({
    'apps': dashboardArray
}, true);

app.use('/dashboard/', dashboard);

// Parse Server plays nicely with the rest of your web routes
app.get('/', (req, res) => res.status(200).send('Welcome to Parse Server'));

var port = process.env.PORT || 1337;
app.listen(port, () => console.log('Parse Server is running on port ' + port + '.'));
