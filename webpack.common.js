const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const PAGES = fs
    .readdirSync('./src')
    .filter(fileName => fileName.endsWith('.html'));

module.exports = mode => {
    const PRODUCTION = mode === 'production';

    return {
        entry: {
            app: './src/index.js',
        },
        output: {
            filename: 'js/[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
        },
        module: {
            rules: [
                // {
                //     test: /\.(png|jpe?g|gif|svg)$/i,
                //     use: [
                //         {
                //             loader: 'file-loader',
                //             options: {
                //                 name: 'img/[path][name].[ext]',
                //                 outputPath: 'img',
                //             },
                //         },
                //     ],
                // },
                // {
                //     test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                //     loader: "file-loader",
                //     options: {
                //         name: "[name].[ext]"
                //     }
                // },
            ],
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /node_modules/,
                        name: 'vendors',
                        chunks: 'all',
                        enforce: true,
                    }
                },
            },
            // runtimeChunk: true
        },
        plugins: [
            new CleanWebpackPlugin(),
            ...PAGES.map(
                page =>
                    new HtmlWebpackPlugin({
                        template: `./src/${page}`,
                        filename: `./${page}`,
                        inject: false,
                    })
            ),
            new webpack.DefinePlugin({
                PRODUCTION: PRODUCTION,
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            }),
            new CopyPlugin([
                {from: 'img/**/*'},
                {from: 'fonts/**/*'},
            ],
                {
                    context: 'src',
                    force: true,
                    // copyUnmodified: true,
                }
            ),
        ],
    }
};
