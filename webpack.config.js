const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const minicss = new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: '[name].css',
  chunkFilename: '[id].css'
});

const IS_DEV = process.env.NODE_ENV === 'development';

module.exports = {
  context: path.resolve(__dirname, 'app'),
  devServer: {
    compress: true,
    port: 3000,
    inline: true
  },
  entry: {
    main: ['./src/index.ts', './styles/index.scss']
  },
  resolve: {
    extensions: ['*', '.tsx', '.ts', '.js', '.scss', '.html', '.png']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          // MiniCssExtractPlugin.loader,
          {
            loader: "style-loader",
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: IS_DEV
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')],
              sourceMap: IS_DEV
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: IS_DEV
            }
          }
        ]
      },
      // IMAGES
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      }
    ]
  },
  plugins: [
    minicss,
    new HtmlWebPackPlugin({
      template: 'index.html'
    })
  ],
  stats: 'normal'
};
