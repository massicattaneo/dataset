const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const WebpackMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require("webpack-hot-middleware");
const HtmlWebpackPlugin = require('html-webpack-plugin');

function getDefaultConfig({ clientDir }) {
    return {
        entry: {
            main: [path.resolve(clientDir, './index.js'), 'webpack-hot-middleware/client']
        },
        mode: 'development',
        output: {
            path: path.resolve(clientDir, './webpack-dev'),
            filename: '[name].js'
        },
        resolveLoader: {
            modules: ['node_modules']
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader']
                }
            ]
        },
        resolve: {
            modules: ['node_modules']
        },
        plugins: [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new CopyWebpackPlugin([
                { from: path.resolve(clientDir, 'assets/'), to: `assets` }
            ]),
            new HtmlWebpackPlugin({
                template: path.resolve(clientDir, 'index.html'),
                inject: true,
                filename: 'index.html',
                chunks: ['main']
            })
        ]
    };
}

function getOptions({ clientDir, publicPath }) {
    return {
        publicPath,
        contentBase: path.resolve(clientDir, './webpack-dev'),
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
    const webPackMiddleware = WebpackMiddleware(compiler, getOptions(this.process));
    this.app.use(webPackMiddleware);
    this.app.use(WebpackHotMiddleware(compiler));
    return {};
};
