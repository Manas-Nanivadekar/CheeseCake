const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production", // Change to production to avoid eval
  devtool: "source-map", // Use source-map instead of eval
  entry: {
    background: "./src/background.ts",
    popup: "./src/popup.ts",
    blocked: "./src/blocked.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public" }],
    }),
  ],
  optimization: {
    minimize: false, // This helps with debugging
  },
};
