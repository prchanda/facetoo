const path = require("path");
const webpack = require("webpack");
const PORT = 8081;

const libraryName = "Facetoo";
function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function(compiler) {
  compiler.plugin("done", function() {
    const dts = require("dts-bundle");

    dts.bundle({
      name: libraryName,
      main: "dist/src/ts/main/Entry.d.ts",
      out: "../index.d.ts",
      baseDir: "dist",
      removeSource: true,
      outputAsModuleFolder: true // to use npm in-package typings
    });
  });
};

const PATHS = {
  root: path.resolve(__dirname),
  nodeModules: path.resolve(__dirname, "node_modules"),
  src: path.resolve(__dirname, "src"),
  dist: path.resolve(__dirname, "dist")
};

const DEV_SERVER = {
  hot: true,
  hotOnly: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
  },
  historyApiFallback: true,
  overlay: true,
  contentBase: PATHS.root,
  inline: true,
  // quiet: true,
  open: true,
  port: PORT
};

module.exports = (env = {}) => {
  console.log({ env });
  const isAnalyze = !!env.analyze;
  const isBuild = !!env.build;
  const isDev = !env.build;
  const isSourceMap = !!env.sourceMap || isDev;
  const isDashboard = !!env.dashboard;
  console.log({ isDev, isBuild, isSourceMap, isAnalyze, isDashboard });
  return {
    cache: true,
    target: "web",
    devtool: isSourceMap ? "inline-source-map" : "none",
    devServer: DEV_SERVER,
    context: PATHS.root,
    entry: {
      facetoo: path.join(PATHS.src, "ts/main/Entry.ts"),
      "facetoo.min": path.join(PATHS.src, "ts/main/Entry.ts"),
    },
    output: {
      path: PATHS.dist,
      filename: "[name].js",
      library: "Facetoo",
      libraryTarget: "umd",
      pathinfo: true
    },
    externals: {
      moment: "moment",
      jquery: "jQuery",
      handlebars: {
        root: "Handlebars",
        amd: "handlebars.runtime",
        commonjs2: "handlebars/runtime",
        commonjs: "handlebars/runtime"
      }
    },
    resolve: {
      modules: [PATHS.src, PATHS.nodeModules], // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ["*", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    node: {
      fs: "empty"
    },
    module: {
      rules: [
        {
          test: /\.hbs$/,
          loader: "handlebars-loader",
          options: {
            helperDirs: path.join(PATHS.src, "hbs/helpers"),
            runtime: "handlebars",
            precompileOptions: {
                knownHelpersOnly: false
            }
          }
        },
        {
          test: /\.tsx?$/,
          enforce: "pre",
          loader: "tslint-loader",
          options: {
            emitErrors: true,
            failOnHint: true
          }
        },
        {
          test: /\.tsx?$/,
          include: PATHS.src,
          use: env.awesome
            ? [
                {
                  loader: "awesome-typescript-loader",
                  options: {
                    transpileOnly: false,
                    useTranspileModule: false,
                    sourceMap: isSourceMap
                  }
                }
              ]
            : [
                {
                  loader: "ts-loader",
                  options: {
                    transpileOnly: false,
                    compilerOptions: {
                      sourceMap: isSourceMap,
                      noEmitOnError: true
                    }
                  }
                }
              ]
        },
        {
          test: /\.(html)$/,
          use: {
            loader: "html-loader",
            options: {
              minimize: true,
              removeComments: true,
              collapseWhitespace: true
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(isDev ? "development" : "production")
        }
      }),
      ...(isDev
        ? [
            new webpack.HotModuleReplacementPlugin({
              // multiStep: true, // better performance with many files
            }),
            new webpack.NamedModulesPlugin()
          ]
        : []),
      ...(isBuild
        ? [new webpack.LoaderOptionsPlugin({ minimize: true, debug: true })]
        : []),
      ...(isBuild
        ? [
            new webpack.optimize.UglifyJsPlugin({
              include: /\.min\.js$/,
              beautify: false,
              compress: {
                screw_ie8: true
              },
              comments: false,
              sourceMap: isSourceMap
            })
          ]
        : []),
      ...(isBuild ? [new DtsBundlePlugin()] : [])
    ]
  };
};
