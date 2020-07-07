import * as path from 'path'
import * as webpack from 'webpack'
import * as nodeExternals from 'webpack-node-externals'
import * as CopyPlugin from 'copy-webpack-plugin'

const config: webpack.Configuration = {
    target: 'node',
    mode: 'production',
    entry: {
        parse: './src/parse.ts',
        dashboard: './src/dashboard.ts',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        libraryTarget: 'umd',
        filename: './[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            { test: /\.ts$/, loaders: 'ts-loader' }
        ]
    },
    externals: [
        nodeExternals()
    ],
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'package.json', to: '.' }
            ]
        })
    ]
}

export default config