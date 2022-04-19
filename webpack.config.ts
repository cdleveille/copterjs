// https://webpack.js.org/configuration/

import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration } from "webpack";
import WebpackObfuscator from "webpack-obfuscator";
import { InjectManifest } from "workbox-webpack-plugin";

import Config from "./src/server/helpers/config";

export default {
	mode: Config.IS_PROD ? "production" : "development",
	entry: {
		main: path.resolve(__dirname, "src/client/app/index.ts")
	},
	devtool: Config.IS_PROD ? false : "inline-source-map",
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/i,
				include: path.resolve(__dirname, "src/client"),
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
				]
			},
			{
				test: /\.css$/i,
				include: path.resolve(__dirname, "src/client"),
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif|webp|ttf)$/i,
				include: path.resolve(__dirname, "src/client"),
				type: "asset/resource"
			}
		]
	},
	output: {
		path: path.resolve(__dirname, "build/client"),
		filename: "[name].hash.[contenthash].bundle.js",
		assetModuleFilename: "assets/[name].hash.[contenthash][ext]",
		sourceMapFilename: "[name].js.map",
		clean: true
	},
	resolve: {
		extensions: [".ts", ".js"],
		alias: {
			"socket.io-client": path.resolve(__dirname, "node_modules/socket.io-client/dist/socket.io.js")
		}
	},
	target: ["web", "es5"],
	optimization: {
		minimize: Config.IS_PROD,
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
	plugins: [
		new InjectManifest({
			swSrc: path.resolve(__dirname, "src/client/sw.ts")
		}),

		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "src/client"),
					to: path.resolve(__dirname, "build/client"),
					toType: "dir",
					globOptions: {
						ignore: [
							"**/*.ts",
							"**/tsconfig.json",
							"**/*.html",
							"**/css/**/*",
							"**/font/**/*",
							"**/img/**/*"
						]
					}
				},
				{
					from: path.resolve(__dirname, "src/client/img/icons"),
					to: path.resolve(__dirname, "build/client/icons"),
					toType: "dir"
				}
			]
		}),

		new HtmlWebpackPlugin({
			title: "copterjs",
			filename: "index.html",
			template: path.resolve(__dirname, "src/client/_index.html")
		}),

		Config.IS_PROD &&
			new WebpackObfuscator(
				{
					compact: true,
					disableConsoleOutput: true,
					identifierNamesGenerator: "hexadecimal",
					log: false,
					numbersToExpressions: true,
					renameGlobals: false,
					selfDefending: true,
					simplify: true,
					splitStrings: true,
					splitStringsChunkLength: 2,
					stringArray: true,
					stringArrayCallsTransform: true,
					stringArrayEncoding: ["rc4"],
					stringArrayIndexShift: true,
					stringArrayRotate: true,
					stringArrayShuffle: true,
					stringArrayWrappersCount: 5,
					stringArrayWrappersChainedCalls: true,
					stringArrayWrappersParametersMaxCount: 5,
					stringArrayWrappersType: "function",
					stringArrayThreshold: 1,
					transformObjectKeys: true,
					unicodeEscapeSequence: false
				},
				["sw.js"]
			)
	].filter((n) => n)
} as Configuration;
