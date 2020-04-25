const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const WebpackMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { InlineManifestPlugin } = require('../../webpack/inline-manifest-plugin');
const { STYLE } = require('../../../constants');
const { handlebarsParser } = require('../../../modules/templating');
const { toPixels } = require('../../../modules/templating/formatters');
const requireContext = require('require-context');
const context = requireContext(`../../routes`, true, /\.js/);

function getDefaultConfig({ clientDir, publicPath }) {
    const entry = context.keys().reduce((obj, key) => ({
        ...obj,
        [key.replace('.js', '').replace(/\//g, '-')]: path.resolve(clientDir, 'a/', context.resolve(key))
    }), {});
    const assetsDir = path.resolve(clientDir, 'assets');
    Object.assign(entry, { main: [path.resolve(clientDir, './index.js'), 'webpack-hot-middleware/client?reload=true'] });
    return {
        entry,
        mode: 'development',
        devtool: 'source-map',
        output: {
            path: path.resolve(clientDir, '../server/static'),
            publicPath,
            filename: '[name].[hash].js'
        },
        resolveLoader: {
            modules: ['node_modules']
        },
        module: {
            rules: [
                {
                    test: /routes\/.*.js$/,
                    exclude: [/routes\/index\.js$/],
                    use: [
                        {
                            loader: path.resolve(__dirname, '../../webpack/route-loader.js'),
                            options: {}
                        }
                    ]
                },
                {
                    test: /\.css$/i,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    mode: 'local',
                                    localIdentName: '[hash:base64:5]'
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.xml$/i,
                    use: 'raw-loader'
                },
                {
                    test: /\.html$/i,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {
                                preprocessor: function (content) {
                                    return handlebarsParser(content, { STYLE }, { toPixels });
                                }
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            modules: ['node_modules']
        },
        plugins: [
            // new CleanWebpackPlugin(),
            new CopyWebpackPlugin([
                { from: `${assetsDir}/init/*`, to: `assets/init/[name].[hash].[ext]` },
                { from: `${assetsDir}/sounds/*`, to: `assets/sounds/[name].[hash].[ext]` }
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
