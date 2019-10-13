const path = require('path');
let webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './src/app.ts',
    devtool: false,
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: [
            '.ts', '.js'
        ]
    }
};