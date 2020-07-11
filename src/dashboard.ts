import * as fs from 'fs'
import * as express from 'express'
import * as ParseDashboard from 'parse-dashboard'
import * as jdenticon from 'jdenticon'
import { createProxyMiddleware } from 'http-proxy-middleware'
import logger from './logger'

const app = express()
const parseArray = process.env.APP_IDS ? process.env.APP_IDS.split(',') : []
const apps: unknown[] = []

// Initial port number
let appPort = 9000

parseArray.forEach(appId => {
    // Calculate the port for each app
    appPort += 1

    apps.push({
        appId: appId,
        appName: appId,
        iconName: `${appId}.svg`,
        serverURL: `${process.env.SERVER_URL}/app/${appId}`,
        graphQLServerURL: `${process.env.SERVER_URL}/app/${appId}/graphql`,
        masterKey: process.env.MASTER_KEY,
    })

    // Creating app icon
    const icon = jdenticon.toSvg(appId, 56)
    const iconFolder = 'icons'
    if(!fs.existsSync(iconFolder)) fs.mkdirSync(iconFolder)
    fs.writeFileSync(`${iconFolder}/${appId}.svg`, icon)

    // Create friendly path to the app, without the port
    app.use(`/app/${appId}`, createProxyMiddleware({
        target: `http://0.0.0.0:${appPort}`,
        pathRewrite: { [`^/app/${appId}`]: '' },
        changeOrigin: true,
        logLevel: 'silent'
    }))
})

// Dashboard configuration
const dashboard = new ParseDashboard({
    apps: apps,
    iconsFolder: 'icons',
    users: [{ 'user': process.env.DASHBOARD_USERNAME, 'pass': process.env.DASHBOARD_PASSWORD }]
}, {
    allowInsecureHTTP: true
})

app.use('/dashboard', dashboard)

// Parse Server plays nicely with the rest of your web routes
app.get('/', (req, res) => res.status(200).send(`Welcome to the Parse Server, v${process.env.IMAGE_VERSION}`))

// Starting server
app.listen(80, () => logger.info('🤖 Parse Dashboard is running…'))