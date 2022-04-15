import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration, WebpackPluginInstance } from "webpack";
import WebpackObfuscator from "webpack-obfuscator";

import Config from "./src/server/helpers/config";

const plugins: WebpackPluginInstance[] = [
	new CopyPlugin({
		patterns: [
			{
				from: path.resolve(__dirname, "src/client"),
				to: path.resolve(__dirname, "build/client"),
				globOptions: {
					ignore: ["**/*.ts", "**/tsconfig.json", "**/*.css", "**/*.html", "**/*.ttf"]
				}
			}
		]
	}),
	new HtmlWebpackPlugin({
		title: "copterjs",
		filename: "index.html",
		template: path.resolve(__dirname, "src/client/_index.html")
	})
];

// obfuscate js bundle in production only
if (Config.IS_PROD) {
	plugins.push(
		new WebpackObfuscator({
			rotateStringArray: true
		})
	);
}

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
				test: /\.[jt]s$/,
				use: ["babel-loader", "ts-loader"],
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource"
			}
		]
	},
	output: {
		path: path.resolve(__dirname, "build/client"),
		filename: "[name].js",
		sourceMapFilename: "[name].js.map",
		assetModuleFilename: "[name][ext]",
		clean: true
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	target: ["web", "es5"],
	optimization: {
		minimize: Config.IS_PROD
	},
	plugins: plugins
} as Configuration;
