import Game from "./game.js";
import { IResolution } from "./types/abstract.js";

export default class WindowHandler {
	constructor(canvas: HTMLCanvasElement, game: Game) {
		const gameWindowChangeHandler = () => {
			const newRes = resizeCanvas();
			canvas.width = newRes.width;
			canvas.height = newRes.height;
			game.resizeGameWindow(canvas);
		};

		// use max available 16:9 area in window
		const resizeCanvas = (): IResolution => {
			const heightUsingMaxWidth = Math.floor(window.innerWidth * (9 / 16));
			if (heightUsingMaxWidth <= window.innerHeight)
				return { width: window.innerWidth, height: heightUsingMaxWidth };

			const widthUsingMaxHeight = Math.floor(window.innerHeight * (16 / 9));
			return { width: widthUsingMaxHeight, height: window.innerHeight };
		};

		window.addEventListener("resize", () => {
			gameWindowChangeHandler();
		});

		window.addEventListener("orientationchange", () => {
			gameWindowChangeHandler();
		});

		gameWindowChangeHandler();
	}
}
