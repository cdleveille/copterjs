// https://webpack.js.org/configuration/

import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration, WebpackPluginInstance } from "webpack";
import WebpackObfuscator from "webpack-obfuscator";
import { InjectManifest } from "workbox-webpack-plugin";

import Config from "./src/server/helpers/config";

const plugins: WebpackPluginInstance[] = [
	new CopyPlugin({
		patterns: [
			{
				from: path.resolve(__dirname, "src/client"),
				to: path.resolve(__dirname, "build/client"),
				globOptions: {
					ignore: ["**/*.ts", "**/tsconfig.json", "**/*.html", "**/css/**/*", "**/font/**/*", "**/img/**/*"]
				}
			},
			{
				from: path.resolve(__dirname, "src/client/img/icons"),
				to: path.resolve(__dirname, "build/client/assets/icons")
			}
		]
	}),
	new HtmlWebpackPlugin({
		title: "copterjs",
		filename: "index.html",
		template: path.resolve(__dirname, "src/client/_index.html")
	}),
	// obfuscate js bundle in production only
	Config.IS_PROD &&
		new WebpackObfuscator({
			compact: true,
			controlFlowFlattening: true,
			controlFlowFlatteningThreshold: 1,
			disableConsoleOutput: true,
			identifierNamesGenerator: "hexadecimal",
			log: false,
			numbersToExpressions: true,
			renameGlobals: false,
			selfDefending: true,
			simplify: true,
			splitStrings: true,
			splitStringsChunkLength: 5,
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
		}),
	new InjectManifest({
		swSrc: path.resolve(__dirname, "src/client/sw.ts")
	})
].filter((n) => n);

export default {
	mode: Config.IS_PROD ? "production" : "development",
	entry: {
		bundle: path.resolve(__dirname, "src/client/app/index.ts")
		//sw: path.resolve(__dirname, "src/client/sw.ts")
	},
	devtool: Config.IS_PROD ? false : "inline-source-map",
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
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
				type: "asset/resource"
			}
		]
	},
	output: {
		path: path.resolve(__dirname, "build/client"),
		filename: (pathData) => {
			return pathData.chunk.name === "sw" ? "[name].js" : "[name]_hash_[contenthash].js";
		},
		sourceMapFilename: "[name].js.map",
		assetModuleFilename: "assets/[name]_hash_[contenthash][ext]",
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
		minimize: Config.IS_PROD
	},
	plugins: plugins
} as Configuration;
