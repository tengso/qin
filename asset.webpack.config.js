const path = require('path');

module.exports = {
  entry: [
    './built/examples/AssetLoader.js',
  ],
  mode: 'development',
  output: {
    filename: 'asset_main.js',
    path: path.resolve(__dirname, 'dist'),
  }
}