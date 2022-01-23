import Game from "./game.js";

export default class WindowHandler {
	constructor(canvas: HTMLCanvasElement, game: Game) {
		const gameWindowChangeHandler = () => {
			const ctx = canvas.getContext("2d");
			const [width, height] = resizeCanvas();

			const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			canvas.width = width;
			canvas.height = height;
			ctx.putImageData(imgData, 0, 0);

			game.resizeGameWindow();
		};

		const resizeCanvas = () => {
			return [Math.max(screen.width, window.innerWidth), Math.max(screen.height, window.innerHeight)];
		};

		window.addEventListener("resize", () => {
			gameWindowChangeHandler();
		});

		window.addEventListener("orientationchange", () => {
			gameWindowChangeHandler();
		});

		[canvas.width, canvas.height] = resizeCanvas();
		game.resizeGameWindow();
	}
}
