const path = require('path');

module.exports = {
  entry: [
    './built/examples/team/Core.js',
    './built/examples/team/Model.js',
    './built/examples/team/View.js',
    './built/examples/team/Control.js',
  ],
  mode: 'development',
  output: {
    filename: 'kanban_main.js',
    path: path.resolve(__dirname, 'dist'),
  }
}