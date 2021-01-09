import { Dictionary } from "ramda";
import path from "path";
import webpack, { DefinePlugin } from "webpack";
import dotenv from "dotenv";
import fs from "fs";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { entries } from "lodash";

module.exports = (env: any) => {
  const normalizedURL = path.normalize(env.baseurl);
  console.log(buildEnvironment(env));
  return {
    entry: ["react-hot-loader/patch", "./src/index.tsx"],
    devServer: {
      historyApiFallback: true,
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
      publicPath: normalizedURL,
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      new DefinePlugin(buildEnvironment(env)),
      new HtmlWebpackPlugin({
        appMountId: "app",
        filename: "index.html",
        title: "Entropy",
        template: "src/index.ejs",
        scriptLoading: "defer",
        templateParameters: {
          baseurl: normalizedURL,
        },
      }),
      new HtmlWebpackPlugin({
        appMountId: "app",
        filename: "404.html",
        title: "Entropy",
        template: "src/index.ejs",
        scriptLoading: "defer",
        templateParameters: {
          baseurl: normalizedURL,
        },
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: "static", to: "static" }],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
              },
            },
            "postcss-loader",
          ],
        },
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

const buildEnvironment = (env: any) => {
  const basePath = `${path.join(__dirname)}${path.sep}.env`;
  const envPath = `${basePath}.${env.environment}`;
  const finalPath = fs.existsSync(envPath) ? envPath : basePath;
  const fileEnv = dotenv.config({ path: finalPath }).parsed;

  return entries(fileEnv).reduce(
    (acc, [key, v]) => ({
      ...acc,
      [`process.env.${key}`]: v,
    }),
    {
      "process.env.ROUTING_BASENAME": `'/${path.basename(env.baseurl)}'`,
    }
  ) as Dictionary<any>;
};
