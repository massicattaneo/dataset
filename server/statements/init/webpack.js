const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const WebpackMiddleware = require('webpack-dev-middleware');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { InlineManifestPlugin } = require('../../webpack/inline-manifest-plugin');

function getDefaultConfig({ clientDir }) {
    const assetsDir = path.resolve(clientDir, 'assets');
    return {
        entry: {
            main: [path.resolve(clientDir, './index.js')]
        },
        mode: 'development',
        output: {
            path: path.resolve(clientDir, '../server/static'),
            filename: '[name].[hash].js'
        },
        resolveLoader: {
            modules: ['node_modules']
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.xml$/i,
                    use: 'raw-loader'
                }
            ]
        },
        resolve: {
            modules: ['node_modules']
        },
        plugins: [
            new CleanWebpackPlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new CopyWebpackPlugin([
                { from: `${assetsDir}/init/*`, to: `assets/init/[name].[hash].[ext]` }
            ]),
            new InlineManifestPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(clientDir, 'index.html'),
                inject: false,
                filename: 'index.html'
            }),
        ]
    };
}

function getOptions({ clientDir, publicPath }) {
    return {
        publicPath,
        contentBase: path.resolve(clientDir, './webpack-dev'),
        writeToDisk: true,
        watch: true,
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    };
}

module.exports = async function () {
    const config = getDefaultConfig(this.process);
    const compiler = webpack(config);
    WebpackMiddleware(compiler, getOptions(this.process));
    return {};
};
