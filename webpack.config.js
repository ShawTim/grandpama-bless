const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./js/app.js",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "bundle.min.js",
    clean: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new CopyPlugin({
      patterns: [
        { from: "*.html" },
        { from: "*.png", noErrorOnMissing: true },
        { from: "*.jpg", noErrorOnMissing: true },
        { from: "images", to: "images" }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.(s)*css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  }
};
