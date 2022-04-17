/**
 * 必须是有效的 node 代码
 */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/main.js",
    a: "./src/a.js",
  },
  output: {
    filename: "scripts/bundle-[name].[chunkhash:5].js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.(png|jpeg|jpg)$/i,
        use: [{ loader: "file-loader" }],
      },
    ],
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.css/,
  //       use: [
  //         {
  //           loader: "./src/loader/css_loader.js",
  //         },
  //       ],
  //     },
  //     {
  //       test: /\.*/,
  //       use: [
  //         {
  //           loader: "./src/loader/url-loader.js",
  //         },
  //       ],
  //     },
  //   ],
  // },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/public/public.html",
      chunks: ["main"],
      filename: "bundle.html",
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
    }),
  ],
  devServer: {
    stats: {
      modules: false,
      colors: true,
    },
    open: true,
    openPage: "bundle.html",
  },
};
