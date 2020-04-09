const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {

    return merge(common(argv.mode), {
        module: {
            rules: [
                {
                    test: /\.js$/i,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-transform-runtime'],
                        }
                    }
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                url: false
                            },
                        },
                        'postcss-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    // indentWidth: 4,
                                    // outputStyle: 'expanded',
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                esModule: true,
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                url: false
                            },
                        },
                        'postcss-loader',
                    ],
                }
            ],
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    parallel: true,
                    // chunkFilter: chunk => false,
                }),
                new OptimizeCSSAssetsPlugin({}),
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                // filename: 'css/[name][hash].css',
                filename: 'style.css',
            }),
            // new BundleAnalyzerPlugin(),
        ],
    });
};
