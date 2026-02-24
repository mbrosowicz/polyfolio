// webpack.config.js - Alternativa ao Vite
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.jsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      publicPath: '/',
    },
    devServer: {
      port: 3000,
      open: true,
      hot: true,
      compress: true,
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
            },
          },
        },
        {
          test: /\.glsl$/,
          loader: 'raw-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@shaders': path.resolve(__dirname, './src/shaders'),
        '@components': path.resolve(__dirname, './src/components'),
        '@utils': path.resolve(__dirname, './src/utils'),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
            }
          : false,
      }),
    ],
    optimization: isProduction
      ? {
          minimize: true,
          minimizer: [new TerserPlugin()],
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                priority: 10,
              },
              three: {
                test: /[\\/]node_modules[\\/]three/,
                name: 'three',
                priority: 20,
                reuseExistingChunk: true,
                enforce: true,
              },
            },
          },
        }
      : {},
    devtool: isProduction ? false : 'source-map',
    performance: {
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  };
};
