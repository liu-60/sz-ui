const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = (_env, argv) => {
  const isProduction = argv.mode === 'production' || process.env.NODE_ENV === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(__dirname, 'docs/main.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist-docs'),
      filename: isProduction ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js',
      assetModuleFilename: 'assets/[name].[hash:8][ext][query]',
      clean: true,
      publicPath: '/'
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
              transpileOnly: true
            }
          },
          exclude: /node_modules/
        },
        {
          test: /\.css$/i,
          use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpg|jpeg|gif|webp|svg)$/i,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        title: 'SZ UI'
      }),
      new MiniCssExtractPlugin({
        filename: 'assets/[name].[contenthash:8].css'
      })
    ]
  };
};
