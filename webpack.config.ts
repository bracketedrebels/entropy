import path from "path";
import webpack from "webpack";
import Dotenv from "dotenv-webpack";
import fs from "fs";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

module.exports = ({ environment = "dev" }: any) => {
  const basePath = `${path.join(__dirname)}${path.sep}.env`;
  const envPath = `${basePath}.${environment}`;
  const finalPath = fs.existsSync(envPath) ? envPath : basePath;

  return {
    entry: ["react-hot-loader/patch", "./src/index.tsx"],
    devServer: {
      historyApiFallback: true,
    },
    output: {
      filename: "bundle.js",
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      new Dotenv({
        path: finalPath,
        allowEmptyValues: true,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: {
            loader: "worker-loader",
          },
        },
        {
          test: /\.ts(x)?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/react",
                "@babel/typescript",
                ["@babel/env", { modules: false }],
              ],
              plugins: [
                "relay",
                "const-enum",
                [
                  "@babel/plugin-transform-typescript",
                  { allowNamespaces: true },
                ],
              ],
            },
          },
        },
        {
          test: /\.js$/,
          use: ["source-map-loader"],
          enforce: "pre",
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "react-dom": "@hot-loader/react-dom",
      },
    },
  } as webpack.Configuration;
};
