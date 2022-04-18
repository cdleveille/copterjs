// https://webpack.js.org/configuration/

import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration, WebpackPluginInstance } from "webpack";

// import { InjectManifest } from "workbox-webpack-plugin";
import Config from "./src/server/helpers/config";

const plugins: WebpackPluginInstance[] = [
	// new InjectManifest({
	// 	swSrc: path.resolve(__dirname, "src/client/sw.ts")
	// }),

	new CopyPlugin({
		patterns: [
			{
				from: path.resolve(__dirname, "src/client"),
				to: path.resolve(__dirname, "build/client"),
				toType: "dir",
				globOptions: {
					ignore: ["**/*.ts", "**/tsconfig.json", "**/*.html", "**/font/**/*"]
				}
			}
		]
	}),

	new HtmlWebpackPlugin({
		title: "copterjs",
		filename: "index.html",
		template: path.resolve(__dirname, "src/client/_index.html")
	})
].filter((n) => n);

export default {
	mode: "development", //Config.IS_PROD ? "production" : "development",
	entry: {
		main: path.resolve(__dirname, "src/client/app/index.ts")
	},
	devtool: "inline-source-map", //Config.IS_PROD ? false : "inline-source-map",
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/i,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: [["@babel/preset-env", { debug: !Config.IS_PROD }]],
							plugins: ["@babel/plugin-transform-runtime"],
							targets: "defaults"
						}
					},
					{ loader: "ts-loader" }
				],
				exclude: path.resolve(__dirname, "node_modules")
			}
		]
	},
	output: {
		path: path.resolve(__dirname, "build/client"),
		filename: "[name].[contenthash].bundle.js",
		sourceMapFilename: "[name].js.map"
	},
	resolve: {
		extensions: [".ts", ".js"],
		alias: {
			"socket.io-client": path.resolve(__dirname, "node_modules/socket.io-client/dist/socket.io.js")
		}
	},
	target: ["web", "es5"],
	optimization: {
		minimize: false, //Config.IS_PROD,
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendor",
					chunks: "all",
					priority: 10
				}
			}
		}
	},
	plugins: plugins
} as Configuration;
