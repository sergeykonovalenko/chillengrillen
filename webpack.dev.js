const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

// Get local IP address in Node.js
let os = require('os');
let ifaces = os.networkInterfaces();
let localIpAddress;

Object.keys(ifaces).forEach(function (ifname) {
    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            return;
        }
        localIpAddress = iface.address;
    });
});

module.exports = (env, argv) => {

    return merge(common(argv.mode), {
        devtool: 'inline-source-map',
        // devtool: 'inline-cheap-module-source-map',
        devServer: {
            contentBase: './dist',
            overlay: {
                warnings: true,
                errors: true
            },
            host: localIpAddress,
            port: 8081,
            hot: true,
            writeToDisk: true,
        },
        watchOptions: {
            aggregateTimeout: 100,
        },
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: true,
                                reloadAll: true,
                            },
                        },
                        // 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                url: false,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    indentWidth: 4,
                                    outputStyle: 'compressed',
                                    // outputStyle: 'expanded',
                                },
                                sourceMap: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/i,
                    use: [
                        // 'style-loader',
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: true,
                                reloadAll: true,
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                url: false,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                            }
                        },
                    ],
                }
            ],
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new MiniCssExtractPlugin({
                // filename: 'css/[name].css',
                filename: 'style.css',
            }),
            // new webpack.SourceMapDevToolPlugin({
            //     filename: "[file].map"
            // }),
        ],
    });
};
