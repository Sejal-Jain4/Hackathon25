const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.devServer = {
        ...webpackConfig.devServer,
        allowedHosts: 'all'
      };
      return webpackConfig;
    }
  }
};