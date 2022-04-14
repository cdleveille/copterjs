import CopyPlugin from "copy-webpack-plugin";
import path from "path";
import { Configuration, WebpackPluginInstance } from "webpack";
import WebpackObfuscator from "webpack-obfuscator";

import Config from "./src/server/helpers/config";

const nodeModulesPath = path.resolve(__dirname, "node_modules");

const plugins: WebpackPluginInstance[] = [
	new CopyPlugin({
		patterns: [
			{
				from: path.resolve(__dirname, "src/client"),
				to: path.resolve(__dirname, "build/client"),
				globOptions: {
					ignore: ["**/*.ts", "**/tsconfig.json"]
				}
			}
		]
	})
];

// only obfuscate js bundle in production
if (Config.IS_PROD)
	plugins.push(
		new WebpackObfuscator({
			rotateStringArray: true
		})
	);

export default {
	mode: Config.IS_PROD ? "production" : "development",
	entry: {
		bundle: "./src/client/app/index.ts",
		sw: "./src/client/sw.ts"
	},
	devtool: Config.IS_PROD ? false : "inline-source-map",
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
				use: "ts-loader",
				exclude: [/node_modules/, nodeModulesPath]
			}
		]
	},
	output: {
		path: path.resolve(__dirname, "build/client"),
		filename: "[name].js",
		sourceMapFilename: "[name].js.map"
	},
	resolve: {
		extensions: [".ts", ".js", ".tsx", ".jsx"]
	},
	optimization: {
		minimize: Config.IS_PROD
	},
	plugins: plugins
} as Configuration;
