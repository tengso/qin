const path = require('path');

module.exports = {
    entry: [
        './built/examples/happyvalley/PlaceOrder.js',
    ],
    mode: 'development',
    output: {
        filename: 'place_order_main.js',
        path: path.resolve(__dirname, 'dist'),
    }
}