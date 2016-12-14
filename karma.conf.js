var webpackConfig = require('./webpack.config');
webpackConfig.devtool = 'inline-source-map';
module.exports = function (config) {
  config.set({
    browsers: [ 'Chrome' ],
    files: [
      'tests.bundle.js'
    ],
    frameworks: [ 'mocha', 'sinon', 'expect' ],
    plugins: [
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-spec-reporter',
      'karma-expect',
      'karma-sinon',
      webpackConfig.plugins
    ],
    preprocessors: {
      'tests.bundle.js': [ 'webpack', 'sourcemap' ]
    },
    externals : webpackConfig.externals,
    reporters: [ 'spec' ],
    singleRun: true,
    specReporter: {
      maxLogLines: 5000,         // limit number of lines logged per test
      suppressErrorSummary: true,  // do not print error summary
      suppressFailed: false,  // do not print information about failed tests
      suppressPassed: false,  // do not print information about passed tests
      suppressSkipped: true,  // do not print information about skipped tests
      showSpecTiming: false // print the time elapsed for each spec
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    }
  });
};