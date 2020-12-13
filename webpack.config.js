var webpack = require('webpack');

module.exports = {
  entry: './app/app.jsx',
  output: {
    path: __dirname + '/build',
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react'],
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map',
  devServer: {
    port: 8080,
    historyApiFallback: {
      index: 'index.html'
    },
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
};
