var webpack = require('webpack');
var path = require('path');
var env = process.env.WEBPACK_ENV;

var BUILD_DIR = path.resolve(__dirname, 'static');
var APP_DIR = path.resolve(__dirname, 'static/components');
var config = {
  entry: APP_DIR + '/Main.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  resolve : {
  	root : [
  		APP_DIR
  	],
    extensions: ['', '.js', '.jsx']
  },
  target : 'node',
  plugins: [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"'
    }),
    new webpack.DefinePlugin({
        'process.env': {
  	    'NODE_ENV': '"development"'
        }
    })
  ],
};

module.exports = config;
