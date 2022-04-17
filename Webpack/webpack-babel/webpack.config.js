const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssWebpackPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    main: "./src/index.js",
    page: "./src/page1/index.js",
  },
  output: {
    filename: "[name].[chunkhash:5].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      chunks: ["main"],
    }),
    // new HTMLWebpackPlugin({
    //   chunks: ["page"],
    // }),
  ],
  stats: {
    colors: true,
    modules: false,
    chunks: true,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      //   maxSize:60000
      automaticNameDelimiter: ".",
      minSize: 300,
    },
    minimizer: [new TerserPlugin(), new OptimizeCssWebpackPlugin()],
  },
};
