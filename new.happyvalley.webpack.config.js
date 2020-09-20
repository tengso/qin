const path = require('path');

module.exports = {
  entry: [
    './built/examples/happyvalley/ActionSender.js',
  ],
  mode: 'development',
  output: {
    filename: 'new_happyvalley_main.js',
    path: path.resolve(__dirname, 'dist'),
  }
}