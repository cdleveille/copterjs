import { Game } from "./game";
import { IArea } from "./types/abstract";

export class WindowHandler {
	canvas: HTMLCanvasElement;
	game: Game;

	constructor(canvas: HTMLCanvasElement, game: Game) {
		this.canvas = canvas;
		this.game = game;

		window.addEventListener("resize", () => {
			this.resize();
		});

		window.addEventListener("orientationchange", () => {
			this.resize();
		});

		window.addEventListener("online", () => {
			game.goOnline();
		});

		window.addEventListener("offline", () => {
			game.goOffline();
		});

		this.resize();
	}

	resize() {
		const newRes = this.getNewGameResolution();
		this.canvas.width = Math.max(screen.width, window.innerWidth);
		this.canvas.height = Math.max(screen.height, window.innerHeight);

		const ghostCanvas = document.getElementById("ghost-canvas") as HTMLCanvasElement;
		ghostCanvas.width = newRes.width;
		ghostCanvas.height = newRes.height;

		this.game.resize(this.canvas, ghostCanvas);
	}

	// use max available 16:9 area in window
	getNewGameResolution(): IArea {
		const heightUsingMaxWidth = Math.floor(window.innerWidth * (9 / 16));
		if (heightUsingMaxWidth <= window.innerHeight) return { width: window.innerWidth, height: heightUsingMaxWidth };

		const widthUsingMaxHeight = Math.floor(window.innerHeight * (16 / 9));
		return { width: widthUsingMaxHeight, height: window.innerHeight };
	}
}
