const path = require('path');

module.exports = {
  entry: [
    './built/HappyValley.js',
  ],
  mode: 'development',
  output: {
    filename: 'happyvalley_main.js',
    path: path.resolve(__dirname, 'dist'),
  }
}