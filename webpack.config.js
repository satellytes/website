const devMode = process.env.NODE_ENV !== 'production'

const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let devPlugins = [
  new BundleAnalyzerPlugin()
]

let prodPlugins = [
  new OptimizeCssAssetsPlugin({
    cssProcessor: require('cssnano'),
    cssProcessorOptions: { discardComments: { removeAll: true } },
    canPrint: true
  })
]

if(devMode === true){
  prodPlugins.length = 0;
} else {
  devPlugins.length = 0;
}

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
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
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
        test: /\.(jpe?g|png|gif|svg|woff|woff2)$/,
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
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    new CopyWebpackPlugin([ 'generated/sitemap.xml' ], {}),
    ...prodPlugins,
    ...devPlugins
  ],
  stats: 'normal'
};
