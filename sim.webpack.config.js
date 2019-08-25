const path = require('path');

module.exports = {
  entry: [
    './built/examples/ClientSim.js',
  ],
  mode: 'development',
  output: {
    filename: 'sim_main.js',
    path: path.resolve(__dirname, 'dist'),
  }
}