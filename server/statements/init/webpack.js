const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const WebpackMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { InlineManifestPlugin } = require('../../webpack/inline-manifest-plugin');
const { STYLE } = require('../../../core/constants');
const { jsToSass } = require('../../webpack/js-to-sass-variables');

function getDefaultConfig({ clientDir }) {
    const assetsDir = path.resolve(clientDir, 'assets');
    return {
        entry: {
            main: [path.resolve(clientDir, './index.js'), 'webpack-hot-middleware/client']
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
                    test: /\.s[ac]ss$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                prependData: jsToSass(STYLE),
                            },
                        }
                    ]
                },
                {
                    test: /\.xml$/i,
                    use: 'raw-loader'
                },
                {
                    test: /\.html$/i,
                    use: 'raw-loader'
                }
            ]
        },
        resolve: {
            modules: ['node_modules']
        },
        plugins: [
            // new CleanWebpackPlugin(),
            new CopyWebpackPlugin([
                { from: `${assetsDir}/init/*`, to: `assets/init/[name].[hash].[ext]` }
            ]),
            new webpack.HotModuleReplacementPlugin(),
            new InlineManifestPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(clientDir, 'index.html'),
                inject: false,
                filename: 'index.html'
            })
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
    this.app.use(WebpackHotMiddleware(compiler));
    return {};
};
