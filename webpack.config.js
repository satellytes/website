const devMode = process.env.NODE_ENV !== 'production'

const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


console.log('devMode: ', devMode);


module.exports = {
  context: path.resolve(__dirname, 'app'),
  resolve: {
    extensions: ['.ts', '.js', '.json', '.*']
  },
  devServer: {
    compress: true,
    port: 3000,
    inline: true
  },
  entry: {
    main: ['./src/index.ts', './styles/index.scss']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          {
            loader: 'css-hot-loader'
          },
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: devMode
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')],
              sourceMap: devMode
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: devMode
            }
          }
        ]
      },
      // IMAGES
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader?interpolate'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new HtmlWebPackPlugin({
      template: 'index.html'
    }),
    new HtmlWebPackPlugin({
      filename: 'imprint.html',
      template: 'imprint.html'
    }),
    new HtmlWebPackPlugin({
      filename: 'privacy.html',
      template: 'privacy.html'
    })
  ],
  stats: 'normal'
};
