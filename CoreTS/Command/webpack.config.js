const path = require('path');
let webpack = require('webpack');
const target = "update_music_table";

module.exports = {
    mode: 'production',
    entry: './src/' + target + '.ts',
    devtool: false,
    output: {
        filename: target + '.js',
        path: path.join(__dirname, 'build')
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