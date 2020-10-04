const path = require('path');

module.exports = {
  entry: [
    './built/examples/happyvalley/Dashboard.js',
  ],
  mode: 'development',
  output: {
    filename: 'happy_valley_dashboard.js',
    path: path.resolve(__dirname, 'dist'),
  }
}