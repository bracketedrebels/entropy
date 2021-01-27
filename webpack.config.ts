import path, { sep } from "path";
import { append, concat, identity } from "ramda";

import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import postcss from "postcss";
import handlebars from "handlebars";

import { Configuration } from "webpack";
import { DefinePlugin } from "webpack";

/* helpers definitions */

const rule = (
  v: (
    env: Environment
  ) => (
    acc: Required<Required<Configuration>["module"]>["rules"]
  ) => Required<Required<Configuration>["module"]>["rules"]
) => (env: Environment, conf: Configuration) =>
  ({
    ...conf,
    module: {
      ...(conf.module || {}),
      rules: v(env)(conf.module?.rules || []),
    },
  } as Configuration);

const config = (
  ...args: Array<
    (env: Required<Environment>, config: Configuration) => Configuration
  >
) => ({
  environment = "dev",
  output = "dist",
  basename = "/",
  bundlename = "bundle.js",
}: Environment) =>
  args.reduce(
    (acc, v) =>
      v(
        {
          environment,
          output: path.resolve(__dirname, output),
          basename,
          bundlename,
        },
        acc
      ),
    {
      entry: ["./src/index.tsx"],
      devServer: {
        historyApiFallback: true,
        compress: true,
        hot: true,
      },
      optimization: {
        usedExports: environment !== "dev",
        minimize: environment !== "dev",
      },
      output: {
        path: path.resolve(__dirname, output),
        filename: bundlename,
      },
      resolve: {
        extensions: [".js", ".ts", ".tsx"],
      },
    } as Configuration
  );

const plugin = (
  v: (
    env: Required<Environment>
  ) => (
    conf: Required<Configuration>["plugins"]
  ) => Required<Configuration>["plugins"]
) => (env: Required<Environment>, conf: Configuration) =>
  ({
    ...conf,
    plugins: v(env)(conf.plugins || []),
  } as Configuration);

const forceTypeChecking = () => () => append(new ForkTsCheckerWebpackPlugin());
const defineRuntimeEnvironment = () => ({
  basename,
}: Required<Environment>) => {
  return append(
    new DefinePlugin({
      process: {
        env: {
          ROUTING_BASENAME: JSON.stringify(basename),
          URL_API_GRAPHQL_GITHUB: JSON.stringify(
            "https://api.github.com/graphql"
          ),
        },
      },
    })
  );
};

const enableHMRForDevelopment = () => ({ environment }: Environment) =>
  environment === "prod" ? identity : append(new ReactRefreshWebpackPlugin());

const workerLoader = () => () =>
  append({
    test: /\.worker\.js$/,
    use: {
      loader: require.resolve("worker-loader"),
    },
  });

const tsxLoader = () => (env: Environment) =>
  append({
    test: /\.ts(x)?$/,
    exclude: /node_modules/,
    use: {
      loader: require.resolve("babel-loader"),
      options: {
        presets: [
          "@babel/react",
          "@babel/typescript",
          ["@babel/env", { modules: false }],
        ],
        plugins: [
          "relay",
          "const-enum",
          ["@babel/plugin-transform-typescript", { allowNamespaces: true }],
          ...(env.environment === "dev"
            ? [require.resolve("react-refresh/babel")]
            : []),
        ],
      },
    },
  });

const jsLoader = () => () =>
  append({
    test: /\.js$/,
    use: {
      loader: require.resolve("source-map-loader"),
    },
    enforce: "pre" as const,
  });

/**
 * @todo
 */
const prepareAllTheStaticResources = () => ({
  output,
  environment,
  basename,
  bundlename,
}: Environment) =>
  concat([
    new CopyPlugin({
      patterns: [
        {
          from: "static/index.css",
          to: `${output}${sep}index.css`,
          transform: {
            transformer(content: Buffer) {
              return postcss([
                require("postcss-import"),
                require("tailwindcss"),
                require("autoprefixer"),
                ...(environment === "prod"
                  ? [
                      require("@fullhuman/postcss-purgecss")({
                        content: ["./src/**/*.tsx", "./static/**/*.html"],
                      }),
                    ]
                  : []),
              ])
                .process(content, {
                  from: "static/index.css",
                  to: `${output}${sep}index.css`,
                })
                .then((v) => v.css);
            },
            cache: true,
          } as any,
        },
        {
          from: "static/index.html",
          to: `${output}${sep}index.html`,
          transform: (content) =>
            handlebars.compile(content.toString())({ basename, bundlename }),
        },
        { from: "static", to: output },
      ],
    }),
  ]);

type Environment = {
  environment?: "dev" | "prod";
  output?: string;
  bundlename?: string;
  basename?: string;
};

/* actual configuration */

module.exports = config(
  plugin(forceTypeChecking()),
  plugin(defineRuntimeEnvironment()),
  plugin(enableHMRForDevelopment()),
  plugin(prepareAllTheStaticResources()),
  rule(tsxLoader()),
  rule(workerLoader()),
  rule(jsLoader())
);
