const path = require('path');

module.exports = {
  entry: './built/examples/Kanban.js',
  mode: 'development',
  output: {
    filename: 'kanban_main.js',
    path: path.resolve(__dirname, 'dist'),
  }
}